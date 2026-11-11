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

    if (pinId === 'result') {
        const arr = await resolvePinValue(node, 'array', []);
        const element = await resolvePinValue(node, 'element', null);
        return Array.isArray(arr) ? [...arr, element] : [element];
    }

    return [];
}

module.exports = {
    evaluate,
};
