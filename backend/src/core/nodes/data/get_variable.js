const { t } = require('../../../i18n');
/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    if (pinId === 'value') {
        const varName = node.data?.variableName || node.data?.selectedVariable || '';
        if (!varName) {
            console.warn(t('nodes:log_9eef38f5'), node.data);
            return null;
        }
        return context.variables.hasOwnProperty(varName) ? context.variables[varName] : null;
    }

    return null;
}

module.exports = {
    evaluate,
};
