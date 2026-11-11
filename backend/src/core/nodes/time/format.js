const { format } = require('date-fns');
const { t } = require('../../../i18n');

/**
 * @param {object} node
 * @param {string} pinId
 * @param {object} context
 * @param {object} helpers
 * @returns {Promise<any>}
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'formatted') {
        const date = await resolvePinValue(node, 'date', new Date());
        const formatString = await resolvePinValue(node, 'format', 'yyyy-MM-dd HH:mm:ss');

        if (date instanceof Date && !isNaN(date.getTime())) {
            try {
                return format(date, formatString);
            } catch (error) {
                throw new Error(t('nodes:error_1c4230f2', { error: error.message }));
            }
        }
        throw new Error(t('nodes:error_ac2dc29d'));
    }

    return null;
}

module.exports = {
    evaluate,
};
