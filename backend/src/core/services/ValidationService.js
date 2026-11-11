const { validateGraph, validateNodeConfig } = require('../validation/nodeSchemas');
const { safeJsonParse } = require('../utils/jsonParser');
const { VALIDATION_ENABLED, VALIDATION_STRICT_MODE } = require('../config/validation');

/**
 * Service for централизованной validation графов and нод
 *
 * Предоставляет единую точку input for validation with учетом configuration окружения.
 * In строгом режиме (dev/test) выбрасывает исключения, in production логирует and returns result.
 */
class ValidationService {
    constructor() {
        this.validationEnabled = VALIDATION_ENABLED;
        this.strictMode = VALIDATION_STRICT_MODE;
    }

    /**
     * Парсит JSON строку graph with безопасной обработкой ошибок
     * @param {string|object} graph - Graph in виде string or object
     * @param {string} contextName - Name контекста for логирования
     * @returns {object|null} - Распарсенный graph or null when ошибке
     */
    parseGraph(graph, contextName = 'unknown context') {
        if (typeof graph === 'string') {
            return safeJsonParse(graph, null, contextName);
        }
        return graph;
    }

    /**
     * Валидирует конфигурацию graph
     * @param {object} graph - Object graph for validation
     * @param {string} contextName - Name контекста for логирования (например, 'GraphExecutionEngine')
     * @returns {{success: boolean, error?: any, shouldSkip: boolean}} - Result validation
     */
    validateGraphStructure(graph, contextName = 'unknown context') {
        if (!this.validationEnabled) {
            return { success: true, shouldSkip: false };
        }

        // Сначала проверяем базовую структуру
        if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.connections)) {
            console.error(`[${contextName}] Graph validation failed: missing or invalid nodes/connections arrays`);

            if (this.strictMode) {
                throw new Error('Invalid graph structure: missing nodes or connections');
            }

            console.warn(`[${contextName}] Skipping graph execution due to missing basic structure in production mode`);
            return { success: false, error: 'Missing nodes or connections', shouldSkip: true };
        }

        // Затем выполняем полную валидацию schema
        const validation = validateGraph(graph);

        if (!validation.success) {
            console.error(`[${contextName}] Graph validation failed:`, {
                errors: validation.error
            });

            if (this.strictMode) {
                throw new Error('Invalid graph structure');
            }

            // В production логируем and пропускаем выполнение
            console.warn(`[${contextName}] Skipping graph execution due to validation errors in production mode`);
            return { success: false, error: validation.error, shouldSkip: true };
        }

        return { success: true, shouldSkip: false };
    }

    /**
     * Валидирует конфигурацию ноды
     * @param {object} nodeConfig - Configuration ноды for validation
     * @param {string} contextName - Name контекста for логирования (например, 'NodeRegistry')
     * @returns {{success: boolean, error?: any, shouldSkip: boolean}} - Result validation
     */
    validateNode(nodeConfig, contextName = 'unknown context') {
        if (!this.validationEnabled) {
            return { success: true, shouldSkip: false };
        }

        const validation = validateNodeConfig(nodeConfig);

        if (!validation.success) {
            console.error(`[${contextName}] Validation failed for node type '${nodeConfig.type}':`, {
                type: nodeConfig.type,
                errors: validation.error
            });

            if (this.strictMode) {
                throw new Error(`Invalid node configuration for '${nodeConfig.type}'`);
            }

            // В production пропускаем невалидную ноду
            console.warn(`[${contextName}] Skipping registration of invalid node '${nodeConfig.type}' in production mode`);
            return { success: false, error: validation.error, shouldSkip: true };
        }

        return { success: true, shouldSkip: false };
    }

    /**
     * Checks базовую структуру graph (nodes и connections)
     * @param {object} graph - Object graph
     * @returns {boolean} - true if структура валидна
     */
    hasValidBasicStructure(graph) {
        return !!(graph && Array.isArray(graph.nodes) && Array.isArray(graph.connections));
    }

    /**
     * Checks, включена ли validation
     * @returns {boolean}
     */
    isValidationEnabled() {
        return this.validationEnabled;
    }

    /**
     * Checks, включен ли строгий режим
     * @returns {boolean}
     */
    isStrictMode() {
        return this.strictMode;
    }
}

// Экспортируем singleton instance
const validationServiceInstance = new ValidationService();
module.exports = validationServiceInstance;
