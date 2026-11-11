const User = require('../../UserService');
const prismaService = require('../../PrismaService');
const { tryGraphWrite, graphUser } = require('../../graphServices');
const prisma = prismaService.getClient();

/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 * @param {Map} helpers.memo - Карта for мемоизации значений.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse, memo } = helpers;

    const userObject = await resolvePinValue(node, 'user', null);
    const blacklistStatus = await resolvePinValue(node, 'blacklist_status', false);
    let updatedUser = null;
    
    if (userObject && userObject.username) {
        const isolated = await tryGraphWrite(context, 'set_blacklist', `${userObject.username}=${Boolean(blacklistStatus)}`, {
            username: userObject.username,
            status: blacklistStatus,
        });
        if (isolated?.handled) {
            memo.set(`${node.id}:updated_user`, await graphUser(context, userObject.username));
            await traverse(node, 'exec');
            return;
        }
        const user = await graphUser(context, userObject.username);
        if (user) {
            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { isBlacklisted: blacklistStatus }
            });
            User.clearCache(userObject.username, context.botId);
        }
    }
    
    memo.set(`${node.id}:updated_user`, updatedUser);
    await traverse(node, 'exec');
}

module.exports = {
    execute,
};
