/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @param {Map} helpers.memo - Map for хранения мемоизированных значений.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue, memo } = helpers;

    const arr = await resolvePinValue(node, 'array', []);
    if (!Array.isArray(arr) || arr.length === 0) {
        return pinId === 'index' ? -1 : null;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    memo.set(`${node.id}:index`, randomIndex);

    if (pinId === 'element') {
        return arr[randomIndex];
    } else if (pinId === 'index') {
        return randomIndex;
    }

    return null;
}

module.exports = {
    evaluate,
};
