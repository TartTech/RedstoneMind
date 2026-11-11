/**
 * Константы for типов графов
 * Используются for фильтрации доступных нод in dependencies от контекста
 */

/**
 * @typedef {('all'|'command'|'event')} GraphType
 */

const GRAPH_TYPES = {
    /** Нода доступна во всех типах графов */
    ALL: 'all',
    /** Нода доступна only in графах команд */
    COMMAND: 'command',
    /** Нода доступна only in графах событий */
    EVENT: 'event',
};

module.exports = {
    GRAPH_TYPES,
};
