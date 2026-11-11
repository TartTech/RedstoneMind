const DependencyResolver = require('../domain/services/DependencyResolver');
const { decrypt } = require('../utils/crypto');
const UserService = require('../UserService');
const PermissionManager = require('../PermissionManager');
const CrashRestartManager = require('./CrashRestartManager');
const BotIPCMessageRouter = require('./BotIPCMessageRouter');
const ErrorHandler = require('../errors/ErrorHandler');

const dependencyResolver = new DependencyResolver();
const errorHandler = new ErrorHandler({ logger: console });

class BotLifecycleService {
    constructor({
        botRepository,
        pluginRepository,
        commandRepository,
        permissionRepository,
        botProcessManager,
        cacheManager,
        resourceMonitorService,
        telemetryService,
        eventGraphManager,
        commandExecutionService,
        logger
    }) {
        this.botRepository = botRepository;
        this.pluginRepository = pluginRepository;
        this.commandRepository = commandRepository;
        this.permissionRepository = permissionRepository;
        this.processManager = botProcessManager;
        this.cache = cacheManager;
        this.resourceMonitor = resourceMonitorService;
        this.telemetry = telemetryService;
        this.eventGraphManager = eventGraphManager;
        this.commandExecutionService = commandExecutionService;
        this.logger = logger;

        this.logCache = new Map();
        this.startingBots = new Set();
        this.stoppingBots = new Set();
        this.crashRestartManager = new CrashRestartManager(5, 60000);

        this.ipcRouter = new BotIPCMessageRouter({
            eventGraphManager: this.eventGraphManager,
            commandExecutionService: this.commandExecutionService,
            processManager: this.processManager,
            resourceMonitor: this.resourceMonitor,
            logger: this.logger,
            crashRestartManager: this.crashRestartManager,
            appendLog: this.appendLog.bind(this),
            emitStatusUpdate: this.emitStatusUpdate.bind(this),
            restartBot: this.restartBot.bind(this),
            stopBot: this.stopBot.bind(this),
            isIntentionalStop: (botId) => this.stoppingBots.has(botId),
            getBotConfig: (botId) => this.processManager.getProcess(botId)?.botConfig,
        });
    }

    async startBot(botConfig) {
        const botId = botConfig.id;

        if (this.processManager.isRunning(botId) || this.startingBots.has(botId)) {
            this.appendLog(botId, t('services:log_a08f3f41'));
            return { success: false, message: t('services:msg_6d93313a') };
        }

        this.startingBots.add(botId);
        try {
        await this._syncSystemPermissions(botId);
        await this.loadConfigForBot(botId);
        this.logCache.set(botId, []);
        this.emitStatusUpdate(botId, 'starting', '');

        const allPluginsForBot = await this.pluginRepository.findByBotId(botId);
        const enabledPluginsForBot = allPluginsForBot.filter((p) => p.isEnabled);
        const { sortedPlugins, hasCriticalIssues, pluginInfo } = dependencyResolver.resolve(enabledPluginsForBot, allPluginsForBot);

        if (hasCriticalIssues) {
            this.appendLog(botId, t('services:error_a1c8a0c5'));

            const criticalIssueTypes = new Set(['missing_dependency', 'version_mismatch', 'circular_dependency']);

            for (const pluginId in pluginInfo) {
                const info = pluginInfo[pluginId];
                if (info.issues.length === 0) continue;

                const criticalIssues = info.issues.filter(issue => criticalIssueTypes.has(issue.type));

                if (criticalIssues.length > 0) {
                    this.appendLog(botId, `* Плагин "${info.name}":`);
                    for (const issue of criticalIssues) {
                        const msg = issue.message || `${issue.messageKey} ${JSON.stringify(issue.context || {})}`;
                        this.appendLog(botId, `  - ${msg}`);
                    }
                }
            }

            this.emitStatusUpdate(botId, 'stopped', t('services:error_a2d9e31e'));
            return { success: false, message: t('services:error_62fc5479') };
        }

        const decryptedConfig = { ...botConfig };

        if (decryptedConfig.proxy) {
            decryptedConfig.proxyHost = decryptedConfig.proxy.host;
            decryptedConfig.proxyPort = decryptedConfig.proxy.port;
            decryptedConfig.proxyUsername = decryptedConfig.proxy.username;
            decryptedConfig.proxyPassword = decryptedConfig.proxy.password;
            decryptedConfig.proxyType = decryptedConfig.proxy.type || 'socks5';
        }

        if (decryptedConfig.password) decryptedConfig.password = decrypt(decryptedConfig.password);
        if (decryptedConfig.proxyPassword) decryptedConfig.proxyPassword = decrypt(decryptedConfig.proxyPassword);
        if (decryptedConfig.proxyUsername) decryptedConfig.proxyUsername = decryptedConfig.proxyUsername.trim();

        const fullBotConfig = { ...decryptedConfig, plugins: sortedPlugins };

        const child = await this.processManager.spawn(botConfig, fullBotConfig);

        child.api = {
            sendMessage: (type, message, username) => {
                if (!child.killed) {
                    child.send({ type: 'chat', payload: { message, chatType: type, username } });
                }
            },
            sendLog: (message) => {
                this.appendLog(botId, message);
            }
        };

        this.ipcRouter.attachToChild(child, botConfig);

        child.send({ type: 'start', config: fullBotConfig });

        await this.eventGraphManager.loadGraphsForBot(botId);

        this.telemetry.triggerHeartbeat();
        this.emitStatusUpdate(botId, 'starting');

        return child;
        } finally {
            this.startingBots.delete(botId);
        }
    }

