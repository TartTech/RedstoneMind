/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    if (pinId === 'position') {
        if (context.bot?.entity?.position) {
            return context.bot.entity.position;
        }
    }

    return null;
}

module.exports = {
    evaluate,
};
