const prismaService = require('../../PrismaService');
const { tryGraphWrite } = require('../../graphServices');
const prisma = prismaService.getClient();
const { getRuntimeCommandRegistry } = require('../../system/RuntimeCommandRegistry');
const Command = require('../../system/Command');
const { t } = require('../../../i18n');

/**
 * Creates новую команду (временную or постоянную)
 * @param {object} node - Instance node from graph
 * @param {object} context - Context execution graph
 * @param {object} helpers - Helper functions engine
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse, memo } = helpers;
    const { botId, botManager } = context;

    try {
        const name = await resolvePinValue(node, 'name');
        const description = await resolvePinValue(node, 'description', '');
        let aliases = await resolvePinValue(node, 'aliases', []);
        const cooldown = await resolvePinValue(node, 'cooldown', 0);
        let allowedChatTypes = await resolvePinValue(node, 'allowedChatTypes', ['chat', 'private']);
        const permissionName = await resolvePinValue(node, 'permissionName', null);
        const temporary = await resolvePinValue(node, 'temporary', false);

        if (typeof aliases === 'string') {
            try {
                const normalizedString = aliases.replace(/'/g, '"');
                aliases = JSON.parse(normalizedString);
            } catch (e) {
                console.warn(t('nodes:error_60053254'), e);
                aliases = [];
            }
        }

        if (typeof allowedChatTypes === 'string') {
            try {
                const normalizedString = allowedChatTypes.replace(/'/g, '"');
                allowedChatTypes = JSON.parse(normalizedString);
            } catch (e) {
                console.warn(t('nodes:error_516e12b4'), e);
                allowedChatTypes = ['chat', 'private'];
            }
        }

        if (!name) {
            console.error(t('nodes:validation_d7d1d181'));
            memo.set(`${node.id}:success`, false);
            memo.set(`${node.id}:commandId`, null);
            await traverse(node, 'exec');
            return;
        }

        const isolated = await tryGraphWrite(context, 'create_command', String(name), { name });
        if (isolated?.handled) {
            memo.set(`${node.id}:success`, true);
            memo.set(`${node.id}:commandId`, isolated.id || null);
            await traverse(node, 'exec');
            return;
        }

        let commandId = null;

        if (temporary) {
            commandId = `temp_${Date.now()}`;

            let permissionId = null;

            if (permissionName) {
                const permission = await prisma.permission.findFirst({
                    where: {
                        botId,
                        name: permissionName
                    }
                });

                if (permission) {
                    permissionId = permission.id;
                }
            }

            const tempCommand = new Command({
                name,
                description: description || '',
                aliases: Array.isArray(aliases) ? aliases : [],
                cooldown: cooldown || 0,
                allowedChatTypes: Array.isArray(allowedChatTypes) ? allowedChatTypes : ['chat', 'private'],
                args: [],
                owner: 'runtime',
            });

            tempCommand.permissionId = permissionId;
            tempCommand.isTemporary = true;
            tempCommand.tempId = commandId;
            tempCommand.isVisual = false;

            tempCommand.handler = () => {
                // Handler will вызван through validate_and_run_command в BotProcess
            };

            // Регистрируем in runtime registry (for главного process)
            const runtimeRegistry = getRuntimeCommandRegistry();
            runtimeRegistry.register(botId, name, tempCommand);

            // Also регистрируем алиасы in runtime registry
            if (Array.isArray(aliases)) {
                for (const alias of aliases) {
                    runtimeRegistry.register(botId, alias, tempCommand);
                }
            }

            // Отправляем IPC message in child process for регистрации commands
            if (botManager && botManager.processManager) {
                botManager.processManager.sendMessage(botId, {
                    type: 'register_temp_command',
                    commandData: {
                        name,
                        description: description || '',
                        aliases: Array.isArray(aliases) ? aliases : [],
                        cooldown: cooldown || 0,
                        allowedChatTypes: Array.isArray(allowedChatTypes) ? allowedChatTypes : ['chat', 'private'],
                        permissionId,
                        tempId: commandId,
                    }
                });
            }

            console.log(`[create_command] Временная команда "${name}" создана с ID ${commandId}`);
        } else {
            const existingCommand = await prisma.command.findFirst({
                where: { botId, name }
            });

            if (existingCommand) {
                console.error(`[create_command] Команда "${name}" уже существует`);
                memo.set(`${node.id}:success`, false);
                memo.set(`${node.id}:commandId`, null);
                await traverse(node, 'exec');
                return;
            }

            let permissionId = null;
            if (permissionName) {
                const permission = await prisma.permission.findFirst({
                    where: {
                        botId,
                        name: permissionName
                    }
                });

                if (permission) {
                    permissionId = permission.id;
                } else {
                    console.warn(`[create_command] Право "${permissionName}" не найдено, команда будет создана без права`);
                }
            }

            const newCommand = await prisma.command.create({
                data: {
                    botId,
                    name,
                    description: description || '',
                    aliases: JSON.stringify(Array.isArray(aliases) ? aliases : []),
                    permissionId: permissionId || null,
                    cooldown: cooldown || 0,
                    allowedChatTypes: JSON.stringify(Array.isArray(allowedChatTypes) ? allowedChatTypes : ['chat', 'private']),
                    isVisual: true,
                    argumentsJson: '[]',
                    graphJson: JSON.stringify({
                        nodes: [],
                        edges: []
                    }),
                    pluginOwnerId: null
                }
            });

            commandId = newCommand.id;
            console.log(`[create_command] Постоянная команда "${name}" создана с ID ${commandId}`);

            if (botManager && botManager.reloadBotConfigInRealTime) {
                botManager.reloadBotConfigInRealTime(botId);
            }
        }

        memo.set(`${node.id}:commandId`, commandId);
        memo.set(`${node.id}:success`, true);
    } catch (error) {
        console.error(t('nodes:error_e3e5a4b5'), error);
        memo.set(`${node.id}:success`, false);
        memo.set(`${node.id}:commandId`, null);
    }

    await traverse(node, 'exec');
}

module.exports = {
    execute,
};
