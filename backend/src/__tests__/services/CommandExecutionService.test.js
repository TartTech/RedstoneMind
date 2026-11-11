const CommandExecutionService = require('../../core/services/CommandExecutionService');
const UserService = require('../../core/UserService');
const { t } = require('../../i18n');

jest.mock('../../core/UserService');

describe('CommandExecutionService', () => {
    let service;
    let mockProcessManager;
    let mockCacheManager;
    let mockEventGraphManager;
    let mockCommandRepository;
    let mockPermissionRepository;
    let mockGroupRepository;
    let mockLogger;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        mockProcessManager = {
            getProcess: jest.fn(),
            addCommandRequest: jest.fn()
        };

        mockCacheManager = {
            getBotConfig: jest.fn(),
            getOrLoadBotConfig: jest.fn(),
            deleteBotConfig: jest.fn()
        };

        mockEventGraphManager = {
            handleEvent: jest.fn()
        };

        mockCommandRepository = {
            findByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        };

        mockPermissionRepository = {
            findByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            prisma: {}
        };

        mockGroupRepository = {
            findByName: jest.fn(),
            upsertGroup: jest.fn(),
            addPermissionToGroup: jest.fn()
        };

        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        };

        service = new CommandExecutionService({
            botProcessManager: mockProcessManager,
            cacheManager: mockCacheManager,
            eventGraphManager: mockEventGraphManager,
            commandRepository: mockCommandRepository,
            permissionRepository: mockPermissionRepository,
            groupRepository: mockGroupRepository,
            logger: mockLogger
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('sendMessageToBot', () => {
        test(t('tests:validation_1e523d55'), () => {
            const mockSendMessage = jest.fn();
            const mockChild = {
                api: {
                    sendMessage: mockSendMessage
                }
            };
            mockProcessManager.getProcess.mockReturnValue(mockChild);

            const result = service.sendMessageToBot(1, 'Hello', 'chat', 'Player1');

            expect(mockSendMessage).toHaveBeenCalledWith('chat', 'Hello', 'Player1');
            expect(result.success).toBe(true);
        });

        test(t('tests:validation_7c552ae1'), () => {
            mockProcessManager.getProcess.mockReturnValue(null);

            const result = service.sendMessageToBot(1, 'Hello');

            expect(result.success).toBe(false);
            expect(result.message).toContain(t('tests:msg_5075a7c6'));
        });
    });

    describe('validateAndExecuteCommandForApi', () => {
        test(t('tests:validation_be742cdd'), async () => {
            mockProcessManager.getProcess.mockReturnValue(null);

            await expect(
                service.validateAndExecuteCommandForApi(1, 'Player1', 'test', {})
            ).rejects.toThrow('Bot configuration not found');
        });

        test(t('tests:validation_15332675'), async () => {
            mockProcessManager.getProcess.mockReturnValue({
                botConfig: { id: 1 }
            });
            mockCacheManager.getOrLoadBotConfig.mockResolvedValue({
                commands: new Map(),
                commandAliases: new Map(),
                permissionsById: new Map(),
            });
            UserService.getUser.mockResolvedValue({
                isBlacklisted: false,
                isOwner: false,
                username: 'Player1',
                hasPermission: () => false,
            });

            await expect(
                service.validateAndExecuteCommandForApi(1, 'Player1', 'test', {})
            ).rejects.toThrow('not found or is disabled');
            expect(mockCacheManager.getOrLoadBotConfig).toHaveBeenCalledWith(1);
        });

        test(t('tests:validation_8096987c'), async () => {
            const mockUser = {
                isBlacklisted: true,
                username: 'Player1'
            };

            mockProcessManager.getProcess.mockReturnValue({
                botConfig: { id: 1 }
            });
            mockCacheManager.getOrLoadBotConfig.mockResolvedValue({
                commands: new Map(),
                commandAliases: new Map()
            });
            UserService.getUser.mockResolvedValue(mockUser);

            await expect(
                service.validateAndExecuteCommandForApi(1, 'Player1', 'test', {})
            ).rejects.toThrow('is blacklisted');
        });

        test(t('tests:validation_e6543f18'), async () => {
            const mockUser = {
                isBlacklisted: false,
                isOwner: false,
                username: 'Player1'
            };

            mockProcessManager.getProcess.mockReturnValue({
                botConfig: { id: 1 }
            });
            mockCacheManager.getOrLoadBotConfig.mockResolvedValue({
                commands: new Map(),
                commandAliases: new Map()
            });
            UserService.getUser.mockResolvedValue(mockUser);

            await expect(
                service.validateAndExecuteCommandForApi(1, 'Player1', 'nonexistent', {})
            ).rejects.toThrow('not found or is disabled');
        });

        test(t('tests:validation_0841f60a'), async () => {
            const mockUser = {
                isBlacklisted: false,
                isOwner: false,
                username: 'Player1',
                hasPermission: jest.fn(() => false)
            };

            const mockCommand = {
                name: 'test',
                isEnabled: true,
                permissionId: 1,
                cooldown: 0
            };

            mockProcessManager.getProcess.mockReturnValue({
                botConfig: { id: 1 }
            });
            mockCacheManager.getOrLoadBotConfig.mockResolvedValue({
                commands: new Map([['test', mockCommand]]),
                commandAliases: new Map(),
                permissionsById: new Map([[1, { id: 1, name: 'admin.test' }]])
            });
            UserService.getUser.mockResolvedValue(mockUser);

            await expect(
                service.validateAndExecuteCommandForApi(1, 'Player1', 'test', {})
            ).rejects.toThrow('insufficient permissions');
        });
    });

    describe('_executeCommandInProcess', () => {
        test(t('tests:validation_b1d71a17'), async () => {
            mockProcessManager.getProcess.mockReturnValue(null);

            const mockUser = { username: 'Player1', id: 1 };

            await expect(
                service._executeCommandInProcess(1, 'test', {}, mockUser, 'websocket')
            ).rejects.toThrow('Bot is not running');
        });

        test(t('tests:validation_df5eca68'), async () => {
            mockProcessManager.getProcess.mockReturnValue({ killed: true });

            const mockUser = { username: 'Player1', id: 1 };

            await expect(
                service._executeCommandInProcess(1, 'test', {}, mockUser, 'websocket')
            ).rejects.toThrow('Bot is not running');
        });

        test(t('tests:success_46b16bff'), async () => {
            const mockChild = {
                killed: false,
                send: jest.fn()
            };
            mockProcessManager.getProcess.mockReturnValue(mockChild);

            mockProcessManager.addCommandRequest.mockImplementation((requestId, handler) => {
                setTimeout(() => {
                    handler.resolve({ success: true });
                }, 100);
            });

            const mockUser = { username: 'Player1', id: 1 };
            const promise = service._executeCommandInProcess(1, 'test', {}, mockUser, 'websocket');

            jest.advanceTimersByTime(100);
            const result = await promise;

            expect(result.success).toBe(true);
            expect(mockChild.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'execute_command_request'
                })
            );
        });

        test(t('tests:validation_0b87e35c'), async () => {
            const mockChild = {
                killed: false,
                send: jest.fn()
            };
            mockProcessManager.getProcess.mockReturnValue(mockChild);

            mockProcessManager.addCommandRequest.mockImplementation(() => {
                // Not вызываем resolve/reject
            });

            const mockUser = { username: 'Player1', id: 1 };
            const promise = service._executeCommandInProcess(1, 'test', {}, mockUser, 'websocket');

            jest.advanceTimersByTime(10000);

            await expect(promise).rejects.toThrow('timed out');
        });
    });

    describe('handleCommandRegistration', () => {
        test(t('tests:validation_820a7de4'), async () => {
            mockCommandRepository.findByName.mockResolvedValue(null);
            mockPermissionRepository.findByName.mockResolvedValue(null);
            mockPermissionRepository.create.mockResolvedValue({ id: 1 });

            const commandConfig = {
                name: 'test',
                description: 'Test command',
                permissions: 'admin.test',
                owner: 'system',
                aliases: ['t'],
                allowedChatTypes: ['global', 'private'],
                cooldown: 5
            };

            await service.handleCommandRegistration(1, commandConfig);

            expect(mockPermissionRepository.create).toHaveBeenCalled();
            expect(mockCommandRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    botId: 1,
                    name: 'test',
                    permissionId: 1
                })
            );
            expect(mockCacheManager.deleteBotConfig).toHaveBeenCalledWith(1);
        });

        test(t('tests:validation_c14aaae0'), async () => {
            mockCommandRepository.findByName.mockResolvedValue({ id: 10, name: 'test' });
            mockPermissionRepository.findByName.mockResolvedValue(null);
            mockPermissionRepository.create.mockResolvedValue({ id: 1 });

            const commandConfig = {
                name: 'test',
                description: 'Updated description',
                permissions: 'admin.test',
                owner: 'system'
            };

            await service.handleCommandRegistration(1, commandConfig);

            expect(mockCommandRepository.update).toHaveBeenCalledWith(
                10,
                expect.objectContaining({
                    description: 'Updated description'
                })
            );
            expect(mockCommandRepository.create).not.toHaveBeenCalled();
        });

        test(t('tests:validation_85e76a02'), async () => {
            mockCommandRepository.findByName.mockRejectedValue(new Error('DB error'));

            const commandConfig = {
                name: 'test',
                description: 'Test'
            };

            await service.handleCommandRegistration(1, commandConfig);

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('handlePermissionsRegistration', () => {
        test(t('tests:validation_54f24f0f'), async () => {
            mockPermissionRepository.findByName.mockResolvedValue(null);
            mockPermissionRepository.create.mockResolvedValue({ id: 1 });

            const permissions = [
                { name: 'admin.*', description: 'Full admin', owner: 'system' },
                { name: 'user.*', description: 'User permissions', owner: 'system' }
            ];

            await service.handlePermissionsRegistration(1, permissions);

            expect(mockPermissionRepository.create).toHaveBeenCalledTimes(2);
            expect(mockCacheManager.deleteBotConfig).toHaveBeenCalledWith(1);
        });

        test(t('tests:validation_7462da76'), async () => {
            mockPermissionRepository.findByName.mockResolvedValue({ id: 1, name: 'admin.*' });
            mockPermissionRepository.update.mockResolvedValue({ id: 1 });

            const permissions = [
                { name: 'admin.*', description: 'Updated description', owner: 'system' }
            ];

            await service.handlePermissionsRegistration(1, permissions);

            expect(mockPermissionRepository.update).toHaveBeenCalledWith(
                1,
                { description: 'Updated description' }
            );
        });

        test(t('tests:validation_42187548'), async () => {
            mockPermissionRepository.findByName.mockResolvedValue(null);
            mockPermissionRepository.create.mockResolvedValue({ id: 1 });

            const permissions = [
                { description: 'No name' }, // Нет name
                { name: 'test' }, // Нет owner
                { name: 'valid', owner: 'system' }
            ];

            await service.handlePermissionsRegistration(1, permissions);

            expect(mockLogger.warn).toHaveBeenCalledTimes(2);
            expect(mockPermissionRepository.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleGroupRegistration', () => {
        test(t('tests:validation_6fab9332'), async () => {
            mockGroupRepository.upsertGroup.mockResolvedValue({ id: 1, name: 'Admin' });

            const groupConfig = {
                name: 'Admin',
                owner: 'system',
                description: 'Administrator group'
            };

            await service.handleGroupRegistration(1, groupConfig);

            expect(mockGroupRepository.upsertGroup).toHaveBeenCalledWith(
                1,
                'Admin',
                {
                    owner: 'system',
                    description: 'Administrator group'
                }
            );
            expect(mockCacheManager.deleteBotConfig).toHaveBeenCalledWith(1);
        });

        test(t('tests:validation_81e3390a'), async () => {
            await service.handleGroupRegistration(1, { description: 'No name' });

            expect(mockLogger.warn).toHaveBeenCalled();
            expect(mockGroupRepository.upsertGroup).not.toHaveBeenCalled();
        });
    });

    describe('clearBotUserCache', () => {
        test(t('tests:msg_6a51e6b1'), () => {
            mockProcessManager.sendMessage = jest.fn();

            service.clearBotUserCache(1);
            service.clearBotUserCache(1);
            expect(mockProcessManager.sendMessage).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);

            expect(mockProcessManager.sendMessage).toHaveBeenCalledTimes(1);
            expect(mockProcessManager.sendMessage).toHaveBeenCalledWith(1, { type: 'invalidate_all_user_cache' });
        });
    });

    describe('handleAddPermissionsToGroup', () => {
        test(t('tests:validation_87905bc1'), async () => {
            mockGroupRepository.findByName.mockResolvedValue({ id: 1, name: 'Admin' });
            mockGroupRepository.addPermissionToGroup.mockResolvedValue(undefined);
            mockPermissionRepository.findByName.mockImplementation((botId, name) =>
                Promise.resolve({ id: 10 + name.length, name })
            );

            const message = {
                groupName: 'Admin',
                permissionNames: ['admin.*', 'user.*']
            };

            await service.handleAddPermissionsToGroup(1, message);

            expect(mockGroupRepository.findByName).toHaveBeenCalledWith(1, 'Admin');
            expect(mockGroupRepository.addPermissionToGroup).toHaveBeenCalledTimes(2);
            expect(mockCacheManager.deleteBotConfig).toHaveBeenCalledWith(1);
        });

        test(t('tests:validation_9e707477'), async () => {
            mockGroupRepository.findByName.mockResolvedValue(null);

            const message = {
                groupName: 'NonExistent',
                permissionNames: ['admin.*']
            };

            await service.handleAddPermissionsToGroup(1, message);

            expect(mockLogger.warn).toHaveBeenCalled();
            expect(mockGroupRepository.addPermissionToGroup).not.toHaveBeenCalled();
        });

        test(t('tests:validation_4fc40ab7'), async () => {
            mockGroupRepository.findByName.mockResolvedValue({ id: 1, name: 'Admin' });
            mockGroupRepository.addPermissionToGroup.mockResolvedValue(undefined);
            mockPermissionRepository.findByName.mockImplementation((botId, name) => {
                if (name === 'admin.*') return Promise.resolve({ id: 1, name });
                return Promise.resolve(null);
            });

            const message = {
                groupName: 'Admin',
                permissionNames: ['admin.*', 'nonexistent']
            };

            await service.handleAddPermissionsToGroup(1, message);

            expect(mockGroupRepository.addPermissionToGroup).toHaveBeenCalledTimes(1);
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('cooldown reservation', () => {
        const validationMessage = {
            commandName: 'ping',
            username: 'p',
            args: {},
            typeChat: 'chat',
            commandArgs: [],
        };

        function mockPingCommand() {
            const user = {
                id: 42,
                isOwner: false,
                isBlacklisted: false,
                username: 'p',
                hasPermission: () => false,
            };
            UserService.getUser.mockResolvedValue(user);
            mockCacheManager.getOrLoadBotConfig.mockResolvedValue({
                commands: new Map([['ping', {
                    name: 'ping',
                    isEnabled: true,
                    cooldown: 10,
                    allowedChatTypes: '["chat"]',
                    permissionId: null,
                }]]),
                commandAliases: new Map(),
                permissionsById: new Map(),
            });
            mockProcessManager.getProcess.mockReturnValue({ send: jest.fn() });
        }

        test(t('tests:msg_f9874eb1'), async () => {
            mockPingCommand();
            const botConfig = { id: 7, prefix: '@' };

            await service.handleCommandValidation(botConfig, validationMessage);
            const child = mockProcessManager.getProcess();
            const started = child.send.mock.calls.map((call) => call[0]).find((message) => message.type === 'execute_handler');
            expect(started.cooldownKey).toBe('7:ping:42');

            child.send.mockClear();
            await service.handleCommandValidation(botConfig, validationMessage);
            expect(child.send.mock.calls.map((call) => call[0].type)).toContain('handle_cooldown');

            service.releaseCooldown(started.cooldownKey, started.cooldownStamp);
            child.send.mockClear();
            await service.handleCommandValidation(botConfig, validationMessage);
            expect(child.send.mock.calls.map((call) => call[0].type)).toContain('execute_handler');
        });
    });
});
