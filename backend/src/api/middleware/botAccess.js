const prisma = require('../../lib/prisma');
const { t } = require('../../i18n');

async function userCanAccessBot(userId, botId) {
    if (!userId || !Number.isInteger(botId)) return false;
    const user = await prisma.panelUser.findUnique({
        where: { id: userId },
        include: { botAccess: { select: { botId: true } } },
    });
    if (!user) return false;
    if (user.allBots !== false) return true;
    return user.botAccess.some((entry) => entry.botId === botId);
}

async function checkBotAccess(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: t('api:msg_d602b92c') });

        const botIdRaw = req.params.botId ?? req.params.id;
        const botId = parseInt(botIdRaw, 10);
        if (isNaN(botId)) return res.status(400).json({ error: t('api:error_b4da0119') });

        const allowed = await userCanAccessBot(userId, botId);
        if (!allowed) {
            return res.status(403).json({ error: t('api:error_47ae189e') });
        }
        return next();
    } catch (e) {
        console.error('[checkBotAccess] error', e);
        return res.status(500).json({ error: t('api:error_40be3b49') });
    }
}

function checkPluginBotAccess({ pluginIdParam = 'id' } = {}) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: t('api:msg_d602b92c') });

            const pluginId = parseInt(req.params[pluginIdParam], 10);
            if (isNaN(pluginId)) return res.status(400).json({ error: t('api:error_4cc69e80') });

            const plugin = await prisma.installedPlugin.findUnique({
                where: { id: pluginId },
                select: { id: true, botId: true },
            });
            if (!plugin) return res.status(404).json({ error: t('api:msg_07a06551') });

            const allowed = await userCanAccessBot(userId, plugin.botId);
            if (!allowed) return res.status(403).json({ error: t('api:error_4a676f2c') });

            req.targetPlugin = plugin;
            return next();
        } catch (e) {
            console.error('[checkPluginBotAccess] error', e);
            return res.status(500).json({ error: t('api:error_40be3b49') });
        }
    };
}

module.exports = { checkBotAccess, checkPluginBotAccess, userCanAccessBot };
