const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const config = require('../../config');
const { authenticate, authorize } = require('../middleware/auth');
const { authenticatePanelApiKey } = require('../middleware/panelApiAuth');
const path = require('path');
const os = require('os');
const { t } = require('../../i18n');

const router = express.Router();
const prisma = new PrismaClient();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: t('auth:msg_7c776934') },
});

const JWT_SECRET = config.security.jwtSecret;
const JWT_EXPIRES_IN = '7d';

const activeResetTokens = new Map();

const ALL_PERMISSIONS = [
    { id: '*', label: t('auth:perm_e85cdf95') },
    { id: 'bot:list', label: t('auth:perm_14be8f07') },
    { id: 'bot:create', label: t('auth:success_5d58bcba') },
    { id: 'bot:update', label: t('auth:perm_919efd61') },
    { id: 'bot:delete', label: t('auth:success_d4a3b01a') },
    { id: 'bot:start_stop', label: t('auth:msg_1f219ce1') },
    { id: 'bot:interact', label: t('auth:msg_62bad898') },
    { id: 'bot:export', label: t('auth:msg_0efa7d3b') },
    { id: 'bot:import', label: t('auth:msg_ff4d1294') },
    { id: 'bot:history:view', label: t('auth:perm_61e6c674') },
    { id: 'bot:history:manage', label: t('auth:perm_b174eb47') },
    { id: 'management:view', label: t('auth:perm_management_view') },
    { id: 'management:edit', label: t('auth:perm_management_edit') },
    { id: 'plugin:list', label: t('auth:perm_fa468ef1') },
    { id: 'plugin:install', label: t('auth:msg_69518fc5') },
    { id: 'plugin:delete', label: t('auth:success_01edfd9e') },
    { id: 'plugin:update', label: t('auth:success_0f2d1a3c') },
    { id: 'plugin:settings:view', label: t('auth:perm_3975b0e9') },
    { id: 'plugin:settings:edit', label: t('auth:perm_4dea6036') },
    { id: 'plugin:browse', label: t('auth:perm_03c524a3') },
    { id: 'plugin:develop', label: t('auth:perm_665a5197') },
    { id: 'server:list', label: t('auth:perm_9e447f9d') },
    { id: 'server:create', label: t('auth:success_f27c3380') },
    { id: 'server:delete', label: t('auth:success_d00debf8') },
    { id: 'proxy:list', label: t('auth:perm_59344eba') },
    { id: 'proxy:create', label: t('auth:success_e80faeeb') },
    { id: 'proxy:delete', label: t('auth:success_7864f401') },
    { id: 'task:list', label: t('auth:perm_1c4b9d3c') },
    { id: 'task:create', label: t('auth:success_db9621cd') },
    { id: 'task:edit', label: t('auth:perm_f710a0fd') },
    { id: 'task:delete', label: t('auth:success_314a21f4') },
    { id: 'panel:user:list', label: t('auth:perm_51d1acee') },
    { id: 'panel:user:create', label: t('auth:success_220ff8e2') },
    { id: 'panel:user:edit', label: t('auth:perm_609e4a33') },
    { id: 'panel:user:delete', label: t('auth:success_cc802e44') },
    { id: 'panel:role:list', label: t('auth:perm_10dd28b2') },
    { id: 'panel:role:create', label: t('auth:success_c8bb4b2d') },
    { id: 'panel:role:edit', label: t('auth:perm_6ea9c1a8') },
    { id: 'panel:role:delete', label: t('auth:success_26618b71') },
    { id: 'panel:settings:view', label: t('auth:perm_73f8323d') },
    { id: 'panel:settings:edit', label: t('auth:perm_cae2f6b8') },
    { id: 'graph:read', label: t('auth:perm_82319668') },
    { id: 'graph:download', label: t('auth:msg_862f51d0') },
    { id: 'graph:like', label: t('auth:msg_3bd01e06') },
    { id: 'graph:publish', label: t('auth:msg_4cf545e4') },
];

