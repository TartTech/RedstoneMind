const EventGraphRepository = require('../../repositories/EventGraphRepository');
const { t } = require('../../i18n');

describe('EventGraphRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            eventGraph: {
                findMany: jest.fn(),
                update: jest.fn(),
            }
        };

        repository = new EventGraphRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "eventGraph"', () => {
        expect(repository.modelName).toBe('eventGraph');
    });

    describe('findByBotId', () => {
        test(t('tests:validation_2cf8d1a9'), async () => {
            const mockGraphs = [
                { id: 1, botId: 1, name: 'Graph 1' },
                { id: 2, botId: 1, name: 'Graph 2' }
            ];
            mockPrisma.eventGraph.findMany.mockResolvedValue(mockGraphs);

            const results = await repository.findByBotId(1);

            expect(mockPrisma.eventGraph.findMany).toHaveBeenCalledWith({
                where: { botId: 1 },
                orderBy: { name: 'asc' }
            });
            expect(results).toEqual(mockGraphs);
        });
    });

    describe('findEnabledByBotId', () => {
        test(t('tests:validation_09c9e31c'), async () => {
            const mockGraphs = [
                { id: 1, botId: 1, isEnabled: true }
            ];
            mockPrisma.eventGraph.findMany.mockResolvedValue(mockGraphs);

            const results = await repository.findEnabledByBotId(1);

            expect(mockPrisma.eventGraph.findMany).toHaveBeenCalledWith({
                where: {
                    botId: 1,
                    isEnabled: true
                }
            });
            expect(results).toEqual(mockGraphs);
        });
    });

    describe('findByEventType', () => {
        test(t('tests:validation_2418ec9e'), async () => {
            const mockGraphs = [
                { id: 1, botId: 1, eventType: 'chat', isEnabled: true }
            ];
            mockPrisma.eventGraph.findMany.mockResolvedValue(mockGraphs);

            const results = await repository.findByEventType(1, 'chat');

            expect(mockPrisma.eventGraph.findMany).toHaveBeenCalledWith({
                where: {
                    botId: 1,
                    eventType: 'chat',
                    isEnabled: true
                }
            });
            expect(results).toEqual(mockGraphs);
        });
    });

    describe('updateEnabled', () => {
        test(t('tests:validation_7d654a48'), async () => {
            const mockGraph = { id: 1, isEnabled: false };
            mockPrisma.eventGraph.update.mockResolvedValue(mockGraph);

            const result = await repository.updateEnabled(1, false);

            expect(mockPrisma.eventGraph.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isEnabled: false }
            });
            expect(result).toEqual(mockGraph);
        });
    });
});
