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
        const minRaw = await resolvePinValue(node, 'min', node.data.min ?? '0');
        const maxRaw = await resolvePinValue(node, 'max', node.data.max ?? '1');

        const minStr = String(minRaw);
        const maxStr = String(maxRaw);

        const min = parseFloat(minStr.replace(',', '.'));
        const max = parseFloat(maxStr.replace(',', '.'));

        if (isNaN(min) || isNaN(max)) {
            return NaN;
        }

        const produceFloat = minStr.includes('.') || minStr.includes(',') || !Number.isInteger(min) ||
                            maxStr.includes('.') || maxStr.includes(',') || !Number.isInteger(max);

        if (produceFloat) {
            return Math.random() * (max - min) + min;
        } else {
            const minInt = Math.ceil(min);
            const maxInt = Math.floor(max);
            return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        }
    }

    return 0;
}

module.exports = {
    evaluate,
};
