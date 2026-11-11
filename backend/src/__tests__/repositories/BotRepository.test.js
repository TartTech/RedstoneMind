const BotRepository = require('../../repositories/BotRepository');
const { t } = require('../../i18n');

describe('BotRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            bot: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
            }
        };

        repository = new BotRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "bot"', () => {
        expect(repository.modelName).toBe('bot');
    });

    describe('findByIdWithServer', () => {
        test(t('tests:validation_a79ded7c'), async () => {
            const mockBot = {
                id: 1,
                username: 'TestBot',
                server: { id: 1, host: 'mc.example.com', port: 25565 }
            };
            mockPrisma.bot.findUnique.mockResolvedValue(mockBot);

            const result = await repository.findByIdWithServer(1);

            expect(mockPrisma.bot.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { server: true }
            });
            expect(result).toEqual(mockBot);
        });
    });

    describe('findAllWithServer', () => {
        test(t('tests:validation_58e9b66c'), async () => {
            const mockBots = [
                { id: 1, username: 'Bot1', sortOrder: 0 },
                { id: 2, username: 'Bot2', sortOrder: 1 }
            ];
            mockPrisma.bot.findMany.mockResolvedValue(mockBots);

            const results = await repository.findAllWithServer();

            expect(mockPrisma.bot.findMany).toHaveBeenCalledWith({
                include: { server: true },
                orderBy: { sortOrder: 'asc' }
            });
            expect(results).toEqual(mockBots);
        });

        test(t('tests:validation_c6655e2f'), async () => {
            mockPrisma.bot.findMany.mockResolvedValue([]);

            await repository.findAllWithServer({ take: 5 });

            expect(mockPrisma.bot.findMany).toHaveBeenCalledWith({
                include: { server: true },
                orderBy: { sortOrder: 'asc' },
                take: 5
            });
        });
    });

    describe('findByUsername', () => {
        test(t('tests:validation_0234374a'), async () => {
            const mockBot = { id: 1, username: 'TestBot' };
            mockPrisma.bot.findUnique.mockResolvedValue(mockBot);

            const result = await repository.findByUsername('TestBot');

            expect(mockPrisma.bot.findUnique).toHaveBeenCalledWith({
                where: { username: 'TestBot' }
            });
            expect(result).toEqual(mockBot);
        });
    });

    describe('findByServerId', () => {
        test(t('tests:validation_e8dfe83f'), async () => {
            const mockBots = [
                { id: 1, serverId: 5, sortOrder: 0 },
                { id: 2, serverId: 5, sortOrder: 1 }
            ];
            mockPrisma.bot.findMany.mockResolvedValue(mockBots);

            const results = await repository.findByServerId(5);

            expect(mockPrisma.bot.findMany).toHaveBeenCalledWith({
                where: { serverId: 5 },
                orderBy: { sortOrder: 'asc' }
            });
            expect(results).toEqual(mockBots);
        });
    });

    describe('updateSortOrder', () => {
        test(t('tests:validation_152179bb'), async () => {
            const mockBot = { id: 1, sortOrder: 10 };
            mockPrisma.bot.update.mockResolvedValue(mockBot);

            const result = await repository.updateSortOrder(1, 10);

            expect(mockPrisma.bot.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { sortOrder: 10 }
            });
            expect(result).toEqual(mockBot);
        });
    });
});
