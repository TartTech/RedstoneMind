const fs = require('fs');
const path = require('path');
const Command = require('./Command');
const GraphExecutionEngine = require('../GraphExecutionEngine');
const NodeRegistry = require('../NodeRegistry');
const { t } = require('../i18n');

class CommandManager {
    constructor(commandsPath) {
        this.commandTemplates = new Map();
        this.commandsPath = commandsPath;
        this.loadCommandTemplates();
    }

    /**
     * Сканирует директорию, loads and кэширует "шаблоны" команд.
     * Шаблон - это configuration by умолчанию from file commands.
     */
    loadCommandTemplates() {
        console.log(t('core:log_cd56a92f'));
        try {
            const commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(this.commandsPath, file);
                const CommandClass = require(filePath);
const { t } = require('../../i18n');
                
                if (CommandClass.prototype instanceof Command) {
                    const commandInstance = new CommandClass();
                    const config = {
                        name: commandInstance.name,
                        description: commandInstance.description || '',
                        aliases: commandInstance.aliases || [],
                        owner: commandInstance.owner || 'system',
                        permissions: commandInstance.permissions,
                        allowedChatTypes: commandInstance.allowedChatTypes || ['chat', 'private'],
                        cooldown: commandInstance.cooldown || 0,
                        args: commandInstance.args || [],
                        isActive: commandInstance.isActive !== undefined ? commandInstance.isActive : true,
                    };

                    if (config.name) {
                        this.commandTemplates.set(config.name, config);
                       // console.log(`[CommandManager] Шаблон for commands "${config.name}" успешно загружен.`);
                    }
                }
            }
        } catch (error) {
            console.error(t('core:error_bacff327'), error);
        }
    }

    /**
     * Returns array всех шаблонов команд.
     * @returns {Array<object>}
     */
    getCommandTemplates() {
        return Array.from(this.commandTemplates.values());
    }
}

const commandsDir = path.join(__dirname, '../commands');
module.exports = new CommandManager(commandsDir);