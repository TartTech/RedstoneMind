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
        const op = node.data?.operation || '==';
        const valA = await resolvePinValue(node, 'a');
        const valB = await resolvePinValue(node, 'b');

        switch (op) {
            case '==': return valA == valB;
            case '!=': return valA != valB;
            case '>': return valA > valB;
            case '<': return valA < valB;
            case '>=': return valA >= valB;
            case '<=': return valA <= valB;
            default: return false;
        }
    }

    return false;
}

module.exports = {
    evaluate,
};
