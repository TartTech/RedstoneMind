
const Command = require('../system/Command');
const fs = require('fs/promises');
const path = require('path');
const { t } = require('../../i18n');

let appVersion = null;

class DevCommand extends Command {
    constructor() {
        super({
            name: 'dev',
            description: t('core:msg_fc19319f'),
            aliases: ['about', 'version', 'ver'],
            cooldown: 10,
            permissions: 'user.say',
            owner: 'system',
            allowedChatTypes: ['chat', 'local', 'clan', 'private', 'websocket'],
            args: []
        });
    }

    // Переопределяем method for кастомного messages when отсутствии прав
    onInsufficientPermissions(bot, typeChat, user) {
        bot.sendMessage(typeChat, t('core:msg_aa6a5848', { user: user.username }), user.username);
    }

    // Переопределяем method for неправильного type chat
    onWrongChatType(bot, typeChat, user) {
        bot.sendMessage('private', `${user.username}, команду dev нельзя использовать в чате типа "${typeChat}"`, user.username);
    }

    // Переопределяем method for кулдауна
    onCooldown(bot, typeChat, user, timeLeft) {
        bot.sendMessage(typeChat, t('core:msg_5e79d849', { user: user.username, timeLeft: timeLeft }), user.username);
    }

    // Переопределяем method for черного list (by умолчанию ничего not отправляется)
    onBlacklisted(bot, typeChat, user) {
        bot.sendMessage(typeChat, t('core:msg_22b69491', { user: user.username }), user.username);
    }

    async handler(bot, typeChat, user) {
        if (!appVersion) {
            try {
                const packageJsonPath = path.join(__dirname, '..', '..', '..', '..', 'package.json');
                const packageJsonData = await fs.readFile(packageJsonPath, 'utf-8');
                appVersion = JSON.parse(packageJsonData).version;
            } catch (error) {
                bot.sendLog(t('core:error_c9d56286', { error: error.message }));
                appVersion = t('core:msg_84649c1e');
            }
        }

        const enabledPluginsCount = bot.config.plugins.length;

        const uniqueCommands = new Set();
        for (const command of bot.commands.values()) {
            uniqueCommands.add(command.name);
        }
        const totalCommandsCount = uniqueCommands.size;

        const message = t('core:success_8b6aacbe', { appVersion: appVersion, enabledPluginsCount: enabledPluginsCount, totalCommandsCount: totalCommandsCount });

        if (typeChat === 'websocket') {
            return message;
        }

        bot.sendMessage(typeChat, message, user.username);
    }
}

module.exports = DevCommand;