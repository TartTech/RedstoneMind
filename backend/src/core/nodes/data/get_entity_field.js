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

    const entity = await resolvePinValue(node, 'entity');
    return entity ? entity[pinId] : defaultValue;
}

module.exports = {
    evaluate,
};
