const { botManager } = require('../../../core/services');

/**
 * action:get_status - Получить current status bot
 */
function handleGetStatus(socket) {
    const isOnline = botManager.isBotRunning(socket.botId);
    socket.emit('action:result', {
        action: 'get_status',
        success: true,
        online: isOnline,
    });
}

module.exports = {
    handleGetStatus,
};
