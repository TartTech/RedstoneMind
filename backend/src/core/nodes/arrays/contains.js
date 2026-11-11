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
    const element = await resolvePinValue(node, 'element', null);

    if (Array.isArray(arr)) {
        const index = arr.indexOf(element);
        memo.set(`${node.id}:index`, index);

        if (pinId === 'result') {
            return index !== -1;
        } else if (pinId === 'index') {
            return index;
        }
    } else {
        memo.set(`${node.id}:index`, -1);

        if (pinId === 'result') {
            return false;
        } else if (pinId === 'index') {
            return -1;
        }
    }

    return null;
}

module.exports = {
    evaluate,
};
