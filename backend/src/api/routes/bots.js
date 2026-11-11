const express = require('express');
const prisma = require('../../lib/prisma');
const path = require('path');
const fs = require('fs/promises');
const fse = require('fs-extra');
const { botManager, pluginManager } = require('../../core/services');
const UserService = require('../../core/UserService');
const commandManager = require('../../core/system/CommandManager');
const NodeRegistry = require('../../core/NodeRegistry');
const { authenticate, authenticateUniversal, authorize } = require('../middleware/auth');
const { encrypt } = require('../../core/utils/crypto');
const { randomUUID } = require('crypto');
const eventGraphsRouter = require('./eventGraphs');
const pluginIdeRouter = require('./pluginIde');
const apiKeysRouter = require('./apiKeys');
const { deepMergeSettings } = require('../../core/utils/settingsMerger');
const { checkBotAccess } = require('../middleware/botAccess');
const { setupDefaultPermissionsForBot } = require('../../core/setupDefaultBotPermissions');
const { filterSecretSettings, prepareSettingsForSave, isGroupedSettings } = require('../../core/utils/secretsFilter');
const PluginHooks = require('../../core/PluginHooks');
const rateLimit = require('express-rate-limit');

const multer = require('multer');
const archiver = require('archiver');
const { parseImportZip, importBotFromZip } = require('../../core/utils/botImport');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024, files: 1 }
});

function sanitizeProxyPort(value) {
    if (value === undefined || value === null || value === '') return null;
    const n = parseInt(value, 10);
    if (!Number.isInteger(n) || n < 1 || n > 65535) return null;
    return n;
}

const {
    parseGithubRepoUrl,
    normalizeGithubRepoUrl,
    fetchGithubJson,
    fetchGithubReadme,
    renderGithubMarkdown,
    fetchLatestGithubVersionTag,
} = require('../../core/utils/github');
const { isFloatingLatest } = require('../../core/utils/pluginCatalog');

const router = express.Router();

const githubPreviewLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many GitHub preview requests. Try again later.' },
});

const githubInstallLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many GitHub install requests. Try again later.' },
});

const conditionalRestartAuth = (req, res, next) => {
    return authenticateUniversal(req, res, (err) => {
        if (err) return next(err);
        return authorize('bot:start_stop')(req, res, next);
    });
};

const conditionalChatAuth = (req, res, next) => {
    return authenticateUniversal(req, res, (err) => {
        if (err) return next(err);
        return authorize('bot:interact')(req, res, next);
    });
};

const conditionalStartStopAuth = (req, res, next) => {
    return authenticateUniversal(req, res, (err) => {
        if (err) return next(err);
        return authorize('bot:start_stop')(req, res, next);
    });
};

const conditionalListAuth = (req, res, next) => {
    return authenticateUniversal(req, res, (err) => {
        if (err) return next(err);
        return authorize('bot:list')(req, res, next);
    });
};

router.post('/:id/restart', conditionalRestartAuth, authenticateUniversal, checkBotAccess, async (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        const botConfig = await prisma.bot.findUnique({ where: { id: botId }, include: { server: true, proxy: true } });
        if (!botConfig) {
            return res.status(404).json({ success: false, message: t('bots:msg_13215f66') });
        }
        res.status(202).json({ success: true, message: t('bots:msg_f914bb97') });
        botManager.restartBot(botId, botConfig).catch((error) => {
            console.error(t('bots:error_d001b3ae', { botId: botId }), error);
        });
    } catch (error) {
        console.error(t('bots:error_0a8ba571', { req: req.params.id }), error);
        res.status(500).json({ success: false, message: t('bots:error_80a0a92f') + error.message });
    }
});

router.post('/:id/chat', conditionalChatAuth, authenticateUniversal, checkBotAccess, (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: t('bots:msg_0dec48ad') });
        const result = botManager.sendMessageToBot(botId, message);
        if (result.success) res.json({ success: true });
        else res.status(404).json(result);
    } catch (error) { res.status(500).json({ error: t('bots:error_39cdf0c4') + error.message }); }
});

router.post('/:id/start', conditionalStartStopAuth, authenticateUniversal, checkBotAccess, async (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        const botConfig = await prisma.bot.findUnique({ where: { id: botId }, include: { server: true, proxy: true } });
        if (!botConfig) {
            return res.status(404).json({ success: false, message: t('bots:msg_13215f66') });
        }
        botManager.startBot(botConfig);
        res.status(202).json({ success: true, message: t('bots:msg_dfb558d7') });
    } catch (error) {
        console.error(t('bots:error_ad3e49fc', { req: req.params.id }), error);
        res.status(500).json({ success: false, message: t('bots:error_68558261') + error.message });
    }
});

router.post('/:id/stop', conditionalStartStopAuth, authenticateUniversal, checkBotAccess, (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        botManager.stopBot(botId);
        res.status(202).json({ success: true, message: t('bots:msg_98308238') });
    } catch (error) {
        console.error(t('bots:error_7953def5', { req: req.params.id }), error);
        res.status(500).json({ success: false, message: t('bots:error_07923cdc') + error.message });
    }
});

router.get('/state', conditionalListAuth, async (req, res) => {
    try {
        const state = botManager.getFullState();
        if (req.user && typeof req.user.userId === 'number') {
            const panelUser = await prisma.panelUser.findUnique({
                where: { id: req.user.userId },
                include: { botAccess: { select: { botId: true } } }
            });
            if (panelUser && panelUser.allBots === false) {
                const allowed = new Set(panelUser.botAccess.map(a => a.botId));
                const filterByBotId = (obj) => {
                    if (!obj || typeof obj !== 'object') return obj;
                    const out = {};
                    for (const key of Object.keys(obj)) {
                        if (allowed.has(parseInt(key, 10))) out[key] = obj[key];
                    }
                    return out;
                };
                const filtered = {};
                for (const topKey of Object.keys(state)) {
                    filtered[topKey] = filterByBotId(state[topKey]);
                }
                return res.json(filtered);
            }
        }
        res.json(state);
    } catch (error) { res.status(500).json({ error: t('bots:error_84b76440') }); }
});

router.get('/', conditionalListAuth, async (req, res) => {
    console.log(t('bots:log_1e84d6a7'), req.user?.username, 'permissions:', req.user?.permissions?.slice(0, 3));
    try {
        const botsWithoutSortOrder = await prisma.bot.findMany({
            where: { sortOrder: null },
            select: { id: true }
        });
        
        if (botsWithoutSortOrder.length > 0) {
            console.log(t('bots:log_58668bba', { botsWithoutSortOrder: botsWithoutSortOrder.length }));
            
            const maxSortOrder = await prisma.bot.aggregate({
                _max: { sortOrder: true }
            });
            
            let nextSortOrder = (maxSortOrder._max.sortOrder || 0) + 1;
            
            for (const bot of botsWithoutSortOrder) {
                await prisma.bot.update({
                    where: { id: bot.id },
                    data: { sortOrder: nextSortOrder }
                });
                console.log(t('bots:success_71c8e6f1', { nextSortOrder: nextSortOrder, bot: bot.id }));
                nextSortOrder++;
            }
        }

        let whereFilter = {};
        if (req.user && typeof req.user.userId === 'number') {
            const panelUser = await prisma.panelUser.findUnique({
                where: { id: req.user.userId },
                include: { botAccess: { select: { botId: true } } }
            });
            if (panelUser && panelUser.allBots === false) {
                const allowedIds = panelUser.botAccess.map(a => a.botId);
                whereFilter = { id: { in: allowedIds.length ? allowedIds : [-1] } };
            }
        }
        
        const bots = await prisma.bot.findMany({
            where: whereFilter,
            include: { server: true },
            orderBy: { sortOrder: 'asc' }
        });
        console.log(t('bots:log_e67eefad', { bots: bots.length }));
        res.json(bots);
    } catch (error) {
        console.error(t('bots:error_45dffd00'), error);
        res.status(500).json({ error: t('bots:error_a8c837d4') });
    }
});

router.get('/:id', conditionalListAuth, checkBotAccess, async (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);

        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: { server: true, proxy: true }
        });

        if (!bot) {
            return res.status(404).json({ error: t('bots:msg_13215f66') });
        }

        if (bot.proxy && bot.proxy.password) {
            bot.proxy = { ...bot.proxy, password: undefined, hasPassword: true };
        }

        res.json(bot);
    } catch (error) {
        console.error(t('bots:error_e57e92df'), error);
        res.status(500).json({ error: t('bots:error_cd0c13c8') });
    }
});

router.put('/bulk-proxy-update', authenticateUniversal, authorize('bot:update'), async (req, res) => {
    try {
        const { botIds, proxySettings } = req.body;
        
        if (!Array.isArray(botIds) || botIds.length === 0) {
            return res.status(400).json({ error: 'Bot IDs array is required and cannot be empty' });
        }
        
        if (!proxySettings || !proxySettings.proxyHost || !proxySettings.proxyPort) {
            return res.status(400).json({ error: 'Proxy host and port are required' });
        }
        
        if (proxySettings.proxyPort < 1 || proxySettings.proxyPort > 65535) {
            return res.status(400).json({ error: 'Proxy port must be between 1 and 65535' });
        }
        
        const accessibleBots = [];
        const inaccessibleBots = [];
        
        for (const botId of botIds) {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    inaccessibleBots.push(botId);
                    continue;
                }

                const botIdInt = parseInt(botId, 10);
                if (isNaN(botIdInt)) {
                    inaccessibleBots.push(botId);
                    continue;
                }

                const user = await prisma.panelUser.findUnique({
                    where: { id: userId },
                    include: { botAccess: { select: { botId: true } } }
                });
                
                if (!user) {
                    inaccessibleBots.push(botId);
                    continue;
                }

                if (user.allBots !== false || user.botAccess.some((a) => a.botId === botIdInt)) {
                    accessibleBots.push(botIdInt);
                } else {
                    inaccessibleBots.push(botId);
                }
            } catch (error) {
                console.error(`Error checking access for bot ${botId}:`, error);
                inaccessibleBots.push(botId);
            }
        }
        
        if (accessibleBots.length === 0) {
            return res.status(403).json({ error: 'No accessible bots in the provided list' });
        }
        
        const encryptedSettings = {
            proxyHost: proxySettings.proxyHost.trim(),
            proxyPort: parseInt(proxySettings.proxyPort),
            proxyUsername: proxySettings.proxyUsername ? proxySettings.proxyUsername.trim() : null,
            proxyPassword: proxySettings.proxyPassword ? encrypt(proxySettings.proxyPassword) : null
        };
        
        const updatedBots = await prisma.$transaction(
            accessibleBots.map(botId => 
                prisma.bot.update({
                    where: { id: parseInt(botId) },
                    data: encryptedSettings,
                    include: {
                        server: {
                            select: {
                                id: true,
                                name: true,
                                host: true,
                                port: true,
                                version: true
                            }
                        }
                    }
                })
            )
        );
        
        if (req.io) {
            req.io.emit('bots-updated', updatedBots);
        }
        
        res.json({
            success: true,
            message: `Proxy settings updated for ${updatedBots.length} bot(s)`,
            updatedBots: updatedBots.map(bot => ({
                id: bot.id,
                username: bot.username,
                proxyHost: bot.proxyHost,
                proxyPort: bot.proxyPort,
                server: bot.server
            })),
            inaccessibleBots: inaccessibleBots,
            errors: inaccessibleBots.length > 0 ? [`Access denied to ${inaccessibleBots.length} bot(s)`] : []
        });
        
    } catch (error) {
        console.error('Bulk proxy update error:', error);
        res.status(500).json({ 
            error: 'Failed to update proxy settings',
            details: error.message 
        });
    }
});

