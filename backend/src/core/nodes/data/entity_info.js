/**
 * Нода for извлечения информации from object существа
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    // Получаем object существа from входного pin
    const entity = await resolvePinValue(node, 'entity');
    
    if (!entity) {
        // Возвращаем values by умолчанию if существо not передано
        if (pinId === 'type') return null;
        if (pinId === 'username') return null;
        if (pinId === 'distance') return null;
        if (pinId === 'position') return null;
        if (pinId === 'id') return null;
        if (pinId === 'isPlayer') return false;
        return null;
    }

    // Возвращаем нужное field in dependencies от запрошенного выходного pin
    switch (pinId) {
        case 'type':
            return entity.type || 'unknown';
        
        case 'username':
            // For игроков - username, for остальных - displayName or type
            return entity.username || entity.displayName || entity.type || 'unknown';
        
        case 'distance':
            // Вычисляем расстояние от bot until существа
            if (entity.position && context.bot?.entity?.position) {
                const botPos = context.bot.entity.position;
                const entityPos = entity.position;
                
                const dx = entityPos.x - botPos.x;
                const dy = entityPos.y - botPos.y;
                const dz = entityPos.z - botPos.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Округляем until 2 знаков after запятой
                return Math.round(distance * 100) / 100;
            }
            return null;
        
        case 'position':
            return entity.position || null;
        
        case 'id':
            return entity.id || null;
        
        case 'isPlayer':
            return entity.type === 'player';
        
        default:
            return null;
    }
}

module.exports = {
    evaluate,
};

