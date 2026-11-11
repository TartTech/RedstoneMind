const Command = require('../system/Command');
const { t } = require('../../i18n');

class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: t('core:msg_5e582140'),
            aliases: [t('core:msg_452d49d6'), 'p'],
            cooldown: 5,
            permissions: 'user.ping',
            owner: 'system',
            allowedChatTypes: ['local', 'clan', 'private', 'websocket'],
            
            args: [
                {
                    name: 'target',
                    type: 'string',
                    required: false,
                    description: t('core:msg_0c2165bf')
                }
            ]
        });
    }

    async handler(bot, typeChat, user, { target }) {
        let message;
        if (target) {
            message = t('core:msg_1d643fbb', { user: user.username, target: target });
        } else {
            message = t('core:msg_c0fdcedb', { user: user.username });
        }

        if (typeChat === 'websocket') {
            return message;
        }

        bot.sendMessage(typeChat, message, user.username);
    }
}

module.exports = PingCommand;