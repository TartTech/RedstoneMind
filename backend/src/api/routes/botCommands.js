const express = require('express');
const prisma = require('../../lib/prisma');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const { checkBotAccess } = require('../middleware/botAccess');
const { t } = require('../../i18n');

const router = express.Router();

router.use('/:botId/commands', authenticateUniversal, checkBotAccess);

router.get('/:botId/commands', authenticateUniversal, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const { page = 1, pageSize = 100, search } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const take = parseInt(pageSize);

        const where = { botId };
        if (search) {
            where.name = { contains: search };
        }

        const [commands, total] = await Promise.all([
            prisma.command.findMany({
                where,
                include: {
                    permission: true,
                    pluginOwner: { select: { id: true, name: true, version: true } }
                },
                orderBy: { name: 'asc' },
                skip,
                take
            }),
            prisma.command.count({ where })
        ]);

        res.json({
            items: commands,
            total,
            page: parseInt(page),
            pageSize: take
        });
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/commands:', error);
        res.status(500).json({ error: t('bots:error_48089e41') });
    }
});

router.get('/:botId/commands/:commandId', authenticateUniversal, authorize('management:view'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const commandId = parseInt(req.params.commandId, 10);

        const command = await prisma.command.findFirst({
            where: { id: commandId, botId },
            include: {
                permission: true,
                pluginOwner: { select: { id: true, name: true, version: true } }
            }
        });

        if (!command) {
            return res.status(404).json({ error: t('bots:msg_9bf659d2') });
        }

        res.json(command);
    } catch (error) {
        console.error('[API Error] GET /bots/:botId/commands/:commandId:', error);
        res.status(500).json({ error: t('bots:error_c38213ba') });
    }
});

router.patch('/:botId/commands/:commandId', authenticateUniversal, authorize('management:edit'), async (req, res) => {
    try {
        const botId = parseInt(req.params.botId, 10);
        const commandId = parseInt(req.params.commandId, 10);
        const { isEnabled, cooldown, aliases, permissionId, allowedChatTypes } = req.body;

        const command = await prisma.command.findFirst({
            where: { id: commandId, botId }
        });

        if (!command) {
            return res.status(404).json({ error: t('bots:msg_9bf659d2') });
        }

        const updateData = {};
        if (typeof isEnabled === 'boolean') updateData.isEnabled = isEnabled;
        if (typeof cooldown === 'number') updateData.cooldown = cooldown;
        if (aliases !== undefined) updateData.aliases = JSON.stringify(aliases);
        if (permissionId !== undefined) updateData.permissionId = permissionId;
        if (allowedChatTypes !== undefined) updateData.allowedChatTypes = JSON.stringify(allowedChatTypes);

        const updated = await prisma.command.update({
            where: { id: commandId },
            data: updateData,
            include: {
                permission: true,
                pluginOwner: { select: { id: true, name: true, version: true } }
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('[API Error] PATCH /bots/:botId/commands/:commandId:', error);
        res.status(500).json({ error: t('bots:error_c008602c') });
    }
});

module.exports = router;
