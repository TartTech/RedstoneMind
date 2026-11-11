const express = require('express');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const botHistoryStore = require('../../core/BotHistoryStore');
const { t } = require('../../i18n');

const router = express.Router();

router.get('/:botId/chat', authenticateUniversal, authorize('bot:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const { type, username, search, from, to, limit, offset } = req.query;

        const result = botHistoryStore.getChatHistory(botId, {
            type,
            username,
            search,
            from,
            to,
            limit: limit || 100,
            offset: offset || 0
        });

        res.json({
            messages: result.messages,
            total: result.total,
            pagination: {
                total: result.total,
                limit: parseInt(limit) || 100,
                offset: parseInt(offset) || 0,
                hasMore: (parseInt(offset) || 0) + (parseInt(limit) || 100) < result.total
            }
        });
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/chat:', error);
        res.status(500).json({
            success: false,
            error: t('bots:error_b216e526')
        });
    }
});

router.get('/:botId/commands', authenticateUniversal, authorize('bot:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const { username, command, success, from, to, limit, offset } = req.query;

        const query = {
            username,
            command,
            success,
            from,
            to,
            limit: limit || 100,
            offset: offset || 0
        };
        const result = req.query.scope === 'all'
            ? await botHistoryStore.getPersistentCommandLogs(botId, query)
            : botHistoryStore.getCommandLogs(botId, query);

        res.json({
            logs: result.logs,
            total: result.total,
            pagination: {
                total: result.total,
                limit: parseInt(limit) || 100,
                offset: parseInt(offset) || 0,
                hasMore: (parseInt(offset) || 0) + (parseInt(limit) || 100) < result.total
            }
        });
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/commands:', error);
        res.status(500).json({
            success: false,
            error: t('bots:error_6abcc118')
        });
    }
});

router.get('/:botId/stats', authenticateUniversal, authorize('bot:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        const stats = botHistoryStore.getStats(botId);

        res.json(stats);
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/stats:', error);
        res.status(500).json({
            success: false,
            error: t('bots:error_51a0ca06')
        });
    }
});

router.delete('/:botId/clear', authenticateUniversal, authorize('bot:list'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        botHistoryStore.clearBot(botId);

        res.json({
            success: true,
            message: t('bots:msg_dbb31f3a')
        });
    } catch (error) {
        console.error('[API Error] DELETE /bots/:botId/clear:', error);
        res.status(500).json({
            success: false,
            error: t('bots:error_c8bc970b')
        });
    }
});

module.exports = router;
