const { safeJsonParse } = require('./jsonParser');

/**
 * Парсит value variable in dependencies от её type
 * @param {object} variable - Object variable with полями type, name, value
 * @param {string} variable.type - Type variable ('number', 'boolean', 'array', 'string')
 * @param {string} variable.name - Name variable (for логирования)
 * @param {*} variable.value - Исходное value variable
 * @param {string} [contextName] - Name контекста for логирования (например, 'EventGraph ID 123')
 * @returns {*} - Распарсенное value variable
 */
function parseVariableValue(variable, contextName = 'unknown context') {
    const { type, name, value } = variable;

    try {
        switch (type) {
            case 'number':
                return Number(value) || 0;

            case 'boolean':
                return value === 'true';

            case 'array': {
                const parsedArray = safeJsonParse(value, [], `variable ${name}`);
                if (!Array.isArray(parsedArray)) {
                    console.warn(
                        `[VariableParser] Failed to parse variable "${name}" as array in ${contextName}. ` +
                        `Falling back to empty array. Raw value:`,
                        value
                    );
                    return [];
                }
                return parsedArray;
            }

            default:
                return value;
        }
    } catch (e) {
        console.error(`[VariableParser] Error parsing variable "${name}" in ${contextName}:`, e);
        return getDefaultValueForType(type);
    }
}

/**
 * Returns value by умолчанию for type variable
 * @param {string} type - Type variable
 * @returns {*} - Value by умолчанию
 */
function getDefaultValueForType(type) {
    switch (type) {
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        default:
            return '';
    }
}

/**
 * Парсит array переменных and returns object with распарсенными значениями
 * @param {Array} variables - Array объектов переменных
 * @param {string} [contextName] - Name контекста for логирования
 * @returns {object} - Object with именами переменных in качестве ключей and распарсенными значениями
 */
function parseVariables(variables, contextName = 'unknown context') {
    if (!Array.isArray(variables)) {
        return {};
    }

    const result = {};
    for (const variable of variables) {
        if (!variable.name) {
            console.warn(`[VariableParser] Skipping variable without name in ${contextName}`);
            continue;
        }
        result[variable.name] = parseVariableValue(variable, contextName);
    }
    return result;
}

module.exports = {
    parseVariableValue,
    parseVariables,
    getDefaultValueForType,
};
