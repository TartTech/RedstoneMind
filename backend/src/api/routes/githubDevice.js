const express = require('express');
const { Octokit } = require('@octokit/rest');
const { authenticate } = require('../middleware/auth');
const { t } = require('../../i18n');

const router = express.Router();
const LINK_URL = (process.env.GITHUB_LINK_URL || 'http://212.22.78.42:3010').replace(/\/$/, '');

router.post('/whoami', authenticate, async (req, res) => {
    const token = req.body?.token;
    if (!token) return res.status(400).json({ error: t('api:msg_fe71da7e') });
    try {
        const octokit = new Octokit({ auth: token });
        const { data } = await octokit.users.getAuthenticated();
        res.json({ login: data.login });
    } catch {
        res.status(401).json({ error: t('api:msg_adeefe28') });
    }
});

router.post('/connect/start', authenticate, async (req, res) => {
    try {
        const response = await fetch(`${LINK_URL}/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ returnUrl: req.body?.returnUrl }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            return res.status(502).json({ error: t('api:error_d2b9f6c9') });
        }
        res.json({
            sessionId: payload.sessionId,
            authorizeUrl: payload.authorizeUrl,
            interval: payload.interval || 5,
        });
    } catch {
        res.status(502).json({ error: t('api:error_d2b9f6c9') });
    }
});

router.get('/connect/:sessionId', authenticate, async (req, res) => {
    try {
        const response = await fetch(`${LINK_URL}/session/${encodeURIComponent(req.params.sessionId)}`);
        const payload = await response.json().catch(() => ({ status: 'expired' }));
        if (response.status === 404) return res.json({ status: 'expired' });
        if (!response.ok) return res.status(502).json({ error: t('api:error_6e396e88') });
        res.json(payload);
    } catch {
        res.status(502).json({ error: t('api:error_6e396e88') });
    }
});

module.exports = router;
