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

    // Поддерживаем оба варианта: 'result' (новая version) and 'value' (старая version for обратной совместимости)
    if (pinId === 'result' || pinId === 'value') {
        const value = await resolvePinValue(node, 'value');
        const targetType = node.data?.targetType || 'String';

        switch (targetType) {
            case 'String':
                // For объектов and массивов используем JSON.stringify
                if (typeof value === 'object' && value !== null) {
                    try {
                        return JSON.stringify(value);
                    } catch (e) {
                        return String(value ?? '');
                    }
                }
                return String(value ?? '');
            case 'Number':
                const num = Number(value);
                return isNaN(num) ? 0 : num;
            case 'Boolean':
                return ['true', '1', 'yes'].includes(String(value).toLowerCase());
            default:
                return value;
        }
    }

    return null;
}

module.exports = {
    evaluate,
};
