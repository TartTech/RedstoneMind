const Command = require('../system/Command');
const { t } = require('../../i18n');

class WhoisCommand extends Command {
    constructor() {
        super({
            name: 'whois',
            description: t('core:msg_b67f3f11'),
            aliases: ['userinfo', t('core:msg_cbcb1a10')],
            cooldown: 5,
            permissions: 'user.whois',
            owner: 'system',
            allowedChatTypes: ['chat', 'local', 'clan', 'private', 'websocket'],
            args: [
                {
                    name: 'username',
                    type: 'string',
                    required: false,
                    description: t('core:msg_712be42f')
                }
            ]
        });
    }

    async handler(context) {
        const targetUsername = context.args.username || context.user.username;

        try {
            const targetUser = await context.getUser(targetUsername);

            // Получаем list групп
            const groups = targetUser.groups
                .map(ug => ug.group.name)
                .join(', ') || t('core:msg_e9e2efb6');

            // Status
            const status = targetUser.isBlacklisted ? t('core:msg_7efe0d1c') : t('core:msg_ba0f68c0');

            // Форматируем вывод in dependencies от транспорта
            let message;

            if (context.isWebSocket()) {
                // For WebSocket API возвращаем структурированные data
                message = {
                    username: targetUser.username,
                    isOwner: targetUser.isOwner,
                    isBlacklisted: targetUser.isBlacklisted,
                    groups: targetUser.groups.map(ug => ug.group.name),
                    status: status
                };
            } else {
                message = t('core:msg_7855ef66', { targetUser: targetUser.username, groups: groups, status: status });
            }

            return context.reply(message);

        } catch (error) {
            const errorMsg = t('core:error_a1386db6', { error: error.message });
            return context.reply(errorMsg);
        }
    }
}

module.exports = WhoisCommand;
