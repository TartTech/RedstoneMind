const { v4: uuidv4 } = require('uuid');
const UserService = require('../UserService');
const { getRuntimeCommandRegistry } = require('../system/RuntimeCommandRegistry');
const botHistoryStore = require('../BotHistoryStore');
const { t } = require('../../i18n');

// Кулдауны and предупреждения - глобальные for всех инстансов
const cooldowns = new Map();
const warningCache = new Map();
const WARNING_COOLDOWN = 10 * 1000;

function reserveCooldown(botId, dbCommand, user, permission) {
    if (!(dbCommand.cooldown > 0) || user.isOwner) return null;
    const domain = (permission?.name || '').split('.')[0] || 'user';
    if (user.hasPermission(`${domain}.cooldown.bypass`)) return null;

    const key = `${botId}:${dbCommand.name}:${user.id}`;
    const now = Date.now();
    const lastUsed = cooldowns.get(key);
    if (lastUsed && (now - lastUsed < dbCommand.cooldown * 1000)) {
        return {
            blocked: true,
            timeLeft: Math.ceil((dbCommand.cooldown * 1000 - (now - lastUsed)) / 1000),
        };
    }

    cooldowns.set(key, now);
    return { blocked: false, key, stamp: now };
}

class CommandExecutionService {
    constructor({
        botProcessManager,
        cacheManager,
        eventGraphManager,
        commandRepository,
        permissionRepository,
        groupRepository,
        logger
    }) {
        this.processManager = botProcessManager;
        this.cache = cacheManager;
        this.eventGraphManager = eventGraphManager;
        this.commandRepository = commandRepository;
        this.permissionRepository = permissionRepository;
        this.groupRepository = groupRepository;
        this.logger = logger;
    }

    async handleCommandValidation(botConfig, message) {
        const { commandName, username, args, typeChat } = message;
        const botId = botConfig.id;

        try {
            // Получаем конфигурацию from кеша or загружаем from БД
            const botConfigCache = await this.cache.getOrLoadBotConfig(botId);

            const user = await UserService.getUser(username, botId, botConfig);

            const child = this.processManager.getProcess(botId);
            if (!child) return;

            if (user.isBlacklisted) {
                child.send({
                    type: 'handle_blacklist',
                    commandName,
                    username,
                    typeChat
                });
                return;
            }

            const mainCommandName = botConfigCache.commandAliases.get(commandName) || commandName;
            let dbCommand = botConfigCache.commands.get(mainCommandName);

            // If command not найдена in БД, проверяем runtime registry (временные commands)
            if (!dbCommand) {
                const runtimeRegistry = getRuntimeCommandRegistry();
                const tempCommand = runtimeRegistry.get(botId, mainCommandName);

                if (tempCommand) {
                    // Преобразуем временную команду in format dbCommand
                    dbCommand = {
                        name: tempCommand.name,
                        isEnabled: true,
                        allowedChatTypes: JSON.stringify(tempCommand.allowedChatTypes || ['chat', 'private']),
                        permissionId: tempCommand.permissionId || null,
                        cooldown: tempCommand.cooldown || 0,
                        isTemporary: true
                    };
                }
            }

            if (!dbCommand || (!dbCommand.isEnabled && !user.isOwner)) {
                return;
            }

            const allowedTypes = JSON.parse(dbCommand.allowedChatTypes || '[]');
            if (!allowedTypes.includes(typeChat) && !user.isOwner) {
                // Type chat not разрешен for обычного user - просто молча игнорируем
                // Никаких сообщений об ошибке not отправляем
                return;
            }

            // Проверяем required аргументы After verification type chat
            // чтобы обычные users not видели errors in неразрешенных чатах
            if (message.commandArgs) {
                for (const argDef of message.commandArgs) {
                    if (argDef.required && (args[argDef.name] === undefined || args[argDef.name] === null)) {
                        const usage = message.commandArgs.map(arg => {
                            return arg.required ? `<${arg.description || arg.name}>` : `[${arg.description || arg.name}]`;
                        }).join(' ');

                        child.send({
                            type: 'send_message',
                            typeChat,
                            message: t('core:error_18fc663a', { argDef: argDef.description || argDef.name }),
                            username
                        });
                        child.send({
                            type: 'send_message',
                            typeChat,
                            message: `Использование: ${botConfig.prefix || '@'}${dbCommand.name} ${usage}`,
                            username
                        });
                        return;
                    }
                }
            }

            const permission = dbCommand.permissionId ? botConfigCache.permissionsById.get(dbCommand.permissionId) : null;
            if (permission && !user.hasPermission(permission.name) && !user.isOwner) {
                child.send({
                    type: 'handle_permission_error',
                    commandName: dbCommand.name,
                    username,
                    typeChat
                });
                return;
            }

            const reservation = reserveCooldown(botId, dbCommand, user, permission);
            if (reservation?.blocked) {
                child.send({
                    type: 'handle_cooldown',
                    commandName: dbCommand.name,
                    username,
                    typeChat,
                    timeLeft: reservation.timeLeft
                });
                return;
            }

            if (this.eventGraphManager) {
                this.eventGraphManager.handleEvent(botId, 'command', {
                    commandName: dbCommand.name,
                    user: { username },
                    args,
                    typeChat
                });
            }

            botHistoryStore.addCommandLog(botId, {
                username,
                command: dbCommand.name,
                args: args || {},
                typeChat,
                success: true,
            });

            child.send({
                type: 'execute_handler',
                commandName: dbCommand.name,
                username,
                args,
                typeChat,
                cooldownKey: reservation?.key,
                cooldownStamp: reservation?.stamp,
            });

        } catch (error) {
            this.logger.error({ botId, command: commandName, username, error }, t('services:error_cc3ece5c'));
            this.sendMessageToBot(botId, t('services:error_b8adeccf'), 'private', username);
        }
    }

