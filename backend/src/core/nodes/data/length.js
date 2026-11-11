/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'length') {
        const data = await resolvePinValue(node, 'data');
        if (Array.isArray(data) || typeof data === 'string') {
            return data.length;
        }
        return 0;
    }

    return 0;
}

module.exports = {
    evaluate,
};
