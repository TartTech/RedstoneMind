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

    if (pinId === 'new_object') {
        const obj = await resolvePinValue(node, 'object', {});
        const key = await resolvePinValue(node, 'key', '');

        const newObj = { ...obj };
        delete newObj[key];
        return newObj;
    }

    return {};
}

module.exports = {
    evaluate,
};