    async validateAndExecuteCommandForApi(botId, username, commandName, args) {
        const botConfig = this.processManager.getProcess(botId)?.botConfig;
        if (!botConfig) {
            throw new Error('Bot configuration not found.');
        }

        const typeChat = 'websocket';

        const botConfigCache = await this.cache.getOrLoadBotConfig(botId);

        const user = await UserService.getUser(username, botId, botConfig);

        if (user.isBlacklisted) {
            throw new Error(`User '${username}' is blacklisted.`);
        }

        const mainCommandName = botConfigCache.commandAliases.get(commandName) || commandName;
        let dbCommand = botConfigCache.commands.get(mainCommandName);

        // If command not найдена in БД, проверяем runtime registry (временные commands)
        if (!dbCommand) {
            const runtimeRegistry = getRuntimeCommandRegistry();
            const tempCommand = runtimeRegistry.get(botId, mainCommandName);

            if (tempCommand) {
                // Преобразуем временную команду in format dbCommand
                dbCommand = {
                    name: tempCommand.name,
                    isEnabled: true,
                    allowedChatTypes: JSON.stringify(tempCommand.allowedChatTypes || ['chat', 'private']),
                    permissionId: tempCommand.permissionId || null,
                    cooldown: tempCommand.cooldown || 0,
                    isTemporary: true
                };
            }
        }

        if (!dbCommand || (!dbCommand.isEnabled && !user.isOwner)) {
            throw new Error(`Command '${commandName}' not found or is disabled.`);
        }

        // WebSocket - универсальный транспорт
        if (typeChat !== 'websocket') {
            const allowedTypes = JSON.parse(dbCommand.allowedChatTypes || '[]');
            if (!allowedTypes.includes(typeChat) && !user.isOwner) {
                throw new Error(`Command '${commandName}' cannot be used in this chat type.`);
            }
        }

        const permission = dbCommand.permissionId ? botConfigCache.permissionsById.get(dbCommand.permissionId) : null;
        if (permission && !user.hasPermission(permission.name) && !user.isOwner) {
            throw new Error(`User '${username}' has insufficient permissions.`);
        }

        const reservation = reserveCooldown(botId, dbCommand, user, permission);
        if (reservation?.blocked) {
            throw new Error(`Command on cooldown for user '${username}'. Please wait ${reservation.timeLeft} seconds.`);
        }

        try {
            return await this._executeCommandInProcess(botId, dbCommand.name, args, user, typeChat);
        } catch (error) {
            this.releaseCooldown(reservation?.key, reservation?.stamp);
            throw error;
        }
    }

