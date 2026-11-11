const Transport = require('./Transport');
const UserService = require('../UserService');

/**
 * CommandContext - context execution commands
 * Предоставляет единый интерфейс for команд независимо от источника (Minecraft, WebSocket, Telegram)
 */
class CommandContext {
    /**
     * @param {object} bot - Instance bot
     * @param {object} user - User object with методами
     * @param {object} args - Аргументы commands
     * @param {Transport} transport - Transport object
     */
    constructor(bot, user, args, transport) {
        this.bot = bot;
        this.user = user;
        this.args = args;
        this.transport = transport;

        // For обратной совместимости
        this.typeChat = transport.type;
        
        // Добавляем информацию о position bot
        this.botEntity = bot.entity ? {
            position: bot.entity.position,
            yaw: bot.entity.yaw,
            pitch: bot.entity.pitch
        } : null;
    }

    /**
     * Отправить response пользователю
     * @param {string} message - Текст messages
     * @returns {string|void} - For websocket returns message, for остальных void
     */
    reply(message) {
        return this.transport.send(message, this.user.username);
    }

    /**
     * Отправить message in определенный chat
     * @param {string} chatType - Type chat ('chat', 'clan', 'private', etc)
     * @param {string} message - Текст messages
     * @param {string} recipient - Получатель (for private)
     */
    sendTo(chatType, message, recipient = null) {
        if (this.bot.api) {
            this.bot.api.sendMessage(chatType, message, recipient);
        }
    }

    /**
     * Получить User object with методами
     * @param {string} username - Name user
     * @returns {Promise<User>} - User object with методами
     */
    async getUser(username) {
        return await UserService.getUser(username, this.bot.config.id, this.bot.config);
    }

    /**
     * Check, выполняется ли command through WebSocket API
     */
    isWebSocket() {
        return this.transport.type === 'websocket';
    }

    /**
     * Check, выполняется ли command from Minecraft
     */
    isMinecraft() {
        return this.transport.isMinecraftTransport();
    }

    /**
     * Получить название транспорта
     */
    getTransportName() {
        return this.transport.getDisplayName();
    }
}

module.exports = CommandContext;
