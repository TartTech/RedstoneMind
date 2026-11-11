/**
 * Нода for getting list игроков рядом with ботом with расстоянием until них
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'players') {
        // Получаем радиус from входного pin (by умолчанию 32 block)
        const radius = await resolvePinValue(node, 'radius', 32);

        // Получаем list всех существ through botApi
        if (context.bot && context.bot.getNearbyEntities) {
            const entities = await context.bot.getNearbyEntities(null, radius);
            
            // Фильтруем only игроков and добавляем расстояние
            const players = [];
            const botPosition = context.bot.entity?.position;
            
            for (const entity of entities) {
                // Only игроки (type === 'player')
                if (entity.type === 'player' && entity.position) {
                    let distance = null;
                    
                    // Вычисляем расстояние, if известна position bot
                    if (botPosition) {
                        const dx = entity.position.x - botPosition.x;
                        const dy = entity.position.y - botPosition.y;
                        const dz = entity.position.z - botPosition.z;
                        distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        // Округляем until 2 знаков after запятой
                        distance = Math.round(distance * 100) / 100;
                    }
                    
                    players.push({
                        username: entity.username,
                        distance: distance,
                        position: entity.position,
                        id: entity.id
                    });
                }
            }
            
            // Сортируем by расстоянию (ближайшие первыми)
            players.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            
            return players;
        }

        return [];
    }

    return null;
}

module.exports = {
    evaluate,
};

