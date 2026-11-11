/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    return context.botState ? { yaw: context.botState.yaw, pitch: context.botState.pitch } : null;
}

module.exports = {
    evaluate,
};
