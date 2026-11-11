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

    const obj = await resolvePinValue(node, 'object', {});
    const key = await resolvePinValue(node, 'key', '');
    const exists = obj.hasOwnProperty(key);

    memo.set(`${node.id}:value`, exists ? obj[key] : null);

    if (pinId === 'result') {
        return exists;
    } else if (pinId === 'value') {
        return memo.get(`${node.id}:value`);
    }

    return null;
}

module.exports = {
    evaluate,
};
