const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');
const { t } = require('../../i18n');

/**
 * Middleware for authentication API клиентов
 */
async function authenticateApiClient(socket, next) {
    try {
        const apiKey = socket.handshake.auth.token;
        const botId = parseInt(socket.handshake.query.botId, 10);

        if (!apiKey || !botId) {
            console.error(t('core:log_5597d324'));
            return next(new Error('Authentication error: Missing token or botId'));
        }

        if (!apiKey.startsWith('bk_')) {
            console.error(t('core:error_972ed3f7'));
            return next(new Error('Authentication error: Invalid token format'));
        }

        const keys = await prisma.botApiKey.findMany({
            where: { botId },
        });

        let matchedKey = null;
        for (const key of keys) {
            const isMatch = await bcrypt.compare(apiKey, key.keyHash);
            if (isMatch) {
                matchedKey = key;
                break;
            }
        }

        if (!matchedKey) {
            console.error(t('core:error_c71261df'), botId);
            return next(new Error('Authentication failed: Invalid token'));
        }

        socket.botId = botId;
        socket.keyId = matchedKey.id;
        socket.keyPrefix = matchedKey.keyPrefix;
        socket.permissions = matchedKey.permissions;

        await prisma.botApiKey.update({
            where: { id: matchedKey.id },
            data: { lastUsedAt: new Date() },
        });

        return next();
    } catch (error) {
        console.error(t('core:error_de79b4c2'), error);
        return next(new Error('Authentication error'));
    }
}

/**
 * Логирует connection/отключение клиента
 */
async function logConnection(socket, action) {
    try {
        await prisma.apiConnectionLog.create({
            data: {
                botId: socket.botId,
                keyPrefix: socket.keyPrefix,
                ipAddress: socket.handshake.address,
                userAgent: socket.handshake.headers['user-agent'] || null,
                action,
            },
        });
    } catch (error) {
        console.error(t('core:error_23df3c64', { action: action }), error);
    }
}

module.exports = {
    authenticateApiClient,
    logConnection,
};