const VIEWER_PERMISSIONS = [
    'bot:list',
    'bot:history:view',
    'plugin:list',
    'plugin:settings:view',
    'management:view',
    'server:list',
    'proxy:list',
    'task:list',
    'graph:read',
];

function getOwnerPermissions() {
    return ALL_PERMISSIONS.map(p => p.id).filter(id => id !== '*');
}

async function getOwnerUserId() {
    const owner = await prisma.panelUser.findFirst({
        orderBy: { id: 'asc' },
        select: { id: true }
    });
    return owner ? owner.id : null;
}

async function ownerOnly(req, res, next) {
    try {
        if (req.user && req.user.userId === await getOwnerUserId()) return next();
        return res.status(403).json({ error: t('auth:msg_70c38050') });
    } catch (error) {
        console.error('[OwnerOnly Error]', error);
        return res.status(500).json({ error: t('auth:error_d9b04519') });
    }
}

/**
 * @route   GET /api/auth/status
 * @desc    Checks, была ли произведена первоначальная setting (создан админ)
 * @access  Public
 */
router.get('/status', async (req, res) => {
    try {
        const userCount = await prisma.panelUser.count();
        res.json({ needsSetup: userCount === 0 });
    } catch (error) {
        console.error('[Auth Status Error]', error);
        res.status(500).json({ error: t('auth:error_748f75f0') });
    }
});

/**
 * @route   GET /api/auth/config-path
 * @desc    Получить path to конфигурационному файлу
 * @access  Public
 */
router.get('/config-path', (req, res) => {
    const configPath = path.join(os.homedir(), '.redstonemind', 'config.json');
    res.json({ configPath });
});

/**
 * @route   POST /api/auth/setup
 * @desc    Creates первого user with ролью администратора
 * @access  Public (only if no других пользователей)
 */
router.post('/setup', authLimiter, async (req, res) => {
    try {
        const userCount = await prisma.panelUser.count();
        if (userCount > 0) {
            return res.status(403).json({ error: t('auth:msg_f3fd9a4f') });
        }

        const { username, password } = req.body;
        if (!username || !password || password.length < 4) {
            return res.status(400).json({ error: t('auth:validation_ae62dc2a') });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        let newUser; 

        await prisma.$transaction(async (tx) => {
            const adminPermissions = getOwnerPermissions();

            const adminRole = await tx.panelRole.upsert({
                where: { name: 'Admin' },
                update: {
                    permissions: JSON.stringify(adminPermissions)
                },
                create: {
                    name: 'Admin',
                    permissions: JSON.stringify(adminPermissions)
                },
            });

            newUser = await tx.panelUser.create({
                data: {
                    username,
                    passwordHash: hashedPassword,
                    roleId: adminRole.id,
                },
                include: { role: true }
            });
        });


        const permissions = JSON.parse(newUser.role.permissions || '[]');
        
        const payload = {
            userId: newUser.id,
            username: newUser.username,
            permissions: permissions,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                permissions: permissions,
            }
        });

    } catch (error) {
        if (error.code === 'P2002') {
             return res.status(409).json({ error: t('auth:msg_7790cb1e') });
        }
        console.error('[Setup Error]', error);
        res.status(500).json({ error: t('auth:error_5fb084ef') });
    }
});

/**
 * @route   POST /api/auth/recovery/verify
 * @desc    Check кода восстановления
 * @access  Public
 */