    releaseCooldown(cooldownKey, cooldownStamp) {
        if (typeof cooldownKey !== 'string' || typeof cooldownStamp !== 'number') return;
        if (cooldowns.get(cooldownKey) === cooldownStamp) {
            cooldowns.delete(cooldownKey);
        }
    }

    clearBotUserCache(botId) {
        if (!this._pendingUserCacheClears) this._pendingUserCacheClears = new Map();
        const pending = this._pendingUserCacheClears.get(botId);
        if (pending) clearTimeout(pending);
        const timer = setTimeout(() => {
            this._pendingUserCacheClears.delete(botId);
            this._flushBotUserCache(botId);
        }, 500);
        if (typeof timer.unref === 'function') timer.unref();
        this._pendingUserCacheClears.set(botId, timer);
    }

    _flushBotUserCache(botId) {
        const prefix = `${botId}:`;
        if (UserService.cache && typeof UserService.cache.keys === 'function') {
            for (const key of UserService.cache.keys()) {
                if (String(key).startsWith(prefix)) {
                    UserService.cache.delete(key);
                }
            }
        }
        if (typeof this.processManager.sendMessage === 'function') {
            this.processManager.sendMessage(botId, { type: 'invalidate_all_user_cache' });
        }
    }

    async _executeCommandInProcess(botId, commandName, args, user, typeChat) {
        return new Promise((resolve, reject) => {
            const child = this.processManager.getProcess(botId);
            if (!child || child.killed) {
                return reject(new Error('Bot is not running'));
            }

            const requestId = uuidv4();

            // Таймаут on выполнение commands
            const timeout = setTimeout(() => {
                reject(new Error('Command execution timed out.'));
            }, 10000);

            this.processManager.addCommandRequest(requestId, {
                resolve: (result) => {
                    clearTimeout(timeout);

                    botHistoryStore.addCommandLog(botId, {
                        username: user.username,
                        command: commandName,
                        args: args || {},
                        success: true
                    });

                    resolve(result);
                },
                reject: (error) => {
                    clearTimeout(timeout);

                    botHistoryStore.addCommandLog(botId, {
                        username: user.username,
                        command: commandName,
                        args: args || {},
                        success: false,
                        error: error.message || String(error)
                    });

                    reject(error);
                }
            });

            child.send({
                type: 'execute_command_request',
                requestId,
                payload: {
                    commandName,
                    args: args || {},
                    username: user.username,
                    typeChat
                }
            });
        });
    }

    sendMessageToBot(botId, message, chatType = 'command', username = null) {
        const child = this.processManager.getProcess(botId);
        if (child && child.api) {
            child.api.sendMessage(chatType, message, username);
            return { success: true };
        }
        return { success: false, message: t('services:msg_f833d35c') };
    }

