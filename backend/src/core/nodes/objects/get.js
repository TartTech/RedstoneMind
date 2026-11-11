/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers, defaultValue = null) {
    const { resolvePinValue } = helpers;

    if (pinId === 'value') {
        const obj = await resolvePinValue(node, 'object', {});
        const key = await resolvePinValue(node, 'key', '');
        return obj[key] ?? defaultValue;
    }

    return null;
}

module.exports = {
    evaluate,
};
