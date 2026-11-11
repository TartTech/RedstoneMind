const PluginRepository = require('../../repositories/PluginRepository');
const { t } = require('../../i18n');

describe('PluginRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            installedPlugin: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                deleteMany: jest.fn(),
            }
        };

        repository = new PluginRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "installedPlugin"', () => {
        expect(repository.modelName).toBe('installedPlugin');
    });

    describe('findByBotId', () => {
        test(t('tests:validation_ec071783'), async () => {
            const mockPlugins = [
                { id: 1, botId: 1, name: 'plugin1' },
                { id: 2, botId: 1, name: 'plugin2' }
            ];
            mockPrisma.installedPlugin.findMany.mockResolvedValue(mockPlugins);

            const results = await repository.findByBotId(1);

            expect(mockPrisma.installedPlugin.findMany).toHaveBeenCalledWith({
                where: { botId: 1 },
                orderBy: { name: 'asc' }
            });
            expect(results).toEqual(mockPlugins);
        });
    });

    describe('findByName', () => {
        test(t('tests:validation_f4645604'), async () => {
            const mockPlugin = {
                id: 1,
                botId: 1,
                name: 'test-plugin'
            };
            mockPrisma.installedPlugin.findFirst.mockResolvedValue(mockPlugin);

            const result = await repository.findByName(1, 'test-plugin');

            expect(mockPrisma.installedPlugin.findFirst).toHaveBeenCalledWith({
                where: { botId: 1, name: 'test-plugin' }
            });
            expect(result).toEqual(mockPlugin);
        });
    });

    describe('findEnabledByBotId', () => {
        test(t('tests:validation_23f0a226'), async () => {
            const mockPlugins = [
                { id: 1, botId: 1, name: 'enabled-plugin', isEnabled: true }
            ];
            mockPrisma.installedPlugin.findMany.mockResolvedValue(mockPlugins);

            const results = await repository.findEnabledByBotId(1);

            expect(mockPrisma.installedPlugin.findMany).toHaveBeenCalledWith({
                where: {
                    botId: 1,
                    isEnabled: true
                }
            });
            expect(results).toEqual(mockPlugins);
        });
    });

    describe('updateEnabled', () => {
        test(t('tests:validation_7d654a48'), async () => {
            const mockPlugin = { id: 1, isEnabled: false };
            mockPrisma.installedPlugin.update.mockResolvedValue(mockPlugin);

            const result = await repository.updateEnabled(1, false);

            expect(mockPrisma.installedPlugin.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isEnabled: false }
            });
            expect(result).toEqual(mockPlugin);
        });
    });

    describe('deleteByName', () => {
        test(t('tests:validation_0f219c54'), async () => {
            const mockResult = { count: 1 };
            mockPrisma.installedPlugin.deleteMany.mockResolvedValue(mockResult);

            const result = await repository.deleteByName(1, 'plugin-to-delete');

            expect(mockPrisma.installedPlugin.deleteMany).toHaveBeenCalledWith({
                where: { botId: 1, name: 'plugin-to-delete' }
            });
            expect(result).toEqual(mockResult);
        });
    });
});