router.get('/:id/logs', conditionalListAuth, authenticateUniversal, checkBotAccess, (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        const { limit = 50, offset = 0 } = req.query;
        
        const logs = botManager.getBotLogs(botId);
        
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedLogs = logs.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    total: logs.length,
                    limit: parseInt(limit),
                    offset: startIndex,
                    hasMore: endIndex < logs.length
                }
            }
        });
    } catch (error) { 
        console.error(t('bots:error_ba59520e', { req: req.params.id }), error);
        res.status(500).json({ error: t('bots:error_72c336f2') }); 
    }
});

router.post('/:botId/plugins/install/local', authenticateUniversal, checkBotAccess, authorize('plugin:install'), async (req, res) => {
    const { botId } = req.params;
    const { path } = req.body;
    try {
        const newPlugin = await pluginManager.installFromLocalPath(parseInt(botId), path);
        res.status(201).json(newPlugin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:botId/plugins/install/zip', authenticateUniversal, checkBotAccess, authorize('plugin:install'), (req, res) => {
    upload.single('file')(req, res, async (uploadError) => {
        if (uploadError) {
            const message = uploadError.code === 'LIMIT_FILE_SIZE'
                ? t('bots:msg_e37c7eae')
                : (uploadError.message || t('bots:error_14311c27'));
            return res.status(400).json({ error: message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: t('bots:msg_a5261a65') });
            }
            const newPlugin = await pluginManager.installFromZipBuffer(parseInt(req.params.botId, 10), req.file.buffer);
            res.status(201).json(newPlugin);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || t('bots:error_4615e610') });
        }
    });
});

router.get('/:botId/plugins/:pluginId/download', authenticateUniversal, checkBotAccess, authorize('plugin:list'), async (req, res) => {
    try {
        const withSettings = req.query.settings === '1' || req.query.settings === 'true';
        const located = await pluginManager.getInstalledPluginDirectory(req.params.botId, req.params.pluginId);
        const filename = withSettings ? located.filename.replace(/\.zip$/, '-settings.zip') : located.filename;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const settingsJson = withSettings ? (located.plugin.settings || '{}') : null;
        await pluginManager.writePluginZip(located.directory, res, settingsJson);
    } catch (error) {
        if (res.headersSent) return;
        res.status(error.statusCode || 500).json({ error: error.message || t('bots:error_3e2849fb') });
    }
});

router.use(authenticate);
router.use('/:botId/event-graphs', checkBotAccess, eventGraphsRouter);
router.use('/:botId/plugins/ide', checkBotAccess, authorize('plugin:develop'), pluginIdeRouter);
router.use('/:botId/api-keys', apiKeysRouter);

router.post('/', authorize('bot:create'), async (req, res) => {
    try {
        const { username, password, prefix, serverId, note, proxyId, proxyHost, proxyPort, proxyUsername, proxyPassword } = req.body;
        if (!username || !serverId) return res.status(400).json({ error: t('bots:validation_8b3a46bc') });

        const maxSortOrder = await prisma.bot.aggregate({
            _max: { sortOrder: true }
        });
        const nextSortOrder = (maxSortOrder._max.sortOrder || 0) + 1;

        const data = {
            username,
            prefix,
            note,
            serverId: parseInt(serverId, 10),
            password: password ? encrypt(password) : null,
            proxyId: proxyId ? parseInt(proxyId, 10) : null,
            proxyHost: proxyHost || null,
            proxyPort: sanitizeProxyPort(proxyPort),
            proxyUsername: proxyUsername || null,
            proxyPassword: proxyPassword ? encrypt(proxyPassword) : null,
            sortOrder: nextSortOrder
        };

        const newBot = await prisma.bot.create({
            data: data,
            include: { server: true, proxy: true }
        });
        await setupDefaultPermissionsForBot(newBot.id);
        res.status(201).json(newBot);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('bots:msg_209b76d4') });
        console.error("[API Error] /bots POST:", error);
        res.status(500).json({ error: t('bots:error_3e9497d5') });
    }
});

router.put('/:id', authenticateUniversal, checkBotAccess, authorize('bot:update'), async (req, res) => {
    try {
        const {
            username, password, prefix, serverId, note, owners,
            proxyId, proxyHost, proxyPort, proxyUsername, proxyPassword
        } = req.body;

        let dataToUpdate = {
            username,
            prefix,
            note,
            owners,
            proxyId: proxyId ? parseInt(proxyId, 10) : null,
            proxyHost,
            proxyPort: sanitizeProxyPort(proxyPort),
            proxyUsername,
        };

        if (password) {
            dataToUpdate.password = encrypt(password);
        }
        if (proxyPassword) {
            dataToUpdate.proxyPassword = encrypt(proxyPassword);
        }

        if (serverId !== undefined && serverId !== '') {
            dataToUpdate.serverId = parseInt(serverId, 10);
        }
        
        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });
        
        if (dataToUpdate.serverId) {
            const serverIdValue = dataToUpdate.serverId;
            delete dataToUpdate.serverId;
            dataToUpdate.server = { connect: { id: serverIdValue } };
        }

        if (dataToUpdate.proxyId !== undefined) {
            const proxyIdValue = dataToUpdate.proxyId;
            delete dataToUpdate.proxyId;
            if (proxyIdValue) {
                // Используем proxy from list - очищаем кастомные fields
                dataToUpdate.proxy = { connect: { id: proxyIdValue } };
                dataToUpdate.proxyHost = null;
                dataToUpdate.proxyPort = null;
                dataToUpdate.proxyUsername = null;
                dataToUpdate.proxyPassword = null;
            } else if (!dataToUpdate.proxyHost) {
                // Отключаем proxy only if no кастомного proxyHost
                dataToUpdate.proxy = { disconnect: true };
                dataToUpdate.proxyHost = null;
                dataToUpdate.proxyPort = null;
                dataToUpdate.proxyUsername = null;
                dataToUpdate.proxyPassword = null;
            } else {
                // Кастомный proxy: отключаем связь with proxy, но сохраняем кастомные fields
                dataToUpdate.proxy = { disconnect: true };
            }
        }

        const botId = parseInt(req.params.id, 10);
        if (isNaN(botId)) {
            return res.status(400).json({ message: t('bots:error_a9995818') });
        }

        if (dataToUpdate.username) {
            const existingBot = await prisma.bot.findFirst({
                where: {
                    username: dataToUpdate.username,
                    id: { not: botId }
                }
            });
            
            if (existingBot) {
                return res.status(400).json({ 
                    message: `Бот с именем "${dataToUpdate.username}" уже существует.` 
                });
            }
        }

        const updatedBot = await prisma.bot.update({
            where: { id: botId },
            data: dataToUpdate,
            include: { server: true, proxy: true }
        });

        botManager.reloadBotConfigInRealTime(botId);

        // Отложенная очистка кеша пользователей, чтобы BotProcess успел обновить config
        setTimeout(() => {
            botManager.invalidateAllUserCache(botId);
        }, 500);

        res.json(updatedBot);
    } catch (error) {
        console.error("[API Error] /bots PUT:", error);
        res.status(500).json({ error: t('bots:error_9c0f3048') });
    }
});

router.put('/:id/sort-order', authenticateUniversal, checkBotAccess, authorize('bot:update'), async (req, res) => {
    try {
        const { newPosition, oldIndex, newIndex } = req.body;
        const botId = parseInt(req.params.id, 10);
        
        console.log(t('bots:log_4fdafa6d', { botId: botId, oldIndex: oldIndex, newIndex: newIndex, newPosition: newPosition }));
        
        if (isNaN(botId)) {
            console.log(t('bots:error_9769e8f0', { botId: botId }));
            return res.status(400).json({ error: t('bots:error_c013e095') });
        }

        const allBots = await prisma.bot.findMany({
            orderBy: { sortOrder: 'asc' },
            select: { id: true, sortOrder: true }
        });

        console.log(t('bots:log_f348f6c3', { allBots: allBots.length }));
        const currentBotIndex = allBots.findIndex(bot => bot.id === botId);
        if (currentBotIndex === -1) {
            console.log(t('bots:log_85a63781', { botId: botId }));
            return res.status(404).json({ error: t('bots:msg_13215f66') });
        }

        if (newIndex < 0 || newIndex >= allBots.length) {
            console.log(t('bots:error_183f1415', { newIndex: newIndex }));
            return res.status(400).json({ error: t('bots:error_992f1220') });
        }

        if (currentBotIndex === newIndex) {
            console.log(t('bots:log_6aa07de6', { botId: botId }));
            return res.json({ success: true, message: t('bots:msg_088e9857') });
        }
        const reorderedBots = [...allBots];
        const [movedBot] = reorderedBots.splice(currentBotIndex, 1);
        reorderedBots.splice(newIndex, 0, movedBot);

        console.log(t('bots:log_70120a39'));
        for (let i = 0; i < reorderedBots.length; i++) {
            const bot = reorderedBots[i];
            const newSortOrder = i + 1; // 1-based позиции
            
            if (bot.sortOrder !== newSortOrder) {
                await prisma.bot.update({
                    where: { id: bot.id },
                    data: { sortOrder: newSortOrder }
                });
                console.log(t('bots:success_ee7cdeca', { bot: bot.id, bot1: bot.sortOrder, newSortOrder: newSortOrder }));
            }
        }

        console.log(t('bots:success_1ccffff9', { botId: botId }));
        res.json({ success: true, message: t('bots:success_e634b6d4') });
    } catch (error) {
        console.error("[API Error] /bots sort-order PUT:", error);
        res.status(500).json({ error: t('bots:error_3cbf9bb0') });
    }
});

