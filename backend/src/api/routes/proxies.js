const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const { encrypt } = require('../../core/utils/crypto');
const { t } = require('../../i18n');
const prisma = new PrismaClient();

router.use(authenticateUniversal);

function sanitizeProxy(proxy) {
    if (!proxy) return proxy;
    const { password, ...rest } = proxy;
    return { ...rest, hasPassword: !!password };
}

function isValidPort(port) {
    const n = parseInt(port, 10);
    return Number.isInteger(n) && n >= 1 && n <= 65535;
}

router.get('/', authorize('proxy:list'), async (req, res) => {
    try {
        const proxies = await prisma.proxy.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { bots: true }
                }
            }
        });
        res.json({
            items: proxies.map(sanitizeProxy),
            total: proxies.length
        });
    } catch (error) {
        console.error(t('proxies:error_ba69cc29'), error);
        res.status(500).json({ error: t('proxies:error_3273cdac') });
    }
});

router.get('/:id', authorize('proxy:list'), async (req, res) => {
    try {
        const proxyId = parseInt(req.params.id, 10);
        const proxy = await prisma.proxy.findUnique({
            where: { id: proxyId },
            include: {
                _count: {
                    select: { bots: true }
                }
            }
        });
        if (!proxy) {
            return res.status(404).json({ error: t('proxies:msg_7a8bb01b') });
        }
        res.json(sanitizeProxy(proxy));
    } catch (error) {
        console.error(t('proxies:error_0f3d4452'), error);
        res.status(500).json({ error: t('proxies:error_0de38e09') });
    }
});

router.post('/', authorize('proxy:create'), async (req, res) => {
    try {
        const { name, type, host, port, username, password, note } = req.body;
        if (!name || !host || !port) {
            return res.status(400).json({ error: t('proxies:validation_d9eabe1e') });
        }
        if (!isValidPort(port)) {
            return res.status(400).json({ error: t('proxies:validation_67710bc0') });
        }
        if (type && !['socks5', 'http'].includes(type)) {
            return res.status(400).json({ error: t('proxies:validation_f2be6209') });
        }
        const newProxy = await prisma.proxy.create({
            data: {
                name,
                type: type || 'socks5',
                host,
                port: parseInt(port, 10),
                username: username || null,
                password: password ? encrypt(password) : null,
                note: note || null
            },
        });
        res.status(201).json(sanitizeProxy(newProxy));
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: t('proxies:msg_e713e25d') });
        console.error(t('proxies:error_8181f4d9'), error);
        res.status(500).json({ error: t('proxies:error_85f24da5') });
    }
});

router.put('/:id', authorize('proxy:create'), async (req, res) => {
    try {
        const proxyId = parseInt(req.params.id, 10);
        if (isNaN(proxyId)) return res.status(400).json({ error: t('proxies:error_f89d55f7') });

        const { name, type, host, port, username, password, note } = req.body;

        if (type && !['socks5', 'http'].includes(type)) {
            return res.status(400).json({ error: t('proxies:validation_f2be6209') });
        }

        if (port !== undefined && port !== '' && !isValidPort(port)) {
            return res.status(400).json({ error: t('proxies:validation_67710bc0') });
        }

        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (type !== undefined) dataToUpdate.type = type;
        if (host !== undefined) dataToUpdate.host = host;
        if (port !== undefined && port !== '') dataToUpdate.port = parseInt(port, 10);
        if (username !== undefined) dataToUpdate.username = username || null;
        if (password !== undefined && password !== '') dataToUpdate.password = encrypt(password);
        if (note !== undefined) dataToUpdate.note = note || null;

        Object.keys(dataToUpdate).forEach(k => { if (dataToUpdate[k] === undefined) delete dataToUpdate[k]; });

        if (dataToUpdate.name) {
            const existing = await prisma.proxy.findFirst({ where: { name: dataToUpdate.name, id: { not: proxyId } } });
            if (existing) return res.status(409).json({ error: t('proxies:msg_e713e25d') });
        }

        const updated = await prisma.proxy.update({ where: { id: proxyId }, data: dataToUpdate });
        res.json(sanitizeProxy(updated));
    } catch (error) {
        console.error(t('proxies:error_d2c2b498'), error);
        res.status(500).json({ error: t('proxies:error_1bbf8144') });
    }
});

router.delete('/:id', authorize('proxy:delete'), async (req, res) => {
    try {
        const proxyId = parseInt(req.params.id, 10);

        const botsUsingProxy = await prisma.bot.count({ where: { proxyId } });
        if (botsUsingProxy > 0) {
            return res.status(400).json({ error: t('proxies:msg_6f634bc7', { botsUsingProxy: botsUsingProxy }) });
        }

        await prisma.proxy.delete({ where: { id: proxyId } });
        res.status(204).send();
    } catch (error) {
        console.error(t('proxies:error_88b2b88f'), error);
        res.status(500).json({ error: t('proxies:error_99b32394') });
    }
});

module.exports = router;
