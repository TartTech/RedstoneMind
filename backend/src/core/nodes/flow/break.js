const BreakLoopSignal = require('../../BreakLoopSignal');

/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 */
async function execute(node, context, helpers) {
    throw new BreakLoopSignal();
}

module.exports = {
    execute,
};
