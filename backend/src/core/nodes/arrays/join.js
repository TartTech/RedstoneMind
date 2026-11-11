/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'result') {
        const array = await resolvePinValue(node, 'array', []);
        const separator = String(await resolvePinValue(node, 'separator', ', '));

        if (!Array.isArray(array)) {
            return '';
        }

        return array.join(separator);
    }

    return '';
}

module.exports = {
    evaluate,
};