router.post('/recovery/verify', authLimiter, async (req, res) => {
    try {
        const { recoveryCode } = req.body;
        
        if (!recoveryCode) {
            return res.status(400).json({ error: t('auth:msg_0f706d14') });
        }
        
        if (recoveryCode !== config.security.adminRecoveryCode) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(401).json({ error: t('auth:error_c7142d7c') });
        }
        
        const rootUser = await prisma.panelUser.findFirst({
            orderBy: { id: 'asc' },
            include: { role: true }
        });
        
        if (!rootUser) {
            return res.status(404).json({ error: t('auth:msg_d401586e') });
        }
        
        const tokenId = crypto.randomBytes(16).toString('hex');
        const resetToken = jwt.sign(
            { 
                userId: rootUser.id,
                type: 'password-reset',
                tokenId: tokenId,
                timestamp: Date.now()
            },
            JWT_SECRET,
            { expiresIn: '5m' }
        );
        
        activeResetTokens.set(tokenId, {
            userId: rootUser.id,
            createdAt: Date.now(),
            used: false
        });
        
        setTimeout(() => {
            activeResetTokens.delete(tokenId);
        }, 5 * 60 * 1000);
        
        res.json({ 
            success: true,
            username: rootUser.username,
            resetToken
        });
        
    } catch (error) {
        console.error('[Recovery Verify Error]', error);
        res.status(500).json({ error: t('auth:error_2a8aced1') });
    }
});

/**
 * @route   POST /api/auth/recovery/reset
 * @desc    Сброс password with использованием token
 * @access  Public (with валидным токеном сброса)
 */
router.post('/recovery/reset', authLimiter, async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: t('auth:validation_fe8a3553') });
        }
        
        if (newPassword.length < 4) {
            return res.status(400).json({ error: t('auth:validation_f750868a') });
        }
        
        let decoded;
        try {
            decoded = jwt.verify(resetToken, JWT_SECRET);
            if (decoded.type !== 'password-reset') {
                throw new Error('Invalid token type');
            }
            
            const tokenInfo = activeResetTokens.get(decoded.tokenId);
            if (!tokenInfo) {
                throw new Error('Token not found in active tokens');
            }
            
            if (tokenInfo.used) {
                throw new Error('Token already used');
            }
            
            if (tokenInfo.userId !== decoded.userId) {
                throw new Error('Token userId mismatch');
            }
            
        } catch (err) {
            return res.status(401).json({ error: t('auth:msg_b27693de') });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await prisma.panelUser.update({
            where: { id: decoded.userId },
            data: { passwordHash: hashedPassword },
            select: { username: true }
        });
        
        const tokenInfo = activeResetTokens.get(decoded.tokenId);
        tokenInfo.used = true;
        
        activeResetTokens.delete(decoded.tokenId);
        
        res.json({ 
            message: t('auth:success_0c1d64be'), 
            username: updatedUser.username 
        });
        
    } catch (error) {
        console.error('[Recovery Reset Error]', error);
        res.status(500).json({ error: t('auth:error_e7b05505') });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Аутентифицирует user and returns token
 * @access  Public
 */
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: t('auth:validation_bd4545b5') });
        }

        const user = await prisma.panelUser.findUnique({
            where: { username },
            include: { role: true },
        });

        if (!user) {
            return res.status(401).json({ error: t('auth:error_7a485588') });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: t('auth:error_7a485588') });
        }

        let permissions = JSON.parse(user.role.permissions || '[]');

        if (user.id === await getOwnerUserId()) {
            permissions = getOwnerPermissions();
        }

        const payload = {
            userId: user.id,
            username: user.username,
            permissions: permissions,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                permissions: permissions,
            }
        });

    } catch (error) {
        console.error('[Login Error]', error);
        res.status(500).json({ error: t('auth:error_83942dba') });
    }
});


/**
 * @route   GET /api/auth/validate
 * @desc    Validate Panel API key
 * @access  Public (requires API key)
 */
router.get('/validate', authenticatePanelApiKey, async (req, res) => {
    res.json({
        valid: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.roleName,
            permissions: req.user.permissions
        },
        apiKey: {
            id: req.apiKey.id,
            name: req.apiKey.name,
            prefix: req.apiKey.prefix
        }
    });
});

