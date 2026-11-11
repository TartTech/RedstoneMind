const { botManager } = require('../../core/services');
const { t } = require('../../i18n');
const { authenticateApiClient, logConnection } = require('./middleware');
const { registerActionHandlers } = require('./handlers');

/**
 * Инициализирует namespace /bot-api for WebSocket API
 * @param {Server} io - Socket.IO server
 */
function initializeBotApiNamespace(io) {
    const apiNamespace = io.of('/bot-api');


    apiNamespace.use(authenticateApiClient);

    apiNamespace.on('connection', async (socket) => {
        console.log(t('core:log_3cb036f7', { socket: socket.botId, socket1: socket.keyPrefix }));

        socket.join(`bot_${socket.botId}`);
        socket.join(`key_${socket.keyId}`);

        const isOnline = botManager.isBotRunning(socket.botId);
        socket.emit('bot:status', { online: isOnline });

        await logConnection(socket, 'connect');

        registerActionHandlers(socket);

        socket.on('disconnect', async () => {
            console.log(t('core:log_539cffa2', { socket: socket.botId, socket1: socket.keyPrefix }));
            await logConnection(socket, 'disconnect');
        });
    });

    return apiNamespace;
}

module.exports = {
    initializeBotApiNamespace,
    ...require('./utils'),
};
