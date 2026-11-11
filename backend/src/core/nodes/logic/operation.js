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
        const op = node.data?.operation || 'AND';
        const inputs = [];
        const pinCount = node.data?.pinCount || 2;

        for (let i = 0; i < pinCount; i++) {
            const value = await resolvePinValue(node, `pin_${i}`, false);
            inputs.push(value);
        }

        switch (op) {
            case 'AND': return inputs.every(Boolean);
            case 'OR': return inputs.some(Boolean);
            case 'NOT': return !inputs[0];
            default: return false;
        }
    }

    return false;
}

module.exports = {
    evaluate,
};