    async stopBot(botId) {
        const child = this.processManager.getProcess(botId);
        if (child) {
            this.stoppingBots.add(botId);
            this.eventGraphManager.unloadGraphsForBot(botId);

            const { getTraceCollector } = require('./TraceCollectorService');
            const traceCollector = getTraceCollector();
            traceCollector.clearForBot(botId);

            const stopped = this._whenChildStops(child, botId);
            try {
                child.send({ type: 'stop' });
            } catch (error) {
                this.logger.error({ botId, error }, t('services:error_50c0e0a4'));
            }

            this.cache.clearBotCache(botId);
            return { success: true, stopped };
        }
        return { success: false, message: t('services:msg_aada76ac') };
    }

    _whenChildStops(child, botId) {
        if (!child || child.exitCode != null || child.signalCode != null) {
            this.stoppingBots.delete(botId);
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                clearTimeout(killTimer);
                this.stoppingBots.delete(botId);
                resolve();
            };
            const killTimer = setTimeout(() => {
                if (settled || child.killed || child.exitCode != null || child.signalCode != null) {
                    finish();
                    return;
                }
                this.logger.warn({ botId }, t('services:msg_4a52b524'));
                try {
                    child.kill('SIGKILL');
                } catch (error) {
                    this.logger.error({ botId, error }, t('services:error_fde83268'));
                }
                if (typeof child.once !== 'function') finish();
            }, 5000);
            if (typeof killTimer.unref === 'function') killTimer.unref();
            if (typeof child.once === 'function') child.once('exit', finish);
        });
    }

    getChildProcess(botId) {
        return this.processManager.getProcess(botId);
    }

    async restartBot(botId, providedBotConfig = null) {
        const botConfig = providedBotConfig || this.processManager.getProcess(botId)?.botConfig;
        if (!botConfig) {
            throw new Error('Bot configuration not found');
        }

        const stopResult = await this.stopBot(botId);
        if (stopResult.stopped) await stopResult.stopped;

        return this.startBot(botConfig);
    }

    async loadConfigForBot(botId) {
        this.logger.info({ botId }, t('services:msg_4ffb5c49'));

        try {
            const [commands, permissions] = await Promise.all([
                this.commandRepository.findByBotId(botId),
                this.permissionRepository.findByBotId(botId),
            ]);

            const config = {
                commands: new Map(commands.map(cmd => [cmd.name, cmd])),
                permissionsById: new Map(permissions.map(p => [p.id, p])),
                commandAliases: new Map()
            };

            for (const cmd of commands) {
                const aliases = JSON.parse(cmd.aliases || '[]');
                for (const alias of aliases) {
                    config.commandAliases.set(alias, cmd.name);
                }
            }

            this.cache.setBotConfig(botId, config);
            this.logger.info({ botId }, t('services:success_370ec895'));
            return config;
        } catch (error) {
            this.logger.error({ botId, error }, t('services:error_51525a07'));
            const handled = errorHandler.handle(error, { botId });
            throw new Error(`Failed to load/cache bot configuration for botId ${botId}: ${error.message}`);
        }
    }

    invalidateConfigCache(botId) {
        if (this.cache.getBotConfig(botId)) {
            this.cache.deleteBotConfig(botId);
            this.logger.debug({ botId }, t('services:msg_07d294cc'));
        }
    }

    reloadBotConfigInRealTime(botId) {
        const { getIOSafe } = require('../../real-time/socketHandler');
        this.invalidateConfigCache(botId);

        if (this.processManager.sendMessage(botId, { type: 'config:reload' })) {
            this.logger.info({ botId }, t('services:msg_87a00eb5'));
            getIOSafe().emit('bot:config_reloaded', { botId });
        }
    }

    async _syncSystemPermissions(botId) {
        const systemPermissions = [
            { name: "admin.*", description: t('tests:perm_87b060b3'), owner: "system" },
            { name: "admin.cooldown.bypass", description: t('services:msg_8e581741'), owner: "system" },
            { name: "user.*", description: t('services:perm_9b091116'), owner: "system" },
            { name: "user.say", description: t('services:perm_a22ada6c'), owner: "system" },
            { name: "user.cooldown.bypass", description: t('services:msg_c72d67c6'), owner: "system" },
        ];

        this.logger.debug({ botId }, t('services:msg_e41f7e4b'));

        try {
            for (const perm of systemPermissions) {
                const existing = await this.permissionRepository.findByName(botId, perm.name);
                if (existing) {
                    if (existing.description !== perm.description) {
                        await this.permissionRepository.update(existing.id, {
                            description: perm.description
                        });
                    }
                } else {
                    await this.permissionRepository.create({
                        botId,
                        name: perm.name,
                        description: perm.description,
                        owner: perm.owner,
                    });
                }
            }
            this.logger.debug({ botId }, t('services:msg_e4979cb7'));
        } catch (error) {
            this.logger.error({ botId, error }, t('services:error_35cbdf9b'));
        }
    }

    appendLog(botId, logContent) {
        const { getIOSafe } = require('../../real-time/socketHandler');
        const logEntry = {
            id: Date.now() + Math.random(),
            content: logContent,
        };

        const currentLogs = this.logCache.get(botId) || [];
        const newLogs = [...currentLogs.slice(-199), logEntry];
        this.logCache.set(botId, newLogs);

        try {
            getIOSafe().emit('bot:log', { botId, log: logEntry });
        } catch (e) {}
    }

    getBotLogs(botId) {
        return this.logCache.get(botId) || [];
    }

    emitStatusUpdate(botId, status, message = null) {
        const { getIOSafe, broadcastToPanelNamespace } = require('../../real-time/socketHandler');
        if (message) this.appendLog(botId, `[SYSTEM] ${message}`);

        try {
            const statusPayload = {
                botId,
                status,
                message,
                timestamp: new Date().toISOString()
            };
            getIOSafe().emit('bot:status', { botId, status, message });
            broadcastToPanelNamespace(getIOSafe(), 'bots:status', statusPayload);
            broadcastToPanelNamespace(getIOSafe(), `bots:${botId}:status`, statusPayload, 'bots:status');
        } catch (e) {}
    }

    getFullState() {
        const processes = this.processManager.getAllProcesses();
        const statuses = {};
        for (const [id, child] of processes.entries()) {
            statuses[id] = child.killed ? 'stopped' : 'running';
        }

        const logs = {};
        for (const [botId, logArray] of this.logCache.entries()) {
            logs[botId] = logArray;
        }

        return { statuses, logs };
    }

    isBotRunning(botId) {
        return this.processManager.isRunning(botId);
    }

    sendMessageToBot(botId, message, chatType = 'command', username = null) {
        const child = this.processManager.getProcess(botId);
        if (child && child.api) {
            child.api.sendMessage(chatType, message, username);
            return { success: true };
        }
        return { success: false, message: t('services:msg_f833d35c') };
    }

    lookAt(botId, position) {
        if (this.processManager.sendMessage(botId, { type: 'action', name: 'lookAt', payload: { position } })) {
            return { success: true };
        }
        this.logger.error({ botId }, t('services:error_87b4971b'));
        return { success: false };
    }

    async reloadPlugins(botId, pluginName = null) {
        const payload = { type: 'plugins:reload' };
        if (pluginName) payload.pluginName = pluginName;
        if (this.processManager.sendMessage(botId, payload)) {
            this.logger.info({ botId, pluginName }, t('services:msg_d3c8d994'));
            const { getIOSafe } = require('../../real-time/socketHandler');
            getIOSafe().emit('bot:plugins_reloaded', { botId });
            return { success: true, message: t('services:msg_134cd667') };
        }
        return { success: false, message: t('services:msg_d1cea085') };
    }

    sendServerCommandToBot(botId, command) {
        this.processManager.sendMessage(botId, { type: 'server_command', payload: { command } });
    }

    async getLiveState(botId) {
        if (!this.processManager.isRunning(botId)) {
            return { online: false, players: [] };
        }

        return new Promise((resolve) => {
            const { v4: uuidv4 } = require('uuid');
            const requestId = uuidv4();
            const timeout = setTimeout(() => resolve({ online: false, players: [], timedOut: true }), 5000);
            this.processManager.addLiveStateRequest(requestId, {
                resolve: (state) => {
                    clearTimeout(timeout);
                    resolve(state);
                },
                timeout,
            });
            const sent = this.processManager.sendMessage(botId, { type: 'system:get_live_state', requestId });
            if (!sent) {
                clearTimeout(timeout);
                resolve({ online: false, players: [] });
            }
        });
    }

    async getPlayerList(botId) {
        if (!this.processManager.isRunning(botId)) {
            return [];
        }

        const cachedPlayers = this.cache.getPlayerList(botId);
        if (cachedPlayers) {
            return cachedPlayers;
        }

        return new Promise((resolve) => {
            const { v4: uuidv4 } = require('uuid');
            const requestId = uuidv4();

            const timeout = setTimeout(() => {
                resolve([]);
            }, 5000);

            this.processManager.addPlayerListRequest(requestId, {
                resolve: (playerList) => {
                    clearTimeout(timeout);
                    this.cache.setPlayerList(botId, playerList);
                    resolve(playerList);
                },
                timeout
            });

            this.processManager.sendMessage(botId, { type: 'system:get_player_list', requestId });
        });
    }

    async getNearbyEntities(botId, position = null, radius = 32) {
        if (!this.processManager.isRunning(botId)) {
            return [];
        }

        return new Promise((resolve) => {
            const { v4: uuidv4 } = require('uuid');
const { t } = require('../../i18n');
            const requestId = uuidv4();

            const timeout = setTimeout(() => {
                resolve([]);
            }, 5000);

            this.processManager.addNearbyEntitiesRequest(requestId, {
                resolve: (entities) => {
                    clearTimeout(timeout);
                    resolve(entities);
                },
                timeout
            });

            this.processManager.sendMessage(botId, {
                type: 'system:get_nearby_entities',
                requestId,
                payload: { position, radius }
            });
        });
    }

    invalidateUserCache(botId, username) {
        UserService.clearCache(username, botId);
        this.processManager.sendMessage(botId, { type: 'invalidate_user_cache', username });
        return { success: true };
    }

    invalidateAllUserCache(botId) {
        for (const [cacheKey] of UserService.cache.entries()) {
            if (cacheKey.startsWith(`${botId}:`)) {
                UserService.cache.delete(cacheKey);
            }
        }

        this.logger.info({ botId }, t('services:msg_3771ec27'));
        this.processManager.sendMessage(botId, { type: 'invalidate_all_user_cache' });

        return { success: true };
    }
}

module.exports = BotLifecycleService;