router.delete('/:id', authenticateUniversal, checkBotAccess, authorize('bot:delete'), async (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);
        if (botManager.bots.has(botId)) return res.status(400).json({ error: t('bots:msg_fe28998f') });
        await prisma.bot.delete({ where: { id: botId } });
        res.status(204).send();
    } catch (error) { res.status(500).json({ error: t('bots:error_75b963ac') }); }
});

router.get('/servers', authorize('bot:list'), async (req, res) => {
    try {
        const servers = await prisma.server.findMany();
        res.json(servers);
    } catch (error) {
        console.error(t('bots:error_26daeea1'), error);
        res.status(500).json({ error: t('bots:error_f4f43448') });
    }
});

router.get('/:botId/plugins', authenticateUniversal, checkBotAccess, authorize('plugin:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const plugins = await prisma.installedPlugin.findMany({ where: { botId } });
        res.json(plugins);
    } catch (error) { res.status(500).json({ error: t('bots:error_ea836e5d') }); }
});

async function loadManifestReview(botId, owner, repo, ref) {
    try {
        const payload = await fetchGithubJson(
            `https://api.github.com/repos/${owner}/${repo}/contents/package.json?ref=${encodeURIComponent(ref || 'HEAD')}`
        );
        if (!payload?.content) return null;
        const packageJson = JSON.parse(Buffer.from(payload.content, 'base64').toString('utf8'));
        const existing = await prisma.installedPlugin.findFirst({
            where: { botId, name: packageJson.name },
        });
        let previousManifest = null;
        if (existing?.manifest) {
            try {
                previousManifest = JSON.parse(existing.manifest);
            } catch {
                previousManifest = null;
            }
        }
        return pluginManager.reviewManifest(botId, packageJson, previousManifest);
    } catch (error) {
        console.warn(`[GitHub Preview] package.json review failed for ${owner}/${repo}:`, error.message);
        return null;
    }
}

