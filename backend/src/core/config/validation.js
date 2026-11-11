/**
 * Configuration for validation
 *
 * Строгая validation (выброс исключений) включена in dev/test окружениях
 * В production validation тоже выполняется, но only логирует errors
 * вместо выброса исключений for предотвращения полного падения
 */
const VALIDATION_ENABLED = true;

/**
 * Строгий режим validation - выбрасывать исключения when ошибках
 * В production отключен for graceful degradation
 */
const VALIDATION_STRICT_MODE = process.env.NODE_ENV !== 'production';

/**
 * Максимальная глубина рекурсии for операций обхода graph
 * Предотвращает бесконечные циклы in циклических структурах graph
 * Value 100 выбрано как норм limit for типичной глубины графов
 */
const MAX_RECURSION_DEPTH = 100;

module.exports = {
    VALIDATION_ENABLED,
    VALIDATION_STRICT_MODE,
    MAX_RECURSION_DEPTH,
};
