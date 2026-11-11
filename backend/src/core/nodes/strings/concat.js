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
        const pinCount = node.data?.pinCount || 2;
        let finalString = '';
        for (let i = 0; i < pinCount; i++) {
            const part = await resolvePinValue(node, `pin_${i}`, '');
            finalString += String(part ?? '');
        }
        return finalString;
    }

    return '';
}

module.exports = {
    evaluate,
};
