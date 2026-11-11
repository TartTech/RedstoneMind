const CommandRepository = require('../../repositories/CommandRepository');
const { t } = require('../../i18n');

describe('CommandRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            command: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
            }
        };

        repository = new CommandRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "command"', () => {
        expect(repository.modelName).toBe('command');
    });

    describe('findByBotId', () => {
        test(t('tests:validation_1339814a'), async () => {
            const mockCommands = [
                { id: 1, botId: 1, name: 'test' },
                { id: 2, botId: 1, name: 'help' }
            ];
            mockPrisma.command.findMany.mockResolvedValue(mockCommands);

            const results = await repository.findByBotId(1);

            expect(mockPrisma.command.findMany).toHaveBeenCalledWith({
                where: { botId: 1 },
                orderBy: { name: 'asc' }
            });
            expect(results).toEqual(mockCommands);
        });
    });

    describe('findEnabledByBotId', () => {
        test(t('tests:validation_899b304b'), async () => {
            const mockCommands = [
                { id: 1, botId: 1, name: 'test', isEnabled: true }
            ];
            mockPrisma.command.findMany.mockResolvedValue(mockCommands);

            const results = await repository.findEnabledByBotId(1);

            expect(mockPrisma.command.findMany).toHaveBeenCalledWith({
                where: {
                    botId: 1,
                    isEnabled: true
                },
                orderBy: { name: 'asc' }
            });
            expect(results).toEqual(mockCommands);
        });
    });

    describe('findByName', () => {
        test(t('tests:validation_4e90cd3d'), async () => {
            const mockCommand = { id: 1, botId: 1, name: 'test' };
            mockPrisma.command.findFirst.mockResolvedValue(mockCommand);

            const result = await repository.findByName(1, 'test');

            expect(mockPrisma.command.findFirst).toHaveBeenCalledWith({
                where: { botId: 1, name: 'test' }
            });
            expect(result).toEqual(mockCommand);
        });
    });

    describe('findByNameOrAlias', () => {
        test(t('tests:validation_4e90cd3d'), async () => {
            const mockCommands = [
                { id: 1, name: 'test', aliases: '[]', isEnabled: true }
            ];
            mockPrisma.command.findMany.mockResolvedValue(mockCommands);

            const result = await repository.findByNameOrAlias(1, 'test');

            expect(result).toEqual(mockCommands[0]);
        });

        test(t('tests:validation_20389df5'), async () => {
            const mockCommands = [
                { id: 1, name: 'help', aliases: '["h", "?"]', isEnabled: true }
            ];
            mockPrisma.command.findMany.mockResolvedValue(mockCommands);

            const result = await repository.findByNameOrAlias(1, 'h');

            expect(result).toEqual(mockCommands[0]);
        });

        test(t('tests:validation_c4608bfe'), async () => {
            mockPrisma.command.findMany.mockResolvedValue([]);

            const result = await repository.findByNameOrAlias(1, 'nonexistent');

            expect(result).toBeUndefined();
        });

        test(t('tests:validation_ab15f210'), async () => {
            const mockCommands = [
                { id: 1, name: 'test', aliases: 'invalid json', isEnabled: true }
            ];
            mockPrisma.command.findMany.mockResolvedValue(mockCommands);

            const result = await repository.findByNameOrAlias(1, 'alias');

            expect(result).toBeUndefined();
        });
    });

    describe('updateEnabled', () => {
        test(t('tests:validation_7d654a48'), async () => {
            const mockCommand = { id: 1, isEnabled: false };
            mockPrisma.command.update.mockResolvedValue(mockCommand);

            const result = await repository.updateEnabled(1, false);

            expect(mockPrisma.command.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isEnabled: false }
            });
            expect(result).toEqual(mockCommand);
        });
    });
});
