/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    let message = await helpers.resolvePinValue(node, 'message', '');

    // If message - это object or array, форматируем как JSON
    if (typeof message === 'object' && message !== null) {
        message = JSON.stringify(message, null, 2);
    }

    if (context?.bot?.sendLog) {
        context.bot.sendLog(`[Graph] ${message}`);
    } else {
        // Fallback - консоль терминала
        console.log(`[Graph Log] ${message}`);
    }

    await helpers.traverse(node, 'exec');
}

module.exports = {
    execute,
};