    async handleCommandRegistration(botId, commandConfig) {
        try {
            let permissionId = null;

            if (commandConfig.permissions) {
                let permission = await this.permissionRepository.findByName(botId, commandConfig.permissions);

                if (!permission) {
                    try {
                        permission = await this.permissionRepository.create({
                            botId,
                            name: commandConfig.permissions,
                            description: t('services:success_59feb915', { commandConfig: commandConfig.name }),
                            owner: commandConfig.owner,
                        });
                    } catch (error) {
                        if (error.code !== 'P2002') throw error;
                        permission = await this.permissionRepository.findByName(botId, commandConfig.permissions);
                    }
                }
                permissionId = permission?.id || null;
            }

            const createData = {
                botId,
                name: commandConfig.name,
                description: commandConfig.description,
                aliases: JSON.stringify(commandConfig.aliases || []),
                owner: commandConfig.owner,
                permissionId: permissionId,
                allowedChatTypes: JSON.stringify(commandConfig.allowedChatTypes || []),
                cooldown: commandConfig.cooldown || 0,
            };

            const updateData = {
                description: commandConfig.description,
                owner: commandConfig.owner,
                aliases: JSON.stringify(commandConfig.aliases || []),
                allowedChatTypes: JSON.stringify(commandConfig.allowedChatTypes || []),
                cooldown: commandConfig.cooldown || 0,
            };

            const existingCommand = await this.commandRepository.findByName(botId, commandConfig.name);
            if (existingCommand) {
                if (existingCommand.permissionId === null && permissionId !== null) {
                    updateData.permissionId = permissionId;
                }
                await this.commandRepository.update(existingCommand.id, updateData);
            } else {
                try {
                    await this.commandRepository.create(createData);
                } catch (error) {
                    if (error.code !== 'P2002') throw error;
                    const raced = await this.commandRepository.findByName(botId, commandConfig.name);
                    if (!raced) throw error;
                    if (raced.permissionId === null && permissionId !== null) {
                        updateData.permissionId = permissionId;
                    }
                    await this.commandRepository.update(raced.id, updateData);
                }
            }

            this.cache.deleteBotConfig(botId);
        } catch (error) {
            this.logger.error({ botId, commandName: commandConfig.name, error }, t('services:error_1faddb6b'));
        }
    }

    async handleGroupRegistration(botId, groupConfig) {
        try {
            if (!groupConfig.name || !groupConfig.owner) {
                this.logger.warn({ botId, groupConfig }, t('services:msg_4a364bf8'));
                return;
            }

            await this.groupRepository.upsertGroup(botId, groupConfig.name, {
                owner: groupConfig.owner,
                description: groupConfig.description || ''
            });

            this.logger.debug({ botId, groupName: groupConfig.name }, t('services:msg_e5bfd74b'));
            this.cache.deleteBotConfig(botId);
        } catch (error) {
            this.logger.error({ botId, groupName: groupConfig.name, error }, t('services:error_129e5e11'));
        }
    }

    async handlePermissionsRegistration(botId, permissions) {
        try {
            for (const perm of permissions) {
                if (!perm.name || !perm.owner) {
                    this.logger.warn({ botId, perm }, t('services:msg_c004b542'));
                    continue;
                }

                const existing = await this.permissionRepository.findByName(botId, perm.name);
                if (existing) {
                    await this.permissionRepository.update(existing.id, { description: perm.description });
                } else {
                    await this.permissionRepository.create({
                        botId,
                        name: perm.name,
                        description: perm.description || '',
                        owner: perm.owner,
                    });
                }
            }

            this.cache.deleteBotConfig(botId);
        } catch (error) {
            this.logger.error({ botId, error }, t('services:error_18a3950b'));
        }
    }

    async handleAddPermissionsToGroup(botId, message) {
        try {
            const { groupName, permissionNames } = message;

            // Находим группу
            const group = await this.groupRepository.findByName(botId, groupName);
            if (!group) {
                this.logger.warn({ botId, groupName }, t('bots:msg_7d233798'));
                return;
            }

            // Добавляем каждое право in группу
            for (const permName of permissionNames) {
                const permission = await this.permissionRepository.findByName(botId, permName);
                if (!permission) {
                    this.logger.warn({ botId, groupName, permName }, t('bots:msg_0657020d'));
                    continue;
                }

                await this.groupRepository.addPermissionToGroup(group.id, permission.id, this.permissionRepository.prisma);
                this.logger.debug({ botId, groupName, permName }, t('services:msg_e43435db'));
            }

            this.cache.deleteBotConfig(botId);
            this.clearBotUserCache(botId);
        } catch (error) {
            this.logger.error({ botId, groupName: message.groupName, error }, t('services:error_2fd07d80'));
        }
    }
}

module.exports = CommandExecutionService;
