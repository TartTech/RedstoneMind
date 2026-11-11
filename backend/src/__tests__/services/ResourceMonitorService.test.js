const ResourceMonitorService = require('../../core/services/ResourceMonitorService');
const { t } = require('../../i18n');

describe('ResourceMonitorService', () => {
    let resourceMonitor;
    let mockProcessManager;
    let mockLogger;

    beforeEach(() => {
        jest.clearAllMocks();

        mockLogger = {
            error: jest.fn(),
            info: jest.fn(),
        };

        mockProcessManager = {
            getAllProcesses: jest.fn(() => new Map())
        };

        resourceMonitor = new ResourceMonitorService({
            botProcessManager: mockProcessManager,
            logger: mockLogger
        });
    });

    describe('startMonitoring', () => {
        test(t('tests:validation_2b97e71a'), () => {
            jest.useFakeTimers();

            resourceMonitor.startMonitoring(1000);

            expect(resourceMonitor.updateInterval).toBeDefined();

            jest.advanceTimersByTime(1000);

            jest.useRealTimers();
        });

        test(t('tests:validation_98386a3e'), () => {
            jest.useFakeTimers();

            resourceMonitor.startMonitoring(1000);
            const firstInterval = resourceMonitor.updateInterval;

            resourceMonitor.startMonitoring(2000);
            const secondInterval = resourceMonitor.updateInterval;

            expect(firstInterval).not.toBe(secondInterval);

            jest.useRealTimers();
        });
    });

    describe('stopMonitoring', () => {
        test(t('tests:validation_599386fa'), () => {
            jest.useFakeTimers();

            resourceMonitor.startMonitoring(1000);
            resourceMonitor.stopMonitoring();

            expect(resourceMonitor.updateInterval).toBeNull();

            jest.useRealTimers();
        });
    });

    describe('updateFromIPC', () => {
        test(t('tests:validation_140d448a'), () => {
            const usage = resourceMonitor.updateFromIPC(1, { cpu: 12.345, memory: 50.678 });

            expect(usage).toEqual({ botId: 1, cpu: 12.3, memory: 50.7 });
            expect(resourceMonitor.getResourceUsage(1)).toEqual({ botId: 1, cpu: 12.3, memory: 50.7 });
        });

        test(t('tests:validation_9b14b50d'), () => {
            resourceMonitor.updateFromIPC(null, { cpu: 1, memory: 2 });
            expect(resourceMonitor.getAllResourceUsage()).toEqual([]);
        });

        test(t('tests:validation_0ff7b1b2'), () => {
            const usage = resourceMonitor.updateFromIPC(2, { cpu: 'foo', memory: 'bar' });
            expect(usage.cpu).toBeNaN();
            expect(usage.memory).toBeNaN();
        });
    });

    describe('updateAllResourceUsage', () => {
        test(t('tests:validation_92d879d3'), async () => {
            mockProcessManager.getAllProcesses.mockReturnValue(new Map());

            const result = await resourceMonitor.updateAllResourceUsage();

            expect(result).toEqual([]);
        });

        test(t('tests:validation_abb3ff44'), async () => {
            const processes = new Map([
                [1, { pid: 1234 }],
                [2, { pid: 5678 }]
            ]);
            mockProcessManager.getAllProcesses.mockReturnValue(processes);

            resourceMonitor.updateFromIPC(1, { cpu: 15.5, memory: 50 });
            resourceMonitor.updateFromIPC(2, { cpu: 8.2, memory: 30 });

            const results = await resourceMonitor.updateAllResourceUsage();

            expect(results).toHaveLength(2);
            expect(results).toContainEqual({ botId: 1, cpu: 15.5, memory: 50 });
            expect(results).toContainEqual({ botId: 2, cpu: 8.2, memory: 30 });
        });

        test(t('tests:validation_7729f696'), async () => {
            const processes = new Map([
                [1, { pid: 1234 }]
            ]);
            mockProcessManager.getAllProcesses.mockReturnValue(processes);

            resourceMonitor.updateFromIPC(1, { cpu: 10, memory: 50 });
            resourceMonitor.updateFromIPC(99, { cpu: 99, memory: 999 });

            const results = await resourceMonitor.updateAllResourceUsage();

            expect(results).toHaveLength(1);
            expect(results[0].botId).toBe(1);
            expect(resourceMonitor.getResourceUsage(99)).toBeUndefined();
        });

        test(t('tests:validation_6898091f'), async () => {
            mockProcessManager.getAllProcesses.mockReturnValue(new Map());

            resourceMonitor.updateFromIPC(1, { cpu: 10, memory: 50 });

            const results = await resourceMonitor.updateAllResourceUsage();

            expect(results).toEqual([]);
            expect(resourceMonitor.getAllResourceUsage()).toEqual([]);
        });
    });

    describe('getBotIdByPid', () => {
        test(t('tests:validation_927e6550'), () => {
            const mockChild1 = { pid: 1234 };
            const mockChild2 = { pid: 5678 };

            mockProcessManager.getAllProcesses.mockReturnValue(new Map([
                [1, mockChild1],
                [2, mockChild2]
            ]));

            const botId = resourceMonitor.getBotIdByPid(5678);

            expect(botId).toBe(2);
        });

        test(t('tests:validation_bd697a79'), () => {
            mockProcessManager.getAllProcesses.mockReturnValue(new Map());

            const botId = resourceMonitor.getBotIdByPid(9999);

            expect(botId).toBeNull();
        });
    });

    describe('getResourceUsage', () => {
        test(t('tests:validation_327fc9c4'), () => {
            resourceMonitor.resourceUsage.set(1, {
                botId: 1,
                cpu: 10.5,
                memory: 45
            });

            const usage = resourceMonitor.getResourceUsage(1);

            expect(usage).toEqual({
                botId: 1,
                cpu: 10.5,
                memory: 45
            });
        });

        test(t('tests:validation_69dbac4d'), () => {
            const usage = resourceMonitor.getResourceUsage(999);

            expect(usage).toBeUndefined();
        });
    });

    describe('getAllResourceUsage', () => {
        test(t('tests:validation_c1ba2f41'), () => {
            resourceMonitor.resourceUsage.set(1, { botId: 1, cpu: 10, memory: 50 });
            resourceMonitor.resourceUsage.set(2, { botId: 2, cpu: 5, memory: 30 });

            const all = resourceMonitor.getAllResourceUsage();

            expect(all).toHaveLength(2);
            expect(all).toContainEqual({ botId: 1, cpu: 10, memory: 50 });
            expect(all).toContainEqual({ botId: 2, cpu: 5, memory: 30 });
        });
    });

    describe('clearResourceUsage', () => {
        test(t('tests:validation_66b1cfe6'), () => {
            resourceMonitor.resourceUsage.set(1, { botId: 1, cpu: 10, memory: 50 });

            resourceMonitor.clearResourceUsage(1);

            expect(resourceMonitor.resourceUsage.has(1)).toBe(false);
        });
    });
});
