const express = require('express');
const prisma = require('../../lib/prisma');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const { checkBotAccess } = require('../middleware/botAccess');
const { t } = require('../../i18n');

const router = express.Router();

router.use('/:botId/permissions', authenticateUniversal, checkBotAccess);

router.get('/:botId/permissions', authenticateUniversal, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);

        const permissions = await prisma.permission.findMany({
            where: { botId },
            orderBy: { name: 'asc' }
        });

        res.json({
            items: permissions,
            total: permissions.length
        });
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/permissions:', error);
        res.status(500).json({ error: t('bots:error_e0a810da') });
    }
});

router.get('/:botId/permissions/:permissionId', authenticateUniversal, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const permissionId = parseInt(req.params.permissionId, 10);

        const permission = await prisma.permission.findFirst({
            where: { id: permissionId, botId }
        });

        if (!permission) {
            return res.status(404).json({ error: t('bots:msg_0657020d') });
        }

        res.json(permission);
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/permissions/:permissionId:', error);
        res.status(500).json({ error: t('bots:error_1d1ff5cd') });
    }
});

router.put('/:botId/permissions/:permissionId', authenticateUniversal, authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const permissionId = parseInt(req.params.permissionId, 10);
        const { name, description } = req.body;

        const permission = await prisma.permission.findFirst({
            where: { id: permissionId, botId }
        });

        if (!permission) {
            return res.status(404).json({ error: t('bots:msg_0657020d') });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const updated = await prisma.permission.update({
            where: { id: permissionId },
            data: updateData
        });

        res.json(updated);
    } catch (error) {
        console.error('[API Error] PUT /bots/:botId/permissions/:permissionId:', error);
        res.status(500).json({ error: t('bots:error_cfb1b1ae') });
    }
});

router.delete('/:botId/permissions/:permissionId', authenticateUniversal, authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const permissionId = parseInt(req.params.permissionId, 10);

        const permission = await prisma.permission.findFirst({
            where: { id: permissionId, botId }
        });

        if (!permission) {
            return res.status(404).json({ error: t('bots:msg_0657020d') });
        }

        await prisma.groupPermission.deleteMany({ where: { permissionId } });
        await prisma.permission.delete({ where: { id: permissionId } });

        const { botManager } = require('../../core/services');
        botManager.invalidateAllUserCache(botId);

        res.json({ success: true });
    } catch (error) {
        console.error('[API Error] DELETE /bots/:botId/permissions/:permissionId:', error);
        res.status(500).json({ error: t('bots:error_9286b9e6') });
    }
});

module.exports = router;
