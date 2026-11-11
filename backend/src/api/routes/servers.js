const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const { t } = require('../../i18n');
const prisma = new PrismaClient();

router.use(authenticateUniversal);

router.get('/', authorize('server:list'), async (req, res) => {
    try {
        const servers = await prisma.server.findMany({ orderBy: { name: 'asc' } });
        res.json({
            items: servers,
            total: servers.length
        });
    } catch (error) {
        console.error(t('servers:error_cb732a5d'), error);
        res.status(500).json({ error: t('bots:error_f4f43448') });
    }
});

router.get('/:id', authorize('server:list'), async (req, res) => {
    try {
        const serverId = parseInt(req.params.id, 10);
        const server = await prisma.server.findUnique({ where: { id: serverId } });
        if (!server) {
            return res.status(404).json({ error: t('servers:msg_269b9f3c') });
        }
        res.json(server);
    } catch (error) {
        console.error(t('servers:error_f20c2bda'), error);
        res.status(500).json({ error: t('servers:error_253e1dbc') });
    }
});

router.post('/', authorize('server:create'), async (req, res) => {
    try {
        const { name, host, port, version } = req.body;
        if (!name || !host || !version) {
            return res.status(400).json({ error: t('servers:validation_49972ec1') });
        }

        const portNumber = port ? parseInt(port, 10) : 25565;
        if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
            return res.status(400).json({ error: t('servers:validation_24910023') });
        }

        const newServer = await prisma.server.create({
            data: { name, host, port: portNumber, version },
        });
        res.status(201).json(newServer);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('servers:msg_0a311f6d') });
        res.status(500).json({ error: t('servers:error_109c8f3e') });
    }
});

router.put('/:id', authorize('server:create'), async (req, res) => {
    try {
        const serverId = parseInt(req.params.id, 10);
        if (isNaN(serverId)) return res.status(400).json({ error: t('servers:error_aa2edc07') });

        const { name, host, port, version } = req.body;
        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (host !== undefined) dataToUpdate.host = host;
        if (port !== undefined && port !== '') {
            const portNumber = parseInt(port, 10);
            if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
                return res.status(400).json({ error: t('servers:validation_24910023') });
            }
            dataToUpdate.port = portNumber;
        }
        if (version !== undefined) dataToUpdate.version = version;

        Object.keys(dataToUpdate).forEach(k => { if (dataToUpdate[k] === undefined) delete dataToUpdate[k]; });

        if (dataToUpdate.name) {
            const existing = await prisma.server.findFirst({ where: { name: dataToUpdate.name, id: { not: serverId } } });
            if (existing) return res.status(409).json({ error: t('servers:msg_0a311f6d') });
        }

        const updated = await prisma.server.update({ where: { id: serverId }, data: dataToUpdate });
        res.json(updated);
    } catch (error) {
        console.error(t('servers:error_8cd5e92a'), error);
        res.status(500).json({ error: t('servers:error_12079c6b') });
    }
});

router.delete('/:id', authorize('server:delete'), async (req, res) => {
    try {
        const serverId = parseInt(req.params.id, 10);
        
        const botsOnServer = await prisma.bot.count({ where: { serverId } });
        if (botsOnServer > 0) {
            return res.status(400).json({ error: t('servers:msg_53f17922', { botsOnServer: botsOnServer }) });
        }

        await prisma.server.delete({ where: { id: serverId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: t('servers:error_28ae49fc') });
    }
});

module.exports = router;