/**
 * @route   GET /api/auth/me
 * @desc    Получить data current user by токену
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.panelUser.findUnique({
            where: { id: req.user.userId },
            select: { id: true, username: true, role: { select: { permissions: true } } }
        });

        if (!user) {
            return res.status(404).json({ error: t('auth:msg_6133e62a') });
        }

        let permissions = JSON.parse(user.role.permissions || '[]');

        if (user.id === await getOwnerUserId()) {
            permissions = getOwnerPermissions();
        }

        res.json({
            id: user.id,
            username: user.username,
            permissions
        });
    } catch (error) {
        res.status(500).json({ error: t('auth:error_21630e3f') });
    }
});


/**
 * @route   GET /api/auth/users
 * @desc    Получить всех пользователей and их roles
 * @access  Private (Admin only)
 */
router.get('/users', authenticate, authorize('panel:user:list'), async (req, res) => {
    try {
        const users = await prisma.panelUser.findMany({
            include: { role: true, botAccess: { include: { bot: { select: { id: true, username: true } } } } },
            orderBy: { username: 'asc' }
        });
        res.json(users.map(u => ({
            ...u,
            botAccess: u.botAccess.map(a => ({ botId: a.botId, bot: a.bot }))
        })));
    } catch (error) {
        res.status(500).json({ error: t('auth:error_1c09b5e6') });
    }
});

/**
 * @route   POST /api/auth/users
 * @desc    Создать new user
 * @access  Private (Admin only)
 */
router.post('/users', authenticate, ownerOnly, authorize('panel:user:create'), async (req, res) => {
    const { username, password, roleId, allBots = true, botIds = [] } = req.body;
    if (!username || !password || !roleId) {
        return res.status(400).json({ error: t('auth:validation_019279b8') });
    }
     if (password.length < 4) {
        return res.status(400).json({ error: t('auth:validation_f750868a') });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.panelUser.create({
            data: {
                username,
                passwordHash: hashedPassword,
                roleId: parseInt(roleId, 10),
                allBots: !!allBots,
                botAccess: allBots ? undefined : {
                    create: (Array.isArray(botIds) ? botIds : []).map(id => ({ bot: { connect: { id: Number(id) } } }))
                }
            },
            include: { role: true, botAccess: true }
        });
        const { passwordHash, ...userToReturn } = newUser;
        res.status(201).json(userToReturn);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: t('auth:msg_638c28d5') });
        }
        res.status(500).json({ error: t('auth:error_cd350cac') });
    }
});


/**
 * @route   GET /api/auth/roles
 * @desc    Получить all roles
 * @access  Private (Admin only)
 */
router.get('/roles', authenticate, authorize('panel:role:list'), async (req, res) => {
    try {
        const roles = await prisma.panelRole.findMany();
        const rolesWithParsedPermissions = roles.map(role => ({
            ...role,
            permissions: JSON.parse(role.permissions || '[]')
        }));
        res.json(rolesWithParsedPermissions);
    } catch (error) {
        res.status(500).json({ error: t('auth:error_7f88f708') });
    }
});


/**
 * @route   GET /api/auth/permissions
 * @desc    Получить list всех возможных прав in системе
 * @access  Private
 */
router.get('/permissions', authenticate, (req, res) => {
    res.json(ALL_PERMISSIONS);
});


/**
 * @route   PUT /api/auth/users/:id
 * @desc    Обновить user (role, password)
 * @access  Private (Admin only)
 */
router.put('/users/:id', authenticate, ownerOnly, authorize('panel:user:edit'), async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { password, roleId, allBots, botIds } = req.body;

    try {
        const owner = await prisma.panelUser.findFirst({ orderBy: { id: 'asc' } });
        const isOwner = owner && owner.id === userId;

        const updateData = {};
        if (password) {
            if (password.length < 4) return res.status(400).json({ error: t('auth:validation_f750868a') });
            updateData.passwordHash = await bcrypt.hash(password, 12);
        }
        if (roleId) {
            updateData.roleId = parseInt(roleId, 10);
        }
        if (!isOwner && typeof allBots === 'boolean') {
            updateData.allBots = allBots;
        }

        const updatedUser = await prisma.panelUser.update({
            where: { id: userId },
            data: updateData,
            include: { role: true }
        });

        if (Array.isArray(botIds)) {
            await prisma.panelUserBotAccess.deleteMany({ where: { userId } });
            if (!isOwner && !updatedUser.allBots && botIds.length > 0) {
                await prisma.panelUserBotAccess.createMany({
                    data: botIds.map(id => ({ userId, botId: Number(id) }))
                });
            }
        }

        const { passwordHash, ...userToReturn } = updatedUser;
        res.json(userToReturn);

    } catch (error) {
        res.status(500).json({ error: t('auth:error_48cd62cc') });
    }
});

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Удалить user
 * @access  Private (Admin only)
 */
