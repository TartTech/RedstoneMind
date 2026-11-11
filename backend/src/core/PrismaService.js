const { PrismaClient } = require('@prisma/client');

/**
 * Singleton service for PrismaClient
 * Предотвращает утечки памяти используя одно connection with БД
 * Благодаря кешированию require в Node.js это фактический singleton
 */
class PrismaService {
    constructor() {
        this.prisma = new PrismaClient({
            log: ['error', 'warn'],
        });
    }

    /**
     * Получить instance Prisma client
     * @returns {PrismaClient}
     */
    getClient() {
        return this.prisma;
    }

    /**
     * Отключиться от БД (вызывать when выключении приложения)
     */
    async disconnect() {
        await this.prisma.$disconnect();
    }
}

const prismaService = new PrismaService();
module.exports = prismaService;
