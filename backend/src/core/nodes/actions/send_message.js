/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    // resolvePinValue now automatically replaces {varName} on values
    const message = String(await resolvePinValue(node, 'message', ''));
    const chatType = await resolvePinValue(node, 'chat_type', context.typeChat);
    const recipient = await resolvePinValue(node, 'recipient', context.user?.username);

    context.bot.sendMessage(chatType, message, recipient);
    await traverse(node, 'exec');
}

module.exports = {
    execute,
};
