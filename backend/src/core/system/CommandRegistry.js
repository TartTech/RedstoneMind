const fs = require('fs/promises');
const path = require('path');
const { t } = require('../../i18n');

const commands = new Map();

async function loadCommands() {
    const commandsDir = path.resolve(__dirname, '../commands');
    const files = await fs.readdir(commandsDir);

    for (const file of files) {
        if (file.endsWith('.js')) {
            const CommandClass = require(path.join(commandsDir, file));
            const commandInstance = new CommandClass();
            commands.set(commandInstance.name, commandInstance);
        }
    }
    console.log(t('core:success_40ac7134', { commands: commands.size }));
    return commands;
}

module.exports = { loadCommands, commands };