router.delete('/users/:id', authenticate, ownerOnly, authorize('panel:user:delete'), async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    
    if (req.user.userId === userId) {
        return res.status(403).json({ error: t('auth:msg_0eb2c73b') });
    }

    try {
        const owner = await prisma.panelUser.findFirst({ orderBy: { id: 'asc' } });
        if (owner && owner.id === userId) {
            return res.status(403).json({ error: t('auth:msg_cde95b82') });
        }
        await prisma.panelUser.delete({ where: { id: userId } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: t('auth:msg_a7518766') });
        }
        res.status(500).json({ error: t('auth:error_1ee822fd') });
    }
});

/**
 * @route   POST /api/auth/roles
 * @desc    Создать новую role
 * @access  Private (Admin only)
 */
router.post('/roles', authenticate, ownerOnly, authorize('panel:role:create'), async (req, res) => {
    const { name, permissions } = req.body;
    if (!name || !Array.isArray(permissions)) {
        return res.status(400).json({ error: t('auth:validation_84e7790a') });
    }
    try {
        const newRole = await prisma.panelRole.create({
            data: {
                name,
                permissions: JSON.stringify(permissions)
            }
        });
        res.status(201).json({
            ...newRole,
            permissions: JSON.parse(newRole.permissions)
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: t('auth:msg_466e7d2a') });
        }
        res.status(500).json({ error: t('auth:error_fa52aa69') });
    }
});

/**
 * @route   PUT /api/auth/roles/:id
 * @desc    Обновить role (name and permissions)
 * @access  Private (Admin only)
 */
router.put('/roles/:id', authenticate, ownerOnly, authorize('panel:role:edit'), async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    const { name, permissions } = req.body;
    if (!name || !Array.isArray(permissions)) {
        return res.status(400).json({ error: t('auth:validation_84e7790a') });
    }
    try {
        const role = await prisma.panelRole.findUnique({ where: { id: roleId } });
        if (role && role.name === 'Admin') {
            return res.status(403).json({ error: 'Редактирование роли "Admin" запрещено.' });
        }

        const updatedRole = await prisma.panelRole.update({
            where: { id: roleId },
            data: {
                name,
                permissions: JSON.stringify(permissions)
            }
        });
        res.json({
            ...updatedRole,
            permissions: JSON.parse(updatedRole.permissions)
        });
    } catch (error) {
         if (error.code === 'P2002') {
            return res.status(409).json({ error: t('auth:msg_466e7d2a') });
        }
        res.status(500).json({ error: t('auth:error_44a74c39') });
    }
});

/**
 * @route   DELETE /api/auth/roles/:id
 * @desc    Удалить role
 * @access  Private (Admin only)
 */
router.delete('/roles/:id', authenticate, ownerOnly, authorize('panel:role:delete'), async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    try {
        const role = await prisma.panelRole.findUnique({ where: { id: roleId }, include: { users: true } });
        if (!role) return res.status(404).json({ error: t('auth:msg_dbb96d79') });
        if (role.name === 'Admin') {
            return res.status(403).json({ error: 'Удаление роли "Admin" запрещено.' });
        }
        if (role.users.length > 0) {
            return res.status(400).json({ error: t('auth:msg_8c82e6f4') });
        }
        await prisma.panelRole.delete({ where: { id: roleId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: t('auth:error_79b26cf5') });
    }
});

module.exports = {
    router,
    ALL_PERMISSIONS,
    VIEWER_PERMISSIONS,
};