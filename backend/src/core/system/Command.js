const { t } = require('../../i18n');
class Command {
    constructor({
        name,
        description = '',
        aliases = [],
        owner = 'system',
        permissions = '',
        args = [],
        cooldown = 0,
        allowedChatTypes = ['chat', 'private'],
    }) {
        this.name = name;
        this.description = description;
        this.aliases = aliases;
        this.owner = owner;
        this.permissions = permissions;
        this.args = args;
        this.cooldown = cooldown;
        this.allowedChatTypes = allowedChatTypes;
    }

    onInsufficientPermissions(bot, typeChat, user) {
        bot.api.sendMessage(typeChat, t('core:msg_f9bf622a', { this: this.name }), user.username);
    }

    onWrongChatType(bot, typeChat, user) {
        bot.api.sendMessage('private', t('core:msg_a3c5143d', { this: this.name, typeChat: typeChat }), user.username);
    }
    
    onCooldown(bot, typeChat, user, timeLeft) {
        bot.api.sendMessage(typeChat, t('core:msg_7150371f', { this: this.name, timeLeft: timeLeft }), user.username);
    }

    onBlacklisted(bot, typeChat, user) {
    }

    async handler(bot, typeChat, user, args) {
        throw new Error(t('core:msg_ebdbff24', { this: this.name }));
    }
}

module.exports = Command;