/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const pinCount = node.data?.pinCount || 2;
    for (let i = 0; i < pinCount; i++) {
        await helpers.traverse(node, `exec_${i}`);
    }
}

module.exports = {
    execute,
};
