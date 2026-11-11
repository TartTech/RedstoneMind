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
        const value = await resolvePinValue(node, 'value', '');

        // Преобразуем in строку
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return String(value);
    }

    return '';
}

module.exports = {
    evaluate,
};
