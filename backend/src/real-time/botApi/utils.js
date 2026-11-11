const { t } = require('../../i18n');
/**
 * Sends event всем подключенным API клиентам bot
 * @param {Server} io - Socket.IO server
 * @param {number} botId - ID bot
 * @param {string} eventName - Название events (например, "chat:message")
 * @param {object} data - Data events
 */
function broadcastToApiClients(io, botId, eventName, data) {
    try {
        // Broadcast to bot-api namespace
        const apiNamespace = io.of('/bot-api');
        apiNamespace.to(`bot_${botId}`).emit(eventName, data);

        // Also broadcast to Panel namespace subscribers
        const panelNamespace = io.of('/panel');
        const panelChannel = `bots:${botId}:events`;
        panelNamespace.to(panelChannel).emit(panelChannel, {
            botId,
            eventType: eventName,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(t('core:error_6b9e28f1'), error);
    }
}

/**
 * Sends event изменения статуса bot всем подключенным API клиентам
 * @param {Server} io - Socket.IO server
 * @param {number} botId - ID bot
 * @param {boolean} online - Онлайн ли bot
 */
function broadcastBotStatus(io, botId, online) {
    try {
        const apiNamespace = io.of('/bot-api');
        apiNamespace.to(`bot_${botId}`).emit('bot:status', { online });
        console.log(`[Bot API] Broadcast статуса бота ${botId}: ${online ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
        console.error(t('core:error_de6c4fd0'), error);
    }
}

/**
 * Получить количество подключенных API клиентов for конкретного bot
 * @param {Server} io - Socket.IO server
 * @param {number} botId - ID bot
 * @returns {number} Количество подключенных клиентов
 */
function getConnectedClientsCount(io, botId) {
    try {
        const apiNamespace = io.of('/bot-api');
        const room = apiNamespace.adapter.rooms.get(`bot_${botId}`);
        return room ? room.size : 0;
    } catch (error) {
        console.error(t('core:error_233070a5'), error);
        return 0;
    }
}

module.exports = {
    broadcastToApiClients,
    broadcastBotStatus,
    getConnectedClientsCount,
};
