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

    if (pinId === 'value') {
        const numPins = node.data?.pinCount || 0;
        const items = [];

        for (let i = 0; i < numPins; i++) {
            const value = await resolvePinValue(node, `pin_${i}`) ||
                         node.data?.[`item_${i}`] ||
                         node.data?.[`value_${i}`];
            items.push(value);
        }

        return items;
    }

    return [];
}

module.exports = {
    evaluate,
};
