const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const PluginService = require('../../core/PluginService');
const { t } = require('../../i18n');

const prisma = new PrismaClient();

router.use(authenticate);
router.use(authorize('panel:settings:edit'));

router.get('/plugin-directories', async (req, res) => {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: 'plugin_directories' },
        });
        res.json(setting?.value || []);
    } catch (error) {
        res.status(500).json({ error: t('api:error_75f442d0') });
    }
});

router.post('/plugin-directories', async (req, res) => {
    try {
        const { directories } = req.body;
        if (!Array.isArray(directories)) {
            return res.status(400).json({ error: t('api:msg_c47816b2') });
        }

        const updatedSetting = await prisma.setting.upsert({
            where: { key: 'plugin_directories' },
            update: { value: directories },
            create: { key: 'plugin_directories', value: directories },
        });
        
        await PluginService.syncPluginsWithDb();

        res.json(updatedSetting);
    } catch (error) {
        res.status(500).json({ error: t('api:error_b81ba731') });
    }
});

module.exports = router;