const jwt = require('jsonwebtoken');
const config = require('../../config');
const { authenticatePanelApiKey } = require('./panelApiAuth');
const { t } = require('../../i18n');

const JWT_SECRET = config.security.jwtSecret;

const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

/**
 * Универсальный middleware authentication
 * Поддерживает Panel API Keys и JWT токены
 */
function authenticateUniversal(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: t('api:error_c68ab9b3') });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: t('api:error_f53d8c83') });
    }

    const token = tokenParts[1];

    // If token начинается with pk_ - это Panel API Key
    if (token.startsWith('pk_')) {
        return authenticatePanelApiKey(req, res, next);
    }

    // Else это JWT token
    return authenticate(req, res, next);
}

function authenticate(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: t('api:error_c68ab9b3') });
    }
    
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: t('api:error_f53d8c83') });
    }

    const token = tokenParts[1];

    if (tokenCache.has(token)) {
        const cached = tokenCache.get(token);
        if (Date.now() < cached.expires) {
            req.user = cached.payload;
            return next();
        } else {
            tokenCache.delete(token);
        }
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = decoded;
        
        if (tokenCache.size >= MAX_CACHE_SIZE) {
            const oldest = tokenCache.keys().next().value;
            tokenCache.delete(oldest);
        }
        tokenCache.set(token, {
            payload: decoded,
            expires: Date.now() + CACHE_TTL
        });

        next();
    } catch (err) {
        res.status(401).json({ error: t('api:msg_190056bb') });
    }
}


function authorize(requiredPermission) {
    return (req, res, next) => {
        if (!req.user || !Array.isArray(req.user.permissions)) {
            return res.status(403).json({ error: t('api:error_aaebe464') });
        }

        const userPermissions = req.user.permissions;
        if (userPermissions.includes('*') || userPermissions.includes(requiredPermission)) {
            next();
        } else {
            res.status(403).json({ error: t('api:error_85460e90') });
        }
    };
}

module.exports = {
    authenticate,
    authenticateUniversal,
    authorize,
};