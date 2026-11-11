const { botManager } = require('../../../core/services');
const { t } = require('../../../i18n');

/**
 * action:send_message - Отправить message от name bot
 */
function handleSendMessage(socket, payload) {
    // Проверяем permissions
    if (socket.permissions === 'Read') {
        return socket.emit('error', {
            action: 'send_message',
            message: 'Insufficient permissions: Read-only key',
        });
    }

    try {
        const { chatType = 'chat', message, recipient } = payload;

        if (!message) {
            return socket.emit('error', {
                action: 'send_message',
                message: 'Message is required',
            });
        }

        // For private chat нужен recipient
        if (chatType === 'private' && !recipient) {
            return socket.emit('error', {
                action: 'send_message',
                message: 'Recipient is required for private messages',
            });
        }

        // Проверяем, что bot онлайн
        if (!botManager.isBotRunning(socket.botId)) {
            return socket.emit('error', {
                action: 'send_message',
                message: 'Bot is offline',
            });
        }

        // Отправляем message боту
        const result = botManager.sendMessageToBot(socket.botId, message, chatType, recipient);

        if (!result.success) {
            return socket.emit('error', {
                action: 'send_message',
                message: result.message || 'Failed to send message',
            });
        }

        socket.emit('action:result', {
            action: 'send_message',
            success: true,
        });
    } catch (error) {
        console.error(t('core:error_e68866e3'), error);
        socket.emit('error', {
            action: 'send_message',
            message: 'Internal error',
        });
    }
}

module.exports = {
    handleSendMessage,
};
