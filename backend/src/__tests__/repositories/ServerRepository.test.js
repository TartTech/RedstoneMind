const ServerRepository = require('../../repositories/ServerRepository');
const { t } = require('../../i18n');

describe('ServerRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            server: {
                findFirst: jest.fn(),
                findMany: jest.fn(),
            }
        };

        repository = new ServerRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "server"', () => {
        expect(repository.modelName).toBe('server');
    });

    describe('findByHost', () => {
        test(t('tests:validation_f693d087'), async () => {
            const mockServer = {
                id: 1,
                host: 'mc.example.com',
                port: 25565
            };
            mockPrisma.server.findFirst.mockResolvedValue(mockServer);

            const result = await repository.findByHost('mc.example.com', 25565);

            expect(mockPrisma.server.findFirst).toHaveBeenCalledWith({
                where: { host: 'mc.example.com', port: 25565 }
            });
            expect(result).toEqual(mockServer);
        });

        test(t('tests:validation_793d1921'), async () => {
            mockPrisma.server.findFirst.mockResolvedValue(null);

            const result = await repository.findByHost('nonexistent.com', 25565);

            expect(result).toBeNull();
        });
    });

    describe('findAllWithBots', () => {
        test(t('tests:validation_5a29bc20'), async () => {
            const mockServers = [
                {
                    id: 1,
                    host: 'server1.com',
                    bots: [
                        { id: 1, sortOrder: 0 },
                        { id: 2, sortOrder: 1 }
                    ]
                },
                {
                    id: 2,
                    host: 'server2.com',
                    bots: []
                }
            ];
            mockPrisma.server.findMany.mockResolvedValue(mockServers);

            const results = await repository.findAllWithBots();

            expect(mockPrisma.server.findMany).toHaveBeenCalledWith({
                include: {
                    bots: {
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy: { id: 'asc' }
            });
            expect(results).toEqual(mockServers);
        });
    });
});
