/**
 * Нода for getting list существ рядом with ботом
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'entities') {
        // Получаем радиус from входного pin (by умолчанию 32 block)
        const radius = await resolvePinValue(node, 'radius', 32);

        // Получаем list существ through botApi
        if (context.bot && context.bot.getNearbyEntities) {
            const entities = await context.bot.getNearbyEntities(null, radius);
            return entities || [];
        }

        return [];
    }

    return null;
}

module.exports = {
    evaluate,
};

