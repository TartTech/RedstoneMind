const express = require('express');
const prisma = require('../../lib/prisma');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { authenticate, authorize } = require('../middleware/auth');
const { checkBotAccess } = require('../middleware/botAccess');

const router = express.Router({ mergeParams: true });

// Middleware for verification access to боту
router.use(authenticate, checkBotAccess);

// GET /api/bots/:botId/api-keys/connected - Получить количество подключенных клиентов (Must БЫТЬ Before /:keyId)
router.get('/connected', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);

        const { getIO } = require('../../real-time/socketHandler');
        const { getConnectedClientsCount } = require('../../real-time/botApi/utils');
const { t } = require('../../i18n');

        const io = getIO();
        const count = getConnectedClientsCount(io, botId);

        res.json({ success: true, count });
    } catch (error) {
        console.error(t('api-keys:error_065d6587'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_508c0567') });
    }
});

// GET /api/bots/:botId/api-keys/logs - Получить логи подключений (Must БЫТЬ Before /:keyId)
router.get('/logs', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const limit = parseInt(req.query.limit, 10) || 50;

        const logs = await prisma.apiConnectionLog.findMany({
            where: { botId },
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 200),
        });

        res.json({ success: true, logs });
    } catch (error) {
        console.error(t('api-keys:error_821b25a8'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_46cfe0ab') });
    }
});

// GET /api/bots/:botId/api-keys - Получить list всех API ключей
router.get('/', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);

        const keys = await prisma.botApiKey.findMany({
            where: { botId },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                permissions: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, keys });
    } catch (error) {
        console.error(t('api-keys:error_c0874f09'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_ebf23142') });
    }
});

// POST /api/bots/:botId/api-keys - Создать new API key
router.post('/', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const { name, permissions = 'ReadWrite' } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, message: t('api-keys:validation_6eedfe63') });
        }

        if (!['Read', 'Write', 'ReadWrite'].includes(permissions)) {
            return res.status(400).json({ success: false, message: t('api-keys:error_86b08df0') });
        }

        // Генерируем уникальный key: bk_<32 байта hex>
        const rawKey = `bk_${crypto.randomBytes(32).toString('hex')}`;
        const keyPrefix = rawKey.substring(0, 11); // "bk_" + 8 символов
        const keyHash = await bcrypt.hash(rawKey, 10);

        const apiKey = await prisma.botApiKey.create({
            data: {
                botId,
                name: name.trim(),
                keyHash,
                keyPrefix,
                permissions,
            },
        });

        // Возвращаем полный key Only ОДИН РАЗ
        res.json({
            success: true,
            key: rawKey, // Полный ключ
            apiKey: {
                id: apiKey.id,
                name: apiKey.name,
                keyPrefix: apiKey.keyPrefix,
                permissions: apiKey.permissions,
                createdAt: apiKey.createdAt,
            },
        });
    } catch (error) {
        console.error(t('api-keys:error_9e3f7884'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_d301814b') });
    }
});

// PUT /api/bots/:botId/api-keys/:keyId - Обновить name or permissions key
router.put('/:keyId', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const keyId = parseInt(req.params.keyId, 10);
        const { name, permissions } = req.body;

        const updateData = {};
        if (name !== undefined && name.trim().length > 0) {
            updateData.name = name.trim();
        }
        if (permissions !== undefined) {
            if (!['Read', 'Write', 'ReadWrite'].includes(permissions)) {
                return res.status(400).json({ success: false, message: t('api-keys:error_86b08df0') });
            }
            updateData.permissions = permissions;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: t('api-keys:msg_dc2abbfe') });
        }

        const apiKey = await prisma.botApiKey.updateMany({
            where: { id: keyId, botId },
            data: updateData,
        });

        if (apiKey.count === 0) {
            return res.status(404).json({ success: false, message: t('api-keys:msg_c82b4016') });
        }

        res.json({ success: true, message: t('api-keys:success_6ee89242') });
    } catch (error) {
        console.error(t('api-keys:error_b6ad1e83'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_8bd24ab6') });
    }
});

// DELETE /api/bots/:botId/api-keys/:keyId - Удалить (отозвать) API key
router.delete('/:keyId', authorize('bot:update'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const keyId = parseInt(req.params.keyId, 10);

        const { getIO } = require('../../real-time/socketHandler');

        const io = getIO();

        io.of("/bot-api")
            .in(`key_${keyId}`)
            .disconnectSockets(true)

        const result = await prisma.botApiKey.deleteMany({
            where: { id: keyId, botId },
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: t('api-keys:msg_c82b4016') });
        }

        res.json({ success: true, message: t('api-keys:success_92e69113') });
    } catch (error) {
        console.error(t('api-keys:error_7d6598e1'), error);
        res.status(500).json({ success: false, message: t('api-keys:error_b38d6d70') });
    }
});

module.exports = router;
