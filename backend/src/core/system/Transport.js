const { t } = require('../../i18n');
/**
 * Transport - абстракция for различных способов доставки сообщений
 * Поддерживает: websocket, minecraft (chat/clan/private/command), telegram (будущее)
 */
class Transport {
    constructor(type, bot = null) {
        this.type = type; // 'websocket' | 'chat' | 'clan' | 'private' | 'command' | 'telegram'
        this.bot = bot;
    }

    /**
     * Отправить message through этот транспорт
     * @param {string} message - Текст messages
     * @param {string} recipient - Получатель (for private/telegram)
     * @returns {string|void} - For websocket returns message, for остальных void
     */
    send(message, recipient = null) {
        if (this.type === 'websocket') {
            // WebSocket - возвращаем result как есть
            return message;
        } else if (this.isMinecraftTransport()) {
            // Minecraft - отправляем through bot
            if (this.bot && this.bot.api) {
                this.bot.api.sendMessage(this.type, message, recipient);
            }
        }
    }

    /**
     * Check, является ли этот транспорт Minecraft-транспортом
     */
    isMinecraftTransport() {
        return ['chat', 'local', 'clan', 'private', 'command'].includes(this.type);
    }

    /**
     * Check, является ли этот транспорт универсальным (not требует verification allowedChatTypes)
     */
    isUniversal() {
        return this.type === 'websocket';
    }

    /**
     * Check, can ли command быть выполнена through этот транспорт
     * @param {Array<string>} allowedTypes - List разрешенных типов chat from commands
     */
    isAllowedFor(allowedTypes) {
        // Универсальные транспорты всегда разрешены
        if (this.isUniversal()) {
            return true;
        }

        // For остальных проверяем list разрешенных типов
        return allowedTypes.includes(this.type);
    }

    /**
     * Получить читаемое название транспорта
     */
    getDisplayName() {
        const names = {
            websocket: 'WebSocket API',
            chat: t('core:msg_b63a061a'),
            local: t('core:msg_612dda5e'),
            clan: t('core:msg_d8dafc5d'),
            private: t('core:msg_72464eb6'),
            command: t('core:msg_85bd6ff1'),
            telegram: 'Telegram'
        };
        return names[this.type] || this.type;
    }
}

module.exports = Transport;
