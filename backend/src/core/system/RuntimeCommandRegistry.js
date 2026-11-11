/**
 * RuntimeCommandRegistry - registry временных команд, созданных во время execution
 * Хранит commands in памяти for каждого bot
 */
class RuntimeCommandRegistry {
    constructor() {
        // Map<botId, Map<commandName, Command>>
        this.commands = new Map();
    }

    /**
     * Добавить временную команду for bot
     * @param {string} botId - ID bot
     * @param {string} commandName - Name commands
     * @param {object} commandData - Data commands
     */
    register(botId, commandName, commandData) {
        if (!this.commands.has(botId)) {
            this.commands.set(botId, new Map());
        }

        const botCommands = this.commands.get(botId);
        botCommands.set(commandName, commandData);
    }

    /**
     * Удалить временную команду
     * @param {string} botId - ID bot
     * @param {string} commandName - Name commands
     * @returns {boolean} - Успешно ли удалена command
     */
    unregister(botId, commandName) {
        if (!this.commands.has(botId)) {
            return false;
        }

        const botCommands = this.commands.get(botId);
        return botCommands.delete(commandName);
    }

    /**
     * Получить временную команду
     * @param {string} botId - ID bot
     * @param {string} commandName - Name commands
     * @returns {object|null} - Data commands or null
     */
    get(botId, commandName) {
        if (!this.commands.has(botId)) {
            return null;
        }

        return this.commands.get(botId).get(commandName) || null;
    }

    /**
     * Получить all временные commands for bot
     * @param {string} botId - ID bot
     * @returns {Map<string, object>} - Map команд
     */
    getAllForBot(botId) {
        return this.commands.get(botId) || new Map();
    }

    /**
     * Проверить существование commands
     * @param {string} botId - ID bot
     * @param {string} commandName - Name commands
     * @returns {boolean}
     */
    has(botId, commandName) {
        if (!this.commands.has(botId)) {
            return false;
        }

        return this.commands.get(botId).has(commandName);
    }

    /**
     * Очистить all commands for bot (when остановке bot)
     * @param {string} botId - ID bot
     */
    clearForBot(botId) {
        if (this.commands.has(botId)) {
            this.commands.delete(botId);
        }
    }

    /**
     * Получить статистику
     * @returns {object}
     */
    getStats() {
        let totalCommands = 0;
        for (const botCommands of this.commands.values()) {
            totalCommands += botCommands.size;
        }

        return {
            totalBots: this.commands.size,
            totalCommands,
        };
    }
}


let instance = null;

module.exports = {
    RuntimeCommandRegistry,
    getRuntimeCommandRegistry: () => {
        if (!instance) {
            instance = new RuntimeCommandRegistry();
        }
        return instance;
    }
};
