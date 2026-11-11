const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../../lib/prisma');
const { authenticate, authenticateUniversal } = require('../middleware/auth');
const { t } = require('../../i18n');

/**
 * Generation случайного API key
 */
function generateApiKey() {
    return 'pk_' + crypto.randomBytes(32).toString('hex');
}

/**
 * Checks, что запрошенные scope являются подмножеством прав создателя key.
 * User not can выпустить key with permissions, которых у него самого no.
 */
function validateCustomScopes(requested, ownerPermissions) {
    if (requested === undefined || requested === null) return { ok: true, value: null };
    if (!Array.isArray(requested)) return { ok: false, error: t('panel:validation_31b9497e') };
    const owner = Array.isArray(ownerPermissions) ? ownerPermissions : [];
    if (owner.includes('*')) return { ok: true, value: requested };
    const invalid = requested.filter((s) => typeof s !== 'string' || s === '*' || !owner.includes(s));
    if (invalid.length > 0) {
        return { ok: false, error: `Недостаточно прав для запрошенных scope: ${invalid.join(', ')}` };
    }
    return { ok: true, value: requested };
}

/**
 * GET /api/panel/api-keys
 * Получить list API ключей user
 */
router.get('/', authenticateUniversal, async (req, res) => {
    try {
        const keys = await prisma.panelApiKey.findMany({
            where: {
                userId: req.user.userId
            },
            select: {
                id: true,
                name: true,
                prefix: true,
                customScopes: true,
                lastUsedAt: true,
                expiresAt: true,
                isActive: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            keys: keys.map(key => ({
                ...key,
                customScopes: key.customScopes ? JSON.parse(key.customScopes) : null
            }))
        });
    } catch (error) {
        console.error(t('panel:error_8c41637f'), error);
        res.status(500).json({ error: t('panel:error_536ca6fc') });
    }
});

/**
 * POST /api/panel/api-keys
 * Создать new API key
 */
router.post('/', authenticateUniversal, async (req, res) => {
    try {
        const { name, customScopes, expiresAt } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: t('panel:validation_071159a9') });
        }

        const scopeCheck = validateCustomScopes(customScopes, req.user.permissions);
        if (!scopeCheck.ok) {
            return res.status(403).json({ error: scopeCheck.error });
        }

        const apiKey = generateApiKey();
        const keyHash = await bcrypt.hash(apiKey, 10);
        const prefix = apiKey.substring(0, 10);

        const newKey = await prisma.panelApiKey.create({
            data: {
                userId: req.user.userId,
                name: name.trim(),
                keyHash,
                prefix,
                customScopes: scopeCheck.value ? JSON.stringify(scopeCheck.value) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });

        res.json({
            success: true,
            message: t('panel:success_5140f095'),
            key: {
                id: newKey.id,
                name: newKey.name,
                prefix: newKey.prefix,
                customScopes: newKey.customScopes ? JSON.parse(newKey.customScopes) : null,
                expiresAt: newKey.expiresAt,
                createdAt: newKey.createdAt,
                apiKey
            }
        });
    } catch (error) {
        console.error(t('panel:error_d7fce7ef'), error);
        res.status(500).json({ error: t('panel:error_6085626b') });
    }
});

/**
 * PATCH /api/panel/api-keys/:id
 * Обновить API key (название, status, срок действия)
 */
router.patch('/:id', authenticateUniversal, async (req, res) => {
    try {
        const keyId = parseInt(req.params.id);
        const { name, isActive, expiresAt } = req.body;

        const existingKey = await prisma.panelApiKey.findFirst({
            where: {
                id: keyId,
                userId: req.user.userId
            }
        });

        if (!existingKey) {
            return res.status(404).json({ error: t('panel:msg_c4e0ad23') });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

        const updatedKey = await prisma.panelApiKey.update({
            where: { id: keyId },
            data: updateData
        });

        res.json({
            success: true,
            message: t('panel:success_63c30d95'),
            key: {
                id: updatedKey.id,
                name: updatedKey.name,
                prefix: updatedKey.prefix,
                isActive: updatedKey.isActive,
                expiresAt: updatedKey.expiresAt
            }
        });
    } catch (error) {
        console.error(t('panel:error_628f3993'), error);
        res.status(500).json({ error: t('panel:error_e095471a') });
    }
});

/**
 * DELETE /api/panel/api-keys/:id
 * Удалить (отозвать) API key
 */
router.delete('/:id', authenticateUniversal, async (req, res) => {
    try {
        const keyId = parseInt(req.params.id);

        const existingKey = await prisma.panelApiKey.findFirst({
            where: {
                id: keyId,
                userId: req.user.userId
            }
        });

        if (!existingKey) {
            return res.status(404).json({ error: t('panel:msg_c4e0ad23') });
        }

        await prisma.panelApiKey.delete({
            where: { id: keyId }
        });

        res.json({
            success: true,
            message: t('panel:success_30c88110')
        });
    } catch (error) {
        console.error(t('panel:error_f79a4ae7'), error);
        res.status(500).json({ error: t('panel:error_472ddcaf') });
    }
});

module.exports = router;
