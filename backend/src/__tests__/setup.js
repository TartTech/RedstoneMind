/**
 * Jest Setup - выполняется before всеми тестами
 */

// Мокируем logger чтобы тесты were тихими
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Устанавливаем переменные окружения for тестов
process.env.NODE_ENV = 'test';
process.env.DEBUG = 'false';

// Mock for Prisma (if need)
jest.mock('../lib/prisma', () => ({
    bot: {},
    command: {},
    permission: {},
    // ... другие model when необходимости
}));
