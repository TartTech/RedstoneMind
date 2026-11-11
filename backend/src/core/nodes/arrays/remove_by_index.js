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
        const index = await resolvePinValue(node, 'index', -1);

        if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
            return arr || [];
        }

        const newArr = [...arr];
        newArr.splice(index, 1);
        return newArr;
    }

    return [];
}

module.exports = {
    evaluate,
};
