const { t } = require('../../../i18n');
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

    if (pinId === 'object') {
        if (node.data?.advanced) {
            try {
                return JSON.parse(node.data.jsonValue || '{}');
            } catch (e) {
                console.error(t('nodes:error_082c4832'), e);
                return {};
            }
        } else {
            const numPins = node.data?.pinCount || 0;
            const obj = {};

            for (let i = 0; i < numPins; i++) {
                const key = node.data[`key_${i}`];
                if (key) {
                    obj[key] = await resolvePinValue(node, `value_${i}`);
                }
            }

            return obj;
        }
    }

    return {};
}

module.exports = {
    evaluate,
};
