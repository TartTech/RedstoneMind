const mineflayer = require('mineflayer');
const { createProxySocket } = require('./createProxySocket');
const { Vec3 } = require('vec3');
const EventEmitter = require('events');
const MessageQueue = require('./MessageQueue');
const { t } = require('../i18n');

let connectionTimeout = null;
let botReadySent = false;

function buildBotOptions(config) {
    const options = {
        host: config.server.host,
        port: config.server.port,
        username: config.username,
        password: config.password,
        version: config.server.version,
        auth: 'offline',
        hideErrors: false,
        chat: 'enabled',
    };

    if (config.proxyHost && config.proxyPort) {
        const cleanProxyUsername = config.proxyUsername ? config.proxyUsername.trim() : null;
        const cleanProxyPassword = config.proxyPassword || null;

        const proxyType = config.proxyType || config.proxy?.type || 'socks5';
        options.connect = (client) => {
            createProxySocket({
                type: proxyType,
                proxyHost: config.proxyHost,
                proxyPort: config.proxyPort,
                proxyUsername: cleanProxyUsername,
                proxyPassword: cleanProxyPassword,
                destinationHost: config.server.host,
                destinationPort: config.server.port,
            }).then((socket) => {
                client.setSocket(socket);
                client.emit('connect');
            }).catch((err) => {
                client.emit('error', err);
                process.exit(1);
            });
        };
    }

    return options;
}

function createBotConnection(config, sendLog) {
    return new Promise((resolve, reject) => {
        const botOptions = buildBotOptions(config);

        if (config.proxyHost && config.proxyPort) {
            sendLog(t('core:log_49b1137f', { config: config.proxyHost, config1: config.proxyPort }));
        } else {
            sendLog(t('core:log_cafb5871'));
        }

        const bot = mineflayer.createBot(botOptions);

        connectionTimeout = setTimeout(() => {
            if (bot && !bot.player) {
                sendLog(t('core:log_e60171b5'));
                process.exit(1);
            }
        }, 30000);

        bot.on('login', () => {
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            sendLog(t('core:success_4a36adbb'));
            if (process.send && !botReadySent) {
                process.send({ type: 'bot_ready' });
                process.send({ type: 'status', status: 'running' });
                botReadySent = true;
            }
        });

        bot.on('error', (err) => {
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            sendLog(t('core:error_9b227cf6', { err: err.stack || err.message }));
            reject(err);
        });

        bot.on('end', (reason) => {
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            const restartableReasons = ['socketClosed', 'keepAliveError'];
            const exitCode = restartableReasons.includes(reason) ? 1 : 0;
            sendLog(t('core:log_daea6970', { reason: reason }));
            process.exit(exitCode);
        });

        resolve(bot);
    });
}

function clearConnectionTimeout() {
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
}

function resetBotReadySent() {
    botReadySent = false;
}

module.exports = {
    createBotConnection,
    buildBotOptions,
    clearConnectionTimeout,
    resetBotReadySent
};
