const BotProcessManager = require('../../core/services/BotProcessManager');
const { t } = require('../../i18n');

describe('BotProcessManager', () => {
    let processManager;
    let mockLogger;

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };

        processManager = new BotProcessManager({ logger: mockLogger });
    });

    describe('isRunning', () => {
        test(t('tests:validation_387ca7d6'), () => {
            expect(processManager.isRunning(1)).toBe(false);
        });

        test(t('tests:validation_4392ce8e'), () => {
            const mockChild = { killed: true };
            processManager.processes.set(1, mockChild);

            expect(processManager.isRunning(1)).toBe(false);
        });

        test(t('tests:validation_e6f4c69e'), () => {
            const mockChild = { killed: false };
            processManager.processes.set(1, mockChild);

            expect(processManager.isRunning(1)).toBe(true);
        });
    });

    describe('getProcess', () => {
        test(t('tests:validation_3f8b90f9'), () => {
            const mockChild = { pid: 123 };
            processManager.processes.set(1, mockChild);

            const result = processManager.getProcess(1);

            expect(result).toBe(mockChild);
        });

        test(t('tests:validation_3200e395'), () => {
            const result = processManager.getProcess(999);

            expect(result).toBeUndefined();
        });
    });

    describe('getAllProcesses', () => {
        test(t('tests:validation_afd9897a'), () => {
            const mockChild1 = { pid: 123 };
            const mockChild2 = { pid: 456 };

            processManager.processes.set(1, mockChild1);
            processManager.processes.set(2, mockChild2);

            const result = processManager.getAllProcesses();

            expect(result).toBeInstanceOf(Map);
            expect(result.size).toBe(2);
            expect(result.get(1)).toBe(mockChild1);
            expect(result.get(2)).toBe(mockChild2);
        });
    });

    describe('sendMessage', () => {
        test(t('tests:validation_ff635e7b'), () => {
            const mockChild = {
                killed: false,
                send: jest.fn()
            };
            processManager.processes.set(1, mockChild);

            const message = { type: 'test', data: 'hello' };
            const result = processManager.sendMessage(1, message);

            expect(mockChild.send).toHaveBeenCalledWith(message);
            expect(result).toBe(true);
        });

        test(t('tests:validation_387ca7d6'), () => {
            const result = processManager.sendMessage(999, { type: 'test' });

            expect(result).toBe(false);
        });

        test(t('tests:validation_4392ce8e'), () => {
            const mockChild = {
                killed: true,
                send: jest.fn()
            };
            processManager.processes.set(1, mockChild);

            const result = processManager.sendMessage(1, { type: 'test' });

            expect(mockChild.send).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('kill', () => {
        test(t('tests:validation_4388df8a'), () => {
            const mockChild = {
                killed: false,
                kill: jest.fn()
            };
            processManager.processes.set(1, mockChild);

            const result = processManager.kill(1);

            expect(mockChild.kill).toHaveBeenCalledWith('SIGTERM');
            expect(result).toBe(true);
        });

        test(t('tests:validation_13cd4d89'), () => {
            const mockChild = {
                killed: false,
                kill: jest.fn()
            };
            processManager.processes.set(1, mockChild);

            processManager.kill(1, 'SIGKILL');

            expect(mockChild.kill).toHaveBeenCalledWith('SIGKILL');
        });

        test(t('tests:validation_387ca7d6'), () => {
            const result = processManager.kill(999);

            expect(result).toBe(false);
        });
    });

    describe('remove', () => {
        test(t('tests:validation_066e39e9'), () => {
            const mockChild = { pid: 123 };
            processManager.processes.set(1, mockChild);

            processManager.remove(1);

            expect(processManager.processes.has(1)).toBe(false);
        });
    });

    describe('Plugin UI subscriptions', () => {
        let mockSocket;

        beforeEach(() => {
            mockSocket = {
                id: 'socket-123',
                emit: jest.fn()
            };
        });

        describe('subscribeToPluginUi', () => {
            test(t('tests:validation_86a5d9f2'), () => {
                const mockChild = {
                    killed: false,
                    send: jest.fn()
                };
                processManager.processes.set(1, mockChild);

                processManager.subscribeToPluginUi(1, 'test-plugin', mockSocket);

                const subscribers = processManager.getPluginSubscribers(1, 'test-plugin');
                expect(subscribers).toBeInstanceOf(Set);
                expect(subscribers.has(mockSocket)).toBe(true);
                expect(mockChild.send).toHaveBeenCalledWith({
                    type: 'plugin:ui:start-updates',
                    pluginName: 'test-plugin'
                });
            });

            test(t('tests:validation_e34a6677'), () => {
                processManager.subscribeToPluginUi(1, 'test-plugin', mockSocket);

                const subscribers = processManager.getPluginSubscribers(1, 'test-plugin');
                expect(subscribers.has(mockSocket)).toBe(true);
            });
        });

        describe('unsubscribeFromPluginUi', () => {
            test(t('tests:validation_ca583908'), () => {
                const mockChild = {
                    killed: false,
                    send: jest.fn()
                };
                processManager.processes.set(1, mockChild);

                processManager.subscribeToPluginUi(1, 'test-plugin', mockSocket);
                processManager.unsubscribeFromPluginUi(1, 'test-plugin', mockSocket);

                expect(mockChild.send).toHaveBeenCalledWith({
                    type: 'plugin:ui:stop-updates',
                    pluginName: 'test-plugin'
                });
            });

            test(t('tests:validation_45e68df7'), () => {
                processManager.subscribeToPluginUi(1, 'test-plugin', mockSocket);
                processManager.unsubscribeFromPluginUi(1, 'test-plugin', mockSocket);

                const botSubscriptions = processManager.uiSubscriptions.get(1);
                expect(botSubscriptions.has('test-plugin')).toBe(false);
            });
        });

        describe('handleSocketDisconnect', () => {
            test(t('tests:validation_3dc9216e'), () => {
                const mockChild = {
                    killed: false,
                    send: jest.fn()
                };
                processManager.processes.set(1, mockChild);

                processManager.subscribeToPluginUi(1, 'plugin1', mockSocket);
                processManager.subscribeToPluginUi(1, 'plugin2', mockSocket);
                processManager.subscribeToPluginUi(2, 'plugin3', mockSocket);

                processManager.handleSocketDisconnect(mockSocket);

                expect(processManager.getPluginSubscribers(1, 'plugin1')).toBeUndefined();
                expect(processManager.getPluginSubscribers(1, 'plugin2')).toBeUndefined();
                expect(processManager.getPluginSubscribers(2, 'plugin3')).toBeUndefined();
            });
        });
    });

    describe('Pending requests', () => {
        test(t('tests:validation_c800714f'), () => {
            const handler = { resolve: jest.fn(), timeout: {} };

            processManager.addPlayerListRequest('req-123', handler);

            expect(processManager.pendingPlayerListRequests.has('req-123')).toBe(true);
        });

        test(t('tests:validation_d94726df'), () => {
            const handler = {
                resolve: jest.fn(),
                timeout: setTimeout(() => {}, 1000)
            };
            processManager.addPlayerListRequest('req-123', handler);

            processManager.resolvePlayerListRequest('req-123', ['Player1', 'Player2']);

            expect(handler.resolve).toHaveBeenCalledWith(['Player1', 'Player2']);
            expect(processManager.pendingPlayerListRequests.has('req-123')).toBe(false);
        });

        test(t('tests:validation_07766e04'), () => {
            const handler = { resolve: jest.fn(), reject: jest.fn() };

            processManager.addCommandRequest('cmd-123', handler);

            expect(processManager.pendingCommandRequests.has('cmd-123')).toBe(true);
        });

        test(t('tests:validation_74936a2c'), () => {
            const handler = { resolve: jest.fn(), reject: jest.fn() };
            processManager.addCommandRequest('cmd-123', handler);

            processManager.resolveCommandRequest('cmd-123', { result: 'success' });

            expect(handler.resolve).toHaveBeenCalledWith({ result: 'success' });
            expect(handler.reject).not.toHaveBeenCalled();
        });

        test(t('tests:validation_9d98983e'), () => {
            const handler = { resolve: jest.fn(), reject: jest.fn() };
            processManager.addCommandRequest('cmd-123', handler);

            processManager.resolveCommandRequest('cmd-123', null, 'Error message');

            expect(handler.reject).toHaveBeenCalled();
            expect(handler.resolve).not.toHaveBeenCalled();
        });
    });
});
