/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const condition = await helpers.resolvePinValue(node, 'condition', false);
    await helpers.traverse(node, condition ? 'exec_true' : 'exec_false');
}

module.exports = {
    execute,
};