router.post('/:botId/plugins/install/github/preview', githubPreviewLimiter, authenticateUniversal, checkBotAccess, authorize('plugin:install'), async (req, res) => {
    const { repoUrl } = req.body;

    try {
        const { owner, repo, normalizedUrl } = parseGithubRepoUrl(repoUrl);
        const repoInfo = await fetchGithubJson(`https://api.github.com/repos/${owner}/${repo}`);

        let tags = [];
        let latestRelease = null;
        let readme = null;
        let readmeHtml = null;

        try {
            const tagsData = await fetchGithubJson(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=20`);
            tags = Array.isArray(tagsData) ? tagsData.map(tag => ({
                name: tag.name,
                sha: tag.commit?.sha || null
            })) : [];
        } catch (error) {
            console.warn(`[GitHub Preview] Failed to load tags for ${owner}/${repo}:`, error.message);
        }

        try {
            latestRelease = await fetchGithubJson(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        } catch (error) {
            console.warn(`[GitHub Preview] Failed to load latest release for ${owner}/${repo}:`, error.message);
        }

        try {
            readme = await fetchGithubReadme(owner, repo);
        } catch (error) {
            console.warn(`[GitHub Preview] Failed to load README for ${owner}/${repo}:`, error.message);
        }

        try {
            readmeHtml = await renderGithubMarkdown(readme, owner, repo);
        } catch (error) {
            console.warn(`[GitHub Preview] Failed to render README for ${owner}/${repo}:`, error.message);
        }

        res.json({
            repo: {
                name: repoInfo.name,
                fullName: repoInfo.full_name,
                description: repoInfo.description || '',
                defaultBranch: repoInfo.default_branch,
                stars: repoInfo.stargazers_count || 0,
                htmlUrl: repoInfo.html_url || normalizedUrl,
                visibility: repoInfo.private ? 'private' : 'public'
            },
            latestReleaseTag: latestRelease?.tag_name || null,
            tags,
            readme,
            readmeHtml,
            manifestReview: await loadManifestReview(parseInt(req.params.botId, 10), owner, repo, repoInfo.default_branch),
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ message: 'GitHub request timed out. Please try again.' });
        }
        if (error.status === 404) {
            return res.status(404).json({ message: 'GitHub repository not found or it is private.' });
        }
        if (error.status === 403) {
            return res.status(503).json({ message: 'GitHub API rate limit exceeded. Try again a bit later.' });
        }
        const status = error.status || (/required|invalid|only github|must include|unsupported/i.test(error.message) ? 400 : 500);
        res.status(status).json({ message: error.message });
    }
});

router.post('/:botId/plugins/install/github', githubInstallLimiter, authenticateUniversal, checkBotAccess, authorize('plugin:install'), async (req, res) => {
    const { botId } = req.params;
    const { repoUrl, tag } = req.body;
    let normalizedRepoUrl = repoUrl;
    const normalizedTag = typeof tag === 'string' && tag.trim() ? tag.trim() : null;
    try {
        normalizedRepoUrl = normalizeGithubRepoUrl(repoUrl);
        let installTag = normalizedTag;
        if (isFloatingLatest(installTag)) {
            installTag = await fetchLatestGithubVersionTag(normalizedRepoUrl);
            if (!installTag) {
                return res.status(404).json({ message: t('bots:msg_a0c8aa56', { normalizedRepoUrl: normalizedRepoUrl }) });
            }
        }
        const newPlugin = await pluginManager.installFromGithub(parseInt(botId), normalizedRepoUrl, prisma, false, installTag);
        res.status(201).json(newPlugin);
    } catch (error) {
        let status = /required|invalid|only github|must include|unsupported/i.test(error.message) ? 400 : 500;
        let message = error.message;

        if (/status:\s*404|статус:\s*404/i.test(message)) {
            status = 404;
            message = normalizedTag
                ? `GitHub tag "${normalizedTag}" was not found in ${normalizedRepoUrl}.`
                : `GitHub repository was not found or is private: ${normalizedRepoUrl}.`;
        } else if (/status:\s*403|статус:\s*403/i.test(message)) {
            status = 503;
            message = 'GitHub temporarily refused the request or rate limit was exceeded. Try again later.';
        } else if (/package\.json/i.test(message)) {
            status = 400;
            message = 'The GitHub repository does not contain a valid plugin package.json.';
        } else if (/fetch/i.test(message)) {
            status = 502;
            message = normalizedTag
                ? `Failed to connect to GitHub while downloading tag "${normalizedTag}".`
                : 'Failed to connect to GitHub while downloading the repository.';
        }

        res.status(status).json({ message });
    }
});

router.delete('/:botId/plugins/:pluginId', authenticateUniversal, checkBotAccess, authorize('plugin:delete'), async (req, res) => {
    const { pluginId } = req.params;
    try {
        await pluginManager.deletePlugin(parseInt(pluginId));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:botId/plugins/:pluginId/settings', authenticateUniversal, checkBotAccess, authorize('plugin:settings:view'), async (req, res) => {
	try {
		const pluginId = parseInt(req.params.pluginId);
		const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
		if (!plugin) return res.status(404).json({ error: t('bots:success_832e4e1c') });

		const savedSettings = plugin.settings ? JSON.parse(plugin.settings) : {};
		const defaultSettings = {};
		const manifest = plugin.manifest ? JSON.parse(plugin.manifest) : {};
		const manifestSettings = manifest.settings || {};

		// Определяем type настроек (обычные or группированные)
		const isGrouped = isGroupedSettings(manifestSettings);

		const processSetting = async (settingKey, config) => {
			if (!config || !config.type) return;

			if (config.type === 'json_file' && config.defaultPath) {
				const configFilePath = path.join(plugin.path, config.defaultPath);
				try {
					const fileContent = await fs.readFile(configFilePath, 'utf-8');
					defaultSettings[settingKey] = JSON.parse(fileContent);
				} catch (e) {
					console.error(t('bots:error_a9d2b700', { config: config.defaultPath, plugin: plugin.name, e: e.message }));
					defaultSettings[settingKey] = {};
				}
			} else if (config.default !== undefined) {
				try {
					defaultSettings[settingKey] = JSON.parse(config.default);
				} catch {
					defaultSettings[settingKey] = config.default;
				}
			}
		};

		if (isGrouped) {
			for (const categoryKey in manifestSettings) {
				const categoryConfig = manifestSettings[categoryKey];
				for (const settingKey in categoryConfig) {
					if (settingKey === 'label') continue;
					await processSetting(settingKey, categoryConfig[settingKey]);
				}
			}
		} else {
			for (const settingKey in manifestSettings) {
				await processSetting(settingKey, manifestSettings[settingKey]);
			}
		}

		const finalSettings = deepMergeSettings(defaultSettings, savedSettings);
		
		// Фильтруем секретные values before отправкой on фронтенд
		const filteredSettings = filterSecretSettings(finalSettings, manifestSettings, isGrouped);
		
		res.json(filteredSettings);
	} catch (error) {
		console.error("[API Error] /settings GET:", error);
		res.status(500).json({ error: t('bots:error_22604e2f') });
	}
});

router.get('/:botId/plugins/:pluginId/data', authenticateUniversal, checkBotAccess, authorize('plugin:settings:view'), async (req, res) => {
    try {
        const pluginId = parseInt(req.params.pluginId);
        const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) return res.status(404).json({ error: t('bots:success_832e4e1c') });

        const rows = await prisma.pluginDataStore.findMany({
            where: { botId: plugin.botId, pluginName: plugin.name },
            orderBy: { updatedAt: 'desc' }
        });

        const result = rows.map(r => {
            let value;
            try { value = JSON.parse(r.value); } catch { value = r.value; }
            return { key: r.key, value, createdAt: r.createdAt, updatedAt: r.updatedAt };
        });
        res.json(result);
    } catch (error) { res.status(500).json({ error: t('bots:error_57121bb5') }); }
});

router.get('/:botId/plugins/:pluginId/data/:key', authenticateUniversal, checkBotAccess, authorize('plugin:settings:view'), async (req, res) => {
    try {
        const pluginId = parseInt(req.params.pluginId);
        const { key } = req.params;
        const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) return res.status(404).json({ error: t('bots:success_832e4e1c') });

        const row = await prisma.pluginDataStore.findUnique({
            where: {
                pluginName_botId_key: {
                    pluginName: plugin.name,
                    botId: plugin.botId,
                    key
                }
            }
        });
        if (!row) return res.status(404).json({ error: t('api-keys:msg_c82b4016') });
        let value; try { value = JSON.parse(row.value); } catch { value = row.value; }
        res.json({ key: row.key, value, createdAt: row.createdAt, updatedAt: row.updatedAt });
    } catch (error) { res.status(500).json({ error: t('bots:error_5e6b5841') }); }
});

router.put('/:botId/plugins/:pluginId/data/:key', authenticateUniversal, checkBotAccess, authorize('plugin:settings:edit'), async (req, res) => {
    try {
        const pluginId = parseInt(req.params.pluginId);
        const { key } = req.params;
        const { value } = req.body;
        const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) return res.status(404).json({ error: t('bots:success_832e4e1c') });

        const jsonValue = JSON.stringify(value ?? null);
        const upserted = await prisma.pluginDataStore.upsert({
            where: {
                pluginName_botId_key: {
                    pluginName: plugin.name,
                    botId: plugin.botId,
                    key
                }
            },
            update: { value: jsonValue },
            create: { pluginName: plugin.name, botId: plugin.botId, key, value: jsonValue }
        });
        let parsed; try { parsed = JSON.parse(upserted.value); } catch { parsed = upserted.value; }
        res.json({ key: upserted.key, value: parsed, createdAt: upserted.createdAt, updatedAt: upserted.updatedAt });
    } catch (error) { res.status(500).json({ error: t('bots:error_da67f37b') }); }
});

router.delete('/:botId/plugins/:pluginId/data/:key', authenticateUniversal, checkBotAccess, authorize('plugin:settings:edit'), async (req, res) => {
    try {
        const pluginId = parseInt(req.params.pluginId);
        const { key } = req.params;
        const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) return res.status(404).json({ error: t('bots:success_832e4e1c') });

        await prisma.pluginDataStore.delete({
            where: {
                pluginName_botId_key: {
                    pluginName: plugin.name,
                    botId: plugin.botId,
                    key
                }
            }
        });
        res.status(204).send();
    } catch (error) { res.status(500).json({ error: t('bots:error_b3204056') }); }
});

router.put('/:botId/plugins/:pluginId', authenticateUniversal, checkBotAccess, authorize('plugin:settings:edit'), async (req, res) => {
    try {
        const pluginId = parseInt(req.params.pluginId);
        const { isEnabled, settings } = req.body;
        const dataToUpdate = {};

        // Получаем current plugin for verification изменения статуса
        const plugin = await prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) return res.status(404).json({ error: t('api:msg_07a06551') });

        const wasEnabled = plugin.isEnabled;

        if (typeof isEnabled === 'boolean') dataToUpdate.isEnabled = isEnabled;

        if (settings) {
            const manifest = plugin.manifest ? JSON.parse(plugin.manifest) : {};
            const existingSettings = plugin.settings ? JSON.parse(plugin.settings) : {};
            const manifestSettings = manifest.settings || {};

            // Определяем type настроек (обычные or группированные)
            const isGrouped = isGroupedSettings(manifestSettings);

            // Подготавливаем settings for сохранения (сохраняем существующие values for замаскированных секретов)
            const settingsToSave = prepareSettingsForSave(settings, existingSettings, manifestSettings, isGrouped);

            // Validation структуры settingsToSave
            if (!settingsToSave || typeof settingsToSave !== 'object' || Array.isArray(settingsToSave)) {
                console.error(t('bots:error_706de579'), settingsToSave);
                return res.status(400).json({ error: t('bots:error_4b67ac1d') });
            }

            dataToUpdate.settings = JSON.stringify(settingsToSave);
        }

        if (Object.keys(dataToUpdate).length === 0) return res.status(400).json({ error: t('bots:success_86a8d712') });
        const updated = await prisma.installedPlugin.update({ where: { id: pluginId }, data: dataToUpdate });

        // Вызываем хуки onEnable/onDisable if status изменился
        if (typeof isEnabled === 'boolean' && wasEnabled !== isEnabled) {
            const pluginHooks = new PluginHooks({ prisma });
            if (isEnabled) {
                // Plugin was включён
                await pluginHooks.callOnEnable(pluginId);
            } else {
                // Plugin was выключен
                await pluginHooks.callOnDisable(pluginId);
            }
        }

        res.json(updated);
    } catch (error) {
        console.error("[API Error] /plugins/:pluginId PUT:", error);
        res.status(500).json({ error: t('bots:error_f4780de1') });
    }
});

router.get('/:botId/management-data', authenticateUniversal, checkBotAccess, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        if (isNaN(botId)) return res.status(400).json({ error: t('bots:error_c013e095') });

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 100;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'username';
        const sortDir = req.query.sortDir === 'desc' ? 'desc' : 'asc';

        const userSkip = (page - 1) * pageSize;

        const whereClause = {
            botId,
        };

        if (searchQuery) {
            whereClause.username = {
                contains: searchQuery,
            };
        }

        // Определяем сортировку (for groups сортируем after getting data)
        let orderBy = { username: sortDir };
        if (sortBy === 'isBlacklisted') {
            orderBy = { isBlacklisted: sortDir };
        }
        const sortByGroups = sortBy === 'groups';

        const [groups, allPermissions] = await Promise.all([
            prisma.group.findMany({ where: { botId }, include: { permissions: { include: { permission: true } } }, orderBy: { name: 'asc' } }),
            prisma.permission.findMany({ where: { botId }, orderBy: { name: 'asc' } })
        ]);

        let users;
        let usersCount;

        if (sortByGroups) {
            // For сортировки by группам получаем всех пользователей, сортируем, потом пагинируем
            const allUsers = await prisma.user.findMany({
                where: whereClause,
                include: { groups: { include: { group: true } } },
            });

            allUsers.sort((a, b) => {
                const diff = a.groups.length - b.groups.length;
                return sortDir === 'asc' ? diff : -diff;
            });

            usersCount = allUsers.length;
            users = allUsers.slice(userSkip, userSkip + pageSize);
        } else {
            [users, usersCount] = await Promise.all([
                prisma.user.findMany({
                    where: whereClause,
                    include: { groups: { include: { group: true } } },
                    orderBy,
                    take: pageSize,
                    skip: userSkip,
                }),
                prisma.user.count({ where: whereClause })
            ]);
        }

        const templatesMap = new Map(commandManager.getCommandTemplates().map(t => [t.name, t]));
        let dbCommandsFromDb = await prisma.command.findMany({ 
            where: { botId },
            include: {
                pluginOwner: {
                    select: {
                        id: true,
                        name: true,
                        version: true,
                        sourceType: true
                    }
                }
            },
            orderBy: [{ owner: 'asc' }, { name: 'asc' }] 
        });

        const commandsToCreate = [];
        for (const template of templatesMap.values()) {
            if (!dbCommandsFromDb.some(cmd => cmd.name === template.name)) {
                let permissionId = null;
                if (template.permissions) {
                    const permission = await prisma.permission.upsert({
                        where: { botId_name: { botId, name: template.permissions } },
                        update: { description: t('bots:success_7e0dceb4', { template: template.name }) },
                        create: {
                            botId,
                            name: template.permissions,
                            description: t('bots:success_7e0dceb4', { template: template.name }),
                            owner: template.owner || 'system',
                        }
                    });
                    permissionId = permission.id;
                }

                commandsToCreate.push({
                    botId,
                    name: template.name,
                    isEnabled: template.isActive,
                    cooldown: template.cooldown,
                    aliases: JSON.stringify(template.aliases),
                    description: template.description,
                    owner: template.owner,
                    permissionId: permissionId,
                    allowedChatTypes: JSON.stringify(template.allowedChatTypes),
                });
            }
        }

        if (commandsToCreate.length > 0) {
            await prisma.command.createMany({ data: commandsToCreate });
            dbCommandsFromDb = await prisma.command.findMany({ 
                where: { botId },
                include: {
                    pluginOwner: {
                        select: {
                            id: true,
                            name: true,
                            version: true,
                            sourceType: true
                        }
                    }
                },
                orderBy: [{ owner: 'asc' }, { name: 'asc' }] 
            });
        }

        const finalCommands = dbCommandsFromDb.map(cmd => {
            const template = templatesMap.get(cmd.name);
            let args = [];

            if (cmd.isVisual) {
                try {
                    args = JSON.parse(cmd.argumentsJson || '[]');
                } catch (e) {
                    console.error(`Error parsing argumentsJson for visual command ${cmd.name} (ID: ${cmd.id}):`, e);
                    args = [];
                }
            } else {
                if (template && template.args && template.args.length > 0) {
                    args = template.args;
                } else {
                    try {
                        args = JSON.parse(cmd.argumentsJson || '[]');
                    } catch (e) {
                        args = [];
                    }
                }
            }

            return {
                ...cmd,
                args: args,
                aliases: JSON.parse(cmd.aliases || '[]'),
                allowedChatTypes: JSON.parse(cmd.allowedChatTypes || '[]'),
            };
        })

        res.json({
            groups,
            permissions: allPermissions,
            users: {
                items: users,
                total: usersCount,
                page,
                pageSize,
                totalPages: Math.ceil(usersCount / pageSize),
            },
            commands: finalCommands
        });
        
    } catch (error) {
        console.error(`[API Error] /management-data for bot ${req.params.botId}:`, error);
        res.status(500).json({ error: t('bots:error_c06c7449') });
    }
});

router.put('/:botId/commands/:commandId', authorize('management:edit'), async (req, res) => {
    try {
        const commandId = parseInt(req.params.commandId, 10);
        const { name, description, cooldown, aliases, permissionId, allowedChatTypes, isEnabled, argumentsJson, graphJson, pluginOwnerId } = req.body;

        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.description = description;
        if (cooldown !== undefined) dataToUpdate.cooldown = parseInt(cooldown, 10);
        if (aliases !== undefined) dataToUpdate.aliases = Array.isArray(aliases) ? JSON.stringify(aliases) : aliases;
        if (permissionId !== undefined) dataToUpdate.permissionId = permissionId ? parseInt(permissionId, 10) : null;
        if (allowedChatTypes !== undefined) dataToUpdate.allowedChatTypes = Array.isArray(allowedChatTypes) ? JSON.stringify(allowedChatTypes) : allowedChatTypes;
        if (isEnabled !== undefined) dataToUpdate.isEnabled = isEnabled;
        if (argumentsJson !== undefined) dataToUpdate.argumentsJson = Array.isArray(argumentsJson) ? JSON.stringify(argumentsJson) : argumentsJson;
        if (req.body.testsJson !== undefined) {
            const { sanitizeStoredTests } = require('../../core/services/GraphTestRunner');
            dataToUpdate.testsJson = JSON.stringify(sanitizeStoredTests(req.body.testsJson));
        }
        if (graphJson !== undefined) dataToUpdate.graphJson = graphJson;
        if (pluginOwnerId !== undefined) dataToUpdate.pluginOwnerId = pluginOwnerId;

        const updatedCommand = await prisma.command.update({
            where: { id: commandId },
            data: dataToUpdate,
        });

        if (graphJson && updatedCommand.pluginOwnerId) {
            try {
                const plugin = await prisma.installedPlugin.findUnique({
                    where: { id: updatedCommand.pluginOwnerId }
                });
                
                if (plugin) {
                    const graphDir = path.join(plugin.path, 'graph');
                    await fse.mkdir(graphDir, { recursive: true });
                    
                    const graphFile = path.join(graphDir, `${updatedCommand.name}.json`);
                    await fse.writeJson(graphFile, JSON.parse(graphJson), { spaces: 2 });
                    console.log(t('bots:success_6fc281b6', { updatedCommand: updatedCommand.name, graphFile: graphFile }));
                }
            } catch (error) {
                console.error(t('bots:error_883a25d3'), error);
            }
        }

        res.json(updatedCommand);
    } catch (error) {
        console.error(`[API Error] /commands/:commandId PUT:`, error);
        res.status(500).json({ error: 'Failed to update command' });
    }
});

router.post('/:botId/groups', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const { name, permissionIds } = req.body;
        if (!name) return res.status(400).json({ error: t('bots:validation_366e6b38') });

        const newGroup = await prisma.group.create({
            data: {
                name,
                botId,
                owner: 'admin',
                permissions: { create: (permissionIds || []).map(id => ({ permissionId: id })) }
            }
        });

        botManager.reloadBotConfigInRealTime(botId);

        res.status(201).json(newGroup);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('bots:msg_610490dd') });
        res.status(500).json({ error: t('bots:error_1f8b3381') });
    }
});

router.put('/:botId/groups/:groupId', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const groupId = parseInt(req.params.groupId);
        const { name, permissionIds } = req.body;
        if (!name) return res.status(400).json({ error: t('bots:validation_366e6b38') });

        const usersInGroup = await prisma.user.findMany({
            where: { botId, groups: { some: { groupId } } },
            select: { username: true }
        });

        await prisma.$transaction(async (tx) => {
            await tx.group.update({ where: { id: groupId }, data: { name } });
            await tx.groupPermission.deleteMany({ where: { groupId } });
            if (permissionIds && permissionIds.length > 0) {
                await tx.groupPermission.createMany({
                    data: permissionIds.map(pid => ({ groupId, permissionId: pid })),
                });
            }
        });

        for (const user of usersInGroup) {
            botManager.invalidateUserCache(botId, user.username);
        }

        botManager.reloadBotConfigInRealTime(botId);

        res.status(200).send();
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('bots:msg_610490dd') });
        res.status(500).json({ error: t('bots:error_9365e150') });
    }
});

router.delete('/:botId/groups/:groupId', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const groupId = parseInt(req.params.groupId);
        const group = await prisma.group.findUnique({ where: { id: groupId } });
        if (group && group.owner !== 'admin') {
            return res.status(403).json({ error: `Нельзя удалить группу с источником "${group.owner}".` });
        }
        await prisma.group.delete({ where: { id: groupId } });
        botManager.reloadBotConfigInRealTime(botId);

        res.status(204).send();
    } catch (error) { res.status(500).json({ error: t('bots:error_154d0b1f') }); }
});

router.post('/:botId/permissions', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: t('bots:validation_e06f7a7c') });
        const newPermission = await prisma.permission.create({
            data: { name, description, botId, owner: 'admin' }
        });

        botManager.reloadBotConfigInRealTime(botId);
        
        res.status(201).json(newPermission);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('bots:msg_0174ac21') });
        res.status(500).json({ error: t('bots:error_c4f9c3e6') });
    }
});

router.put('/:botId/users/:userId', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const userId = parseInt(req.params.userId, 10);
        const { isBlacklisted, groupIds } = req.body;

        const updateData = {};
        if (typeof isBlacklisted === 'boolean') {
            updateData.isBlacklisted = isBlacklisted;
        }

        if (Array.isArray(groupIds)) {
            await prisma.userGroup.deleteMany({ where: { userId } });
            updateData.groups = {
                create: groupIds.map(gid => ({ groupId: gid })),
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { groups: true }
        });

        botManager.invalidateUserCache(botId, updatedUser.username);

        UserService.clearCache(updatedUser.username, botId);

        res.json(updatedUser);

    } catch (error) {
        console.error(`[API Error] /users/:userId PUT:`, error);
        res.status(500).json({ error: t('auth:error_48cd62cc') });
    }
});

router.post('/start-all', authorize('bot:start_stop'), async (req, res) => {
    try {
        console.log(t('bots:log_0e1ec293'));

        // Определяем фильтр access by ботам for user
        let whereFilter = {};
        if (req.user && typeof req.user.userId === 'number') {
            const panelUser = await prisma.panelUser.findUnique({
                where: { id: req.user.userId },
                include: { botAccess: { select: { botId: true } } }
            });
            if (panelUser && panelUser.allBots === false) {
                const allowedIds = panelUser.botAccess.map(a => a.botId);
                whereFilter = { id: { in: allowedIds.length ? allowedIds : [-1] } };
            }
        }

        const allBots = await prisma.bot.findMany({
            where: whereFilter,
            include: { server: true, proxy: true }
        });
        let startedCount = 0;
        for (const botConfig of allBots) {
            if (!botManager.bots.has(botConfig.id)) {
                await botManager.startBot(botConfig);
                startedCount++;
            }
        }
        res.json({ success: true, message: t('bots:msg_a1c3249e', { startedCount: startedCount }) });
    } catch (error) {
        console.error('[API Error] /start-all:', error);
        res.status(500).json({ error: t('bots:error_284db4ba') });
    }
});

router.post('/stop-all', authorize('bot:start_stop'), async (req, res) => {
    try {
        console.log(t('bots:log_b8781be3'));

        // Определяем фильтр access by ботам for user
        let allowedBotIds = null;
        if (req.user && typeof req.user.userId === 'number') {
            const panelUser = await prisma.panelUser.findUnique({
                where: { id: req.user.userId },
                include: { botAccess: { select: { botId: true } } }
            });
            if (panelUser && panelUser.allBots === false) {
                allowedBotIds = new Set(panelUser.botAccess.map(a => a.botId));
            }
        }

        const botIds = Array.from(botManager.bots.keys());
        let stoppedCount = 0;
        for (const botId of botIds) {
            // If у user есть ограничения, проверяем access
            if (allowedBotIds !== null && !allowedBotIds.has(botId)) {
                continue;
            }
            botManager.stopBot(botId);
            stoppedCount++;
        }
        res.json({ success: true, message: t('bots:msg_e1272ce5', { stoppedCount: stoppedCount }) });
    } catch (error) {
        console.error('[API Error] /stop-all:', error);
        res.status(500).json({ error: t('bots:error_265bfd33') });
    }
});

router.get('/:id/settings/all', authenticateUniversal, checkBotAccess, authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.id, 10);

        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: {
                server: true,
                proxy: true,
                installedPlugins: {
                    orderBy: { name: 'asc' }
                }
            }
        });

        if (!bot) {
            return res.status(404).json({ error: t('bots:msg_13215f66') });
        }

        const allSettings = {
            bot: {
                id: bot.id,
                username: bot.username,
                prefix: bot.prefix,
                note: bot.note,
                owners: bot.owners,
                serverId: bot.serverId,
                proxyId: bot.proxyId,
                proxyHost: bot.proxyHost,
                proxyPort: bot.proxyPort,
                proxyUsername: bot.proxyUsername,
            },
            plugins: []
        };

        const pluginSettingsPromises = bot.installedPlugins.map(async (plugin) => {
            const manifest = plugin.manifest ? JSON.parse(plugin.manifest) : {};
            
            if (!manifest.settings || Object.keys(manifest.settings).length === 0) {
                return null;
            }

            const savedSettings = plugin.settings ? JSON.parse(plugin.settings) : {};
            let defaultSettings = {};

            for (const key in manifest.settings) {
                const config = manifest.settings[key];
                if (config.type === 'json_file' && config.defaultPath) {
                    const configFilePath = path.join(plugin.path, config.defaultPath);
                    try {
                        const fileContent = await fs.readFile(configFilePath, 'utf-8');
                        defaultSettings[key] = JSON.parse(fileContent);
                    } catch (e) { defaultSettings[key] = {}; }
                } else {
                    try { defaultSettings[key] = JSON.parse(config.default || 'null'); } 
                    catch { defaultSettings[key] = config.default; }
                }
            }

            const mergedSettings = deepMergeSettings(defaultSettings, savedSettings);
            
            // Определяем type настроек (обычные or группированные)
            const isGrouped = isGroupedSettings(manifest.settings);
            
            // Фильтруем секретные values
            const filteredSettings = filterSecretSettings(mergedSettings, manifest.settings, isGrouped);
            
            return {
                id: plugin.id,
                name: plugin.name,
                description: plugin.description,
                isEnabled: plugin.isEnabled,
                manifest: manifest,
                settings: filteredSettings
            };
        });

        allSettings.plugins = (await Promise.all(pluginSettingsPromises)).filter(Boolean);

        res.json(allSettings);

    } catch (error) {
        console.error("[API Error] /settings/all GET:", error);
        res.status(500).json({ error: t('bots:error_53718bfc') });
    }
});

const nodeRegistry = require('../../core/NodeRegistry'); 

router.get('/:botId/visual-editor/nodes', authenticateUniversal, checkBotAccess, authorize('management:view'), (req, res) => {
    try {
        const { graphType } = req.query;
        const nodesByCategory = nodeRegistry.getNodesByCategory(graphType);
        res.json(nodesByCategory);
    } catch (error) {
        console.error('[API Error] /visual-editor/nodes GET:', error);
        res.status(500).json({ error: 'Failed to get available nodes' });
    }
});

router.get('/:botId/visual-editor/node-config', authenticateUniversal, checkBotAccess, authorize('management:view'), (req, res) => {
    try {
        const { types } = req.query;
        if (!types) {
            return res.status(400).json({ error: 'Node types must be provided' });
        }
        const typeArray = Array.isArray(types) ? types : [types];
        const config = nodeRegistry.getNodesByTypes(typeArray);
        res.json(config);
    } catch (error) {
        console.error('[API Error] /visual-editor/node-config GET:', error);
        res.status(500).json({ error: 'Failed to get node configuration' });
    }
});

router.get('/:botId/visual-editor/permissions', authenticateUniversal, checkBotAccess, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const permissions = await prisma.permission.findMany({ 
            where: { botId },
            orderBy: { name: 'asc' }
        });
        res.json(permissions);
    } catch (error) {
        console.error('[API Error] /visual-editor/permissions GET:', error);
        res.status(500).json({ error: 'Failed to get permissions' });
    }
});

router.post('/:botId/commands/visual', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const {
            name,
            description,
            aliases = [],
            permissionId,
            cooldown = 0,
            allowedChatTypes = ['chat', 'private'],
            argumentsJson = '[]',
            graphJson = 'null'
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Command name is required' });
        }

        const newCommand = await prisma.command.create({
            data: {
                botId,
                name,
                description,
                aliases: JSON.stringify(aliases),
                permissionId: permissionId || null,
                cooldown,
                allowedChatTypes: JSON.stringify(allowedChatTypes),
                isVisual: true,
                argumentsJson,
                graphJson,
                pluginOwnerId: null
            }
        });

        botManager.reloadBotConfigInRealTime(botId);
        res.status(201).json(newCommand);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Command with this name already exists' });
        }
        console.error('[API Error] /commands/visual POST:', error);
        res.status(500).json({ error: 'Failed to create visual command' });
    }
});

router.put('/:botId/commands/:commandId/visual', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const commandId = parseInt(req.params.commandId, 10);
        const {
            name,
            description,
            aliases,
            permissionId,
            cooldown,
            allowedChatTypes,
            argumentsJson,
            graphJson
        } = req.body;

        const dataToUpdate = { isVisual: true };
        
        if (name) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.description = description;
        if (Array.isArray(aliases)) dataToUpdate.aliases = JSON.stringify(aliases);
        if (permissionId !== undefined) dataToUpdate.permissionId = permissionId || null;
        if (typeof cooldown === 'number') dataToUpdate.cooldown = cooldown;
        if (Array.isArray(allowedChatTypes)) dataToUpdate.allowedChatTypes = JSON.stringify(allowedChatTypes);
        if (argumentsJson !== undefined) dataToUpdate.argumentsJson = argumentsJson;
        if (graphJson !== undefined) dataToUpdate.graphJson = graphJson;

        const updatedCommand = await prisma.command.update({
            where: { id: commandId, botId },
            data: dataToUpdate
        });

        if (graphJson && updatedCommand.pluginOwnerId) {
            try {
                const plugin = await prisma.installedPlugin.findUnique({
                    where: { id: updatedCommand.pluginOwnerId }
                });
                
                if (plugin) {
                    const graphDir = path.join(plugin.path, 'graph');
                    await fse.mkdir(graphDir, { recursive: true });
                    
                    const graphFile = path.join(graphDir, `${updatedCommand.name}.json`);
                    await fse.writeJson(graphFile, JSON.parse(graphJson), { spaces: 2 });
                    console.log(t('bots:success_6fc281b6', { updatedCommand: updatedCommand.name, graphFile: graphFile }));
                }
            } catch (error) {
                console.error(t('bots:error_883a25d3'), error);
            }
        }

        botManager.reloadBotConfigInRealTime(botId);
        res.json(updatedCommand);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Command with this name already exists' });
        }
        console.error('[API Error] /commands/:commandId/visual PUT:', error);
        res.status(500).json({ error: 'Failed to update visual command' });
    }
});

router.post('/:botId/commands/:commandId/test-suite', checkBotAccess, authorize('management:edit'), async (req, res) => {
    try {
        const { runCommandSuite } = require('../../core/services/GraphTestRunner');
        const result = await runCommandSuite({
            botId: parseInt(req.params.botId, 10),
            graphId: parseInt(req.params.commandId, 10),
            body: req.body,
        });
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        if (status >= 500) console.error('[Test Suite] command failed:', error);
        res.status(status).json({ error: error.message || 'Test suite failed' });
    }
});

router.post('/:botId/commands/:commandId/test-run', checkBotAccess, authorize('management:edit'), async (req, res) => {
    try {
        const { startOwnedTest } = require('../../core/services/GraphTestRunner');
        const result = await startOwnedTest({
            kind: 'command',
            botId: parseInt(req.params.botId, 10),
            graphId: parseInt(req.params.commandId, 10),
            body: req.body,
        });
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        if (status >= 500) console.error('[Test Run] command failed:', error);
        res.status(status).json({ error: error.message || 'Test run failed' });
    }
});

router.post('/:botId/commands/:commandId/run-node', checkBotAccess, authorize('management:edit'), async (req, res) => {
    try {
        const { runOwnedNode } = require('../../core/services/GraphTestRunner');
        const result = await runOwnedNode({
            kind: 'command',
            botId: parseInt(req.params.botId, 10),
            graphId: parseInt(req.params.commandId, 10),
            nodeId: req.body?.node?.id,
            body: req.body,
        });
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        if (status >= 500) console.error('[Run Node] command failed:', error);
        res.status(status).json({ error: error.message || 'Run node failed' });
    }
});

router.get('/:botId/commands/:commandId/export', authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const commandId = parseInt(req.params.commandId, 10);

        const command = await prisma.command.findUnique({
            where: { id: commandId, botId: botId },
        });

        if (!command) {
            return res.status(404).json({ error: 'Command not found' });
        }

        const exportData = {
            version: '1.0',
            type: 'command',
            ...command
        };
        
        delete exportData.id;
        delete exportData.botId;

        res.json(exportData);
    } catch (error) {
        console.error('Failed to export command:', error);
        res.status(500).json({ error: 'Failed to export command' });
    }
});

router.post('/:botId/commands/import', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const importData = req.body;

        if (importData.type !== 'command') {
            return res.status(400).json({ error: 'Invalid file type. Expected "command".' });
        }

        let commandName = importData.name;
        let counter = 1;

        while (await prisma.command.findFirst({ where: { botId, name: commandName } })) {
            commandName = `${importData.name}_imported_${counter}`;
            counter++;
        }

        let finalGraphJson = importData.graphJson;

        if (finalGraphJson && finalGraphJson !== 'null') {
            const graph = JSON.parse(finalGraphJson);
            const nodeIdMap = new Map();

            if (graph.nodes) {
                graph.nodes.forEach(node => {
                    const oldId = node.id;
                    const newId = `${node.type}-${randomUUID()}`;
                    nodeIdMap.set(oldId, newId);
                    node.id = newId;
                });
            }

            if (graph.connections) {
                graph.connections.forEach(conn => {
                    conn.id = `edge-${randomUUID()}`;
                    conn.sourceNodeId = nodeIdMap.get(conn.sourceNodeId) || conn.sourceNodeId;
                    conn.targetNodeId = nodeIdMap.get(conn.targetNodeId) || conn.targetNodeId;
                });
            }

            finalGraphJson = JSON.stringify(graph);
        }

        const newCommand = await prisma.command.create({
            data: {
                botId: botId,
                name: commandName,
                description: importData.description,
                aliases: importData.aliases,
                permissionId: null,
                cooldown: importData.cooldown,
                allowedChatTypes: importData.allowedChatTypes,
                isVisual: importData.isVisual,
                isEnabled: importData.isEnabled,
                argumentsJson: importData.argumentsJson,
                graphJson: finalGraphJson,
                owner: 'visual_editor',
            }
        });

        botManager.reloadBotConfigInRealTime(botId);
        res.status(201).json(newCommand);
    } catch (error) {
        console.error("Failed to import command:", error);
        res.status(500).json({ error: 'Failed to import command' });
    }
});

router.post('/:botId/commands', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const {
            name,
            description,
            aliases = [],
            permissionId,
            cooldown = 0,
            allowedChatTypes = ['chat', 'private'],
            isVisual = false,
            argumentsJson = '[]',
            graphJson = 'null'
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Command name is required' });
        }

        const newCommand = await prisma.command.create({
            data: {
                botId,
                name,
                description,
                aliases: JSON.stringify(aliases),
                permissionId: permissionId || null,
                cooldown,
                allowedChatTypes: JSON.stringify(allowedChatTypes),
                isVisual,
                argumentsJson,
                graphJson,
                owner: isVisual ? 'visual_editor' : 'manual',
                pluginOwnerId: null
            }
        });

        if (graphJson && graphJson !== 'null' && req.body.pluginOwnerId) {
            try {
                const plugin = await prisma.installedPlugin.findUnique({
                    where: { id: req.body.pluginOwnerId }
                });
                
                if (plugin) {
                    const graphDir = path.join(plugin.path, 'graph');
                    await fse.mkdir(graphDir, { recursive: true });
                    
                    const graphFile = path.join(graphDir, `${name}.json`);
                    await fse.writeJson(graphFile, JSON.parse(graphJson), { spaces: 2 });
                    console.log(t('bots:success_0dfb8c9b', { name: name, graphFile: graphFile }));
                }
            } catch (error) {
                console.error(t('bots:error_883a25d3'), error);
            }
        }

        botManager.reloadBotConfigInRealTime(botId);
        res.status(201).json(newCommand);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Command with this name already exists' });
        }
        console.error('[API Error] /commands POST:', error);
        res.status(500).json({ error: 'Failed to create command' });
    }
});

router.delete('/:botId/commands/:commandId', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const commandId = parseInt(req.params.commandId, 10);

        await prisma.command.delete({
            where: { id: commandId, botId: botId },
        });

        botManager.reloadBotConfigInRealTime(botId);
        res.status(204).send();
    } catch (error) {
        console.error(`[API Error] /commands/:commandId DELETE:`, error);
        res.status(500).json({ error: 'Failed to delete command' });
    }
});

router.get('/:botId/event-graphs/:graphId', authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const graphId = parseInt(req.params.graphId, 10);

        const eventGraph = await prisma.eventGraph.findUnique({
            where: { id: graphId, botId },
            include: { triggers: true },
        });

        if (!eventGraph) {
            return res.status(404).json({ error: t('bots:msg_923a7f98') });
        }

        res.json(eventGraph);
    } catch (error) {
        console.error(`[API Error] /event-graphs/:graphId GET:`, error);
        res.status(500).json({ error: t('bots:error_c9f54b2c') });
    }
});

router.post('/:botId/event-graphs', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const { name, description, graphJson, variables, eventType, isEnabled = true } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: t('bots:validation_6d4a1e5e') });
        }

        let graphJsonString;
        if (graphJson) {
            if (typeof graphJson === 'string') {
                graphJsonString = graphJson;
            } else {
                graphJsonString = JSON.stringify(graphJson);
            }
        } else {
            graphJsonString = JSON.stringify({
                nodes: [],
                connections: []
            });
        }

        console.log('[API] Final graphJsonString:', graphJsonString);

        let eventTypes = [];
        try {
            const parsedGraph = JSON.parse(graphJsonString);
            if (parsedGraph.nodes && Array.isArray(parsedGraph.nodes)) {
                const eventNodes = parsedGraph.nodes.filter(node => node.type && node.type.startsWith('event:'));
                eventTypes = [...new Set(eventNodes.map(node => node.type.split(':')[1]))];
            }
        } catch (error) {
            console.warn(t('bots:error_08b1206f'), error.message);
        }

        const newEventGraph = await prisma.eventGraph.create({
            data: {
                botId,
                name: name.trim(),
                description: description || '',
                isEnabled: isEnabled,
                graphJson: graphJsonString,
                variables: variables || '[]',
                eventType: eventType || 'custom',
                triggers: {
                    create: eventTypes.map(eventType => ({ eventType }))
                }
            },
            include: { triggers: true }
        });

        console.log('[API] Created event graph:', newEventGraph);
        res.status(201).json(newEventGraph);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: t('bots:msg_3ce61614') });
        }
        console.error(`[API Error] /event-graphs POST:`, error);
        res.status(500).json({ error: t('bots:error_6403ecd9') });
    }
});

router.delete('/:botId/event-graphs/:graphId', authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const graphId = parseInt(req.params.graphId, 10);

        await prisma.eventGraph.delete({
            where: { id: graphId, botId: botId },
        });

        res.status(204).send();
    } catch (error) {
        console.error(`[API Error] /event-graphs/:graphId DELETE:`, error);
        res.status(500).json({ error: t('bots:error_4a28cf83') });
    }
});

router.put('/:botId/event-graphs/:graphId', authorize('management:edit'), async (req, res) => {
    const { botId, graphId } = req.params;
    const { name, isEnabled, graphJson, variables, pluginOwnerId } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: t('bots:validation_1d621534') });
    }

    if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({ error: t('bots:validation_0604e964') });
    }

    try {
        const dataToUpdate = {
            name: name.trim(),
            isEnabled,
        };

        if (graphJson !== undefined) {
            dataToUpdate.graphJson = graphJson;
        }

        if (variables !== undefined) {
            dataToUpdate.variables = Array.isArray(variables) ? JSON.stringify(variables) : variables;
        }

        if (pluginOwnerId !== undefined) {
            dataToUpdate.pluginOwnerId = pluginOwnerId;
        }

        const updatedGraph = await prisma.eventGraph.update({
            where: { id: parseInt(graphId), botId: parseInt(botId) },
            data: dataToUpdate
        });
        
        res.json(updatedGraph);
    } catch (error) {
        console.error(`[API Error] /event-graphs/:graphId PUT:`, error);
        res.status(500).json({ error: t('bots:error_28b7f2a1') });
    }
});

router.post('/:botId/visual-editor/save', authorize('management:edit'), async (req, res) => {
});

router.get('/:botId/ui-extensions', authorize('plugin:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const enabledPlugins = await prisma.installedPlugin.findMany({
            where: { botId: botId, isEnabled: true }
        });

        const extensions = [];
        for (const plugin of enabledPlugins) {
            if (plugin.manifest) {
                try {
                    const manifest = JSON.parse(plugin.manifest);
                    if (manifest.uiExtensions && Array.isArray(manifest.uiExtensions)) {
                        manifest.uiExtensions.forEach(ext => {
                            extensions.push({
                                pluginName: plugin.name,
                                ...ext
                            });
                        });
                    }
                } catch (e) {
                    console.error(t('bots:error_f82ebd09', { plugin: plugin.name }), e);
                }
            }
        }
        res.json(extensions);
    } catch (error) {
        res.status(500).json({ error: t('bots:error_10c7b8d6') });
    }
});

router.get('/:botId/plugins/:pluginName/ui-content/:path', authorize('plugin:list'), async (req, res) => {
    const { botId, pluginName, path: uiPath } = req.params;
    const numericBotId = parseInt(botId, 10);

    try {
        const plugin = await prisma.installedPlugin.findFirst({
            where: { botId: numericBotId, name: pluginName, isEnabled: true }
        });

        if (!plugin) {
            return res.status(404).json({ error: `Активный плагин "${pluginName}" не найден для этого бота.` });
        }

        const manifest = plugin.manifest ? JSON.parse(plugin.manifest) : {};
        const savedSettings = plugin.settings ? JSON.parse(plugin.settings) : {};
        const defaultSettings = {};

        if (manifest.settings) {
            for (const key in manifest.settings) {
                const config = manifest.settings[key];
                if (config.type === 'json_file' && config.defaultPath) {
                    const configFilePath = path.join(plugin.path, config.defaultPath);
                    try {
                        const fileContent = await fs.readFile(configFilePath, 'utf-8');
                        defaultSettings[key] = JSON.parse(fileContent);
                    } catch (e) { defaultSettings[key] = {}; }
                } else {
                    try { defaultSettings[key] = JSON.parse(config.default || 'null'); } 
                    catch { defaultSettings[key] = config.default; }
                }
            }
        }
        const finalSettings = { ...defaultSettings, ...savedSettings };
        
        const mainFilePath = manifest.main || 'index.js';
        const pluginEntryPoint = path.join(plugin.path, mainFilePath);
        
        delete require.cache[require.resolve(pluginEntryPoint)];
        const pluginModule = require(pluginEntryPoint);

        if (typeof pluginModule.getUiPageContent !== 'function') {
            return res.status(501).json({ error: `Плагин "${pluginName}" не предоставляет кастомный UI контент.` });
        }
        
        const botProcess = botManager.bots.get(numericBotId);
        const botApi = botProcess ? botProcess.api : null;
        
        const content = await pluginModule.getUiPageContent({
            path: uiPath,
            bot: botApi,
            botId: numericBotId,
            settings: finalSettings
        });

        if (content === null) {
            return res.status(404).json({ error: `Для пути "${uiPath}t('bots:msg_41c42b25')${pluginName}".` });
        }

        res.json(content);

    } catch (error) {
        console.error(`[UI Content] Ошибка при получении контента для плагина "${pluginName}":`, error);
        res.status(500).json({ error: error.message || t('bots:error_06d5089a') });
    }
});


router.post('/:botId/plugins/:pluginName/action', authorize('plugin:list'), async (req, res) => {
    const { botId, pluginName } = req.params;
    const { actionName, payload } = req.body;
    const numericBotId = parseInt(botId, 10);

    if (!actionName) {
        return res.status(400).json({ error: 'Необходимо указать "actionName".' });
    }

    try {
        const botProcess = botManager.bots.get(numericBotId);
        
        if (!botProcess) {
            return res.status(404).json({ error: t('bots:msg_f16030ea') });
        }

        const plugin = await prisma.installedPlugin.findFirst({
            where: { botId: numericBotId, name: pluginName, isEnabled: true }
        });

        if (!plugin) {
            return res.status(404).json({ error: `Активный плагин с таким именем "${pluginName}" не найден.` });
        }

        const manifest = plugin.manifest ? JSON.parse(plugin.manifest) : {};
        const savedSettings = plugin.settings ? JSON.parse(plugin.settings) : {};
        const defaultSettings = {};

        if (manifest.settings) {
            for (const key in manifest.settings) {
                const config = manifest.settings[key];
                 if (config.type === 'json_file' && config.defaultPath) {
                    const configFilePath = path.join(plugin.path, config.defaultPath);
                    try {
                        const fileContent = await fs.readFile(configFilePath, 'utf-8');
                        defaultSettings[key] = JSON.parse(fileContent);
                    } catch (e) { 
                        console.error(t('bots:error_b16d606f', { pluginName: pluginName, e: e.message }));
                        defaultSettings[key] = {}; 
                    }
                } else {
                    try { 
                        defaultSettings[key] = JSON.parse(config.default || 'null'); 
                    } catch { 
                        defaultSettings[key] = config.default; 
                    }
                }
            }
        }
        const finalSettings = { ...defaultSettings, ...savedSettings };

        const mainFilePath = manifest.main || 'index.js';
        const pluginPath = path.join(plugin.path, mainFilePath);
        
        delete require.cache[require.resolve(pluginPath)];
        const pluginModule = require(pluginPath);
const { t } = require('../../i18n');

        if (typeof pluginModule.handleAction !== 'function') {
            return res.status(501).json({ error: `Плагин "${pluginName}" не поддерживает обработку действий.` });
        }
        
        const result = await pluginModule.handleAction({
            botProcess: botProcess,
            botId: numericBotId,
            action: actionName,
            payload: payload,
            settings: finalSettings
        });

        res.json({ success: true, message: t('bots:success_32d2b6b1'), result: result || null });

    } catch (error) {
        console.error(`Ошибка выполнения действия "${actionName}t('bots:msg_95969113')${pluginName}":`, error);
        res.status(500).json({ error: error.message || t('bots:error_06d5089a') });
    }
});


router.get('/:botId/export', authenticateUniversal, checkBotAccess, authorize('bot:export'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const {
            includeCommands,
            includePermissions,
            includePluginFiles,
            includePluginDataStore,
            includeEventGraphs,
        } = req.query;

        const bot = await prisma.bot.findUnique({ where: { id: botId } });
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('warning', (err) => {
            console.warn(t('bots:log_42add1b4'), err);
        });
        archive.on('error', (err) => {
            console.error(t('bots:error_20da9958'), err);
            if (!res.headersSent) {
                res.status(500).json({ error: `Failed to export bot: ${err.message}` });
            } else {
                res.destroy(err);
            }
        });

        const safeUsername = String(bot.username).replace(/[^a-zA-Z0-9_.-]/g, '_');
        const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        res.attachment(`bot_${safeUsername}_export_${safeTimestamp}.zip`);
        archive.pipe(res);

        const botData = { ...bot };
        delete botData.password;
        delete botData.proxyPassword;
        archive.append(JSON.stringify(botData, null, 2), { name: 'bot.json' });

        if (includeCommands === 'true') {
            const commands = await prisma.command.findMany({ where: { botId } });
            archive.append(JSON.stringify(commands, null, 2), { name: 'commands.json' });
        }

        if (includePermissions === 'true') {
            const users = await prisma.user.findMany({ where: { botId }, include: { groups: { include: { group: true } } } });
            const groups = await prisma.group.findMany({ where: { botId }, include: { permissions: { include: { permission: true } } } });
            const permissions = await prisma.permission.findMany({ where: { botId } });
            const permissionsData = { users, groups, permissions };
            archive.append(JSON.stringify(permissionsData, null, 2), { name: 'permissions.json' });
        }
        
        if (includeEventGraphs === 'true') {
            const eventGraphs = await prisma.eventGraph.findMany({ where: { botId } });
            archive.append(JSON.stringify(eventGraphs, null, 2), { name: 'event_graphs.json' });
        }

        if (includePluginFiles === 'true' || includePluginDataStore === 'true') {
            const installedPlugins = await prisma.installedPlugin.findMany({ where: { botId } });
            archive.append(JSON.stringify(installedPlugins, null, 2), { name: 'plugins.json' });

            try {
                const pluginSettings = installedPlugins
                    .filter(plugin => plugin.settings && plugin.settings !== '{}')
                    .map(plugin => ({
                        pluginName: plugin.name,
                        settings: plugin.settings
                    }));
                
                if (pluginSettings.length > 0) {
                    console.log(t('bots:log_a51788e2', { botId: botId, pluginSettings: pluginSettings.length }));
                    archive.append(JSON.stringify(pluginSettings, null, 2), { name: 'settings.json' });
                } else {
                    console.log(t('bots:log_d9f8e8c2'));
                }
            } catch (error) {
                console.warn(t('bots:error_3b4e969d'), error.message);
            }

            if (includePluginFiles === 'true') {
                for (const plugin of installedPlugins) {
                    const pluginPath = plugin.path;
                    if (await fs.stat(pluginPath).then(s => s.isDirectory()).catch(() => false)) {
                        archive.directory(pluginPath, `plugins/${plugin.name}`, (entry) => {
                            const parts = entry.name.split(/[\\/]/);
                            if (parts.includes('node_modules') || parts.includes('.git')) return false;
                            return entry;
                        });
                    }
                }
            }
            if (includePluginDataStore === 'true') {
                console.log(t('bots:log_7d134776', { botId: botId }));
                const pluginDataStore = await prisma.pluginDataStore.findMany({ 
                    where: { botId: parseInt(botId) } 
                });
                console.log(t('bots:log_38322f9d', { pluginDataStore: pluginDataStore.length }));
                if (pluginDataStore.length > 0) {
                    archive.append(JSON.stringify(pluginDataStore, null, 2), { name: 'plugin_data_store.json' });
                    console.log(t('bots:log_505919b9'));
                } else {
                    console.log(t('bots:log_cf9194e9'));
                }
            }
        }

        await archive.finalize();

    } catch (error) {
        console.error('Failed to export bot:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: `Failed to export bot: ${error.message}` });
        }
    }
});

router.post('/import', authorize('bot:create'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const zip = parseImportZip(req.file.buffer);

        const server = await prisma.server.findFirst();
        if (!server) {
            return res.status(500).json({ error: 'No servers configured in the target system.' });
        }

        const newBot = await importBotFromZip(zip, {
            config: {
                serverId: server.id,
                autoRename: true,
                password: null,
                proxyPassword: null,
            },
            prisma,
            pluginManager,
            setupDefaultPermissions: setupDefaultPermissionsForBot,
        });

        res.status(201).json(newBot);
    } catch (error) {
        console.error('Failed to import bot:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: t('bots:msg_209b76d4') });
        }
        res.status(error.statusCode || 500).json({ error: `Failed to import bot: ${error.message}` });
    }
});

router.post('/import/preview', authorize('bot:create'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: t('bots:success_b430269c') });
        }

        const zip = parseImportZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        const readJson = (name) => {
            const entry = zipEntries.find(e => e.entryName === name);
            if (!entry) return null;
            return JSON.parse(entry.getData().toString('utf8'));
        };

        const importData = {
            plugins: [],
            commands: [],
            eventGraphs: [],
            settings: null,
            bot: null,
        };

        const botConfig = readJson('bot.json');
        if (botConfig) {
            delete botConfig.password;
            delete botConfig.proxyPassword;
            delete botConfig.id;
            delete botConfig.createdAt;
            delete botConfig.updatedAt;
            importData.bot = botConfig;
        }

        importData.plugins = readJson('plugins.json') || [];
        importData.commands = readJson('commands.json') || [];
        importData.eventGraphs = readJson('event_graphs.json') || readJson('event-graphs.json') || [];
        importData.settings = readJson('settings.json');

        res.json(importData);
    } catch (error) {
        console.error('[API Error] /bots/import/preview:', error);
        res.status(error.statusCode || 500).json({
            error: error.statusCode ? error.message : t('bots:error_6c511b29'),
        });
    }
});

router.post('/import/create', authorize('bot:create'), upload.single('file'), async (req, res) => {
    try {
        const { username, password, prefix, serverId, note, owners, proxyId, proxyHost, proxyPort, proxyUsername, proxyPassword } = req.body;

        if (!username || !serverId) {
            return res.status(400).json({ error: t('bots:validation_8b3a46bc') });
        }
        if (!req.file) {
            return res.status(400).json({ error: t('bots:msg_2eb6fe9b') });
        }

        const zip = parseImportZip(req.file.buffer);

        const useProxyId = proxyId ? parseInt(proxyId, 10) : null;
        res.status(200);
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') res.flushHeaders();
        res.socket?.setNoDelay?.(true);
        const send = (event) => {
            if (event.type === 'progress' && !event.elapsedMs) {
                const where = event.name ? ` ${event.index}/${event.total} ${event.name}` : '';
                console.log(`[Import] ${event.stage}${where}${event.step ? ` ${event.step}` : ''}`);
            }
            res.write(`${JSON.stringify(event)}\n`);
        };

        try {
            const newBot = await importBotFromZip(zip, {
                config: {
                    username,
                    prefix,
                    note,
                    owners: owners || '',
                    serverId: parseInt(serverId, 10),
                    password: password ? encrypt(password) : null,
                    proxyId: useProxyId,
                    proxyHost: useProxyId ? null : (proxyHost || null),
                    proxyPort: useProxyId ? null : sanitizeProxyPort(proxyPort),
                    proxyUsername: useProxyId ? null : (proxyUsername || null),
                    proxyPassword: useProxyId ? null : (proxyPassword ? encrypt(proxyPassword) : null),
                    autoRename: false,
                },
                prisma,
                pluginManager,
                setupDefaultPermissions: setupDefaultPermissionsForBot,
                onProgress: (event) => send({ type: 'progress', ...event }),
            });
            send({ type: 'done', bot: newBot });
            res.end();
        } catch (error) {
            const message = error.code === 'P2002'
                ? t('bots:msg_209b76d4')
                : (error.statusCode ? error.message : t('bots:error_205c71e2'));
            console.error('[API Error] /bots/import/create:', error);
            send({ type: 'error', error: message });
            res.end();
        }
    } catch (error) {
        if (res.headersSent) return;
        if (error.code === 'P2002') {
            return res.status(409).json({ error: t('bots:msg_209b76d4') });
        }
        console.error('[API Error] /bots/import/create:', error);
        res.status(error.statusCode || 500).json({
            error: error.statusCode ? error.message : t('bots:error_205c71e2'),
        });
    }
});

module.exports = router;
