// Создаём глобальные моки for Prisma методов
const mockUserFindUnique = jest.fn();
const mockUserUpsert = jest.fn();
const mockUserUpdate = jest.fn();
const mockBotFindUnique = jest.fn();
const mockGroupFindUnique = jest.fn();
const mockUserGroupFindUnique = jest.fn();
const mockUserGroupCreate = jest.fn();
const mockUserGroupDelete = jest.fn();
const mockUserGroupCount = jest.fn();

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                findUnique: mockUserFindUnique,
                upsert: mockUserUpsert,
                update: mockUserUpdate,
            },
            bot: {
                findUnique: mockBotFindUnique,
            },
            group: {
                findUnique: mockGroupFindUnique,
            },
            userGroup: {
                findUnique: mockUserGroupFindUnique,
                create: mockUserGroupCreate,
                delete: mockUserGroupDelete,
                count: mockUserGroupCount,
            },
        })),
    };
});

const User = require('../../core/UserService');
const { t } = require('../../i18n');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        User.cache.clear();
    });

    afterEach(() => {
        User.cache.clear();
    });

    describe('User constructor', () => {
        test(t('tests:validation_e5bea78a'), () => {
            const userInstance = {
                id: 1,
                username: 'TestOwner',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: 'TestOwner',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.isOwner).toBe(true);
            expect(user.username).toBe('TestOwner');
            expect(user.id).toBe(1);
        });

        test(t('tests:validation_a6acecf3'), () => {
            const userInstance = {
                id: 1,
                username: 'RegularUser',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: 'SomeoneElse',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.isOwner).toBe(false);
        });

        test(t('tests:validation_5a7b4f54'), () => {
            const userInstance = {
                id: 1,
                username: 'merka',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'mc.mineblaze.net' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.isOwner).toBe(true);
        });

        test(t('tests:validation_b21a46bf'), () => {
            const userInstance = {
                id: 1,
                username: 'TestUser',
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Admin',
                            permissions: [
                                { permission: { name: 'admin.*' } },
                                { permission: { name: 'user.*' } },
                            ],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.permissionsSet.has('admin.*')).toBe(true);
            expect(user.permissionsSet.has('user.*')).toBe(true);
        });
    });

    describe('isBlacklisted getter', () => {
        test(t('tests:validation_963bc88f'), () => {
            const userInstance = {
                id: 1,
                username: 'Owner',
                isBlacklisted: true,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: 'Owner',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.isBlacklisted).toBe(false);
        });

        test(t('tests:validation_8fac3395'), () => {
            const userInstance = {
                id: 1,
                username: 'BadUser',
                isBlacklisted: true,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.isBlacklisted).toBe(true);
        });
    });

    describe('hasPermission', () => {
        test(t('tests:validation_10a8df2d'), () => {
            const userInstance = {
                id: 1,
                username: 'Owner',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: 'Owner',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasPermission('any.permission')).toBe(true);
            expect(user.hasPermission('admin.delete')).toBe(true);
        });

        test(t('tests:validation_275dc752'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasPermission(null)).toBe(false);
            expect(user.hasPermission('')).toBe(false);
        });

        test(t('tests:validation_06dffe49'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Moderator',
                            permissions: [{ permission: { name: 'user.say' } }],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasPermission('user.say')).toBe(true);
            expect(user.hasPermission('user.kick')).toBe(false);
        });

        test(t('tests:validation_5d122732'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Admin',
                            permissions: [{ permission: { name: 'admin.*' } }],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasPermission('admin.kick')).toBe(true);
            expect(user.hasPermission('admin.ban')).toBe(true);
            expect(user.hasPermission('admin.delete')).toBe(true);
            expect(user.hasPermission('user.say')).toBe(false);
        });

        test(t('tests:validation_530398fe'), () => {
            const userInstance = {
                id: 1,
                username: 'SuperAdmin',
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'SuperAdmin',
                            permissions: [{ permission: { name: '*' } }],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasPermission('admin.anything')).toBe(true);
            expect(user.hasPermission('user.anything')).toBe(true);
            expect(user.hasPermission('custom.permission')).toBe(true);
        });
    });

    describe('hasGroup', () => {
        test(t('tests:validation_f7c9271d'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [
                    { group: { name: 'Admin' } },
                    { group: { name: 'Moderator' } },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasGroup('Admin')).toBe(true);
            expect(user.hasGroup('admin')).toBe(true); // case-insensitive
            expect(user.hasGroup('Moderator')).toBe(true);
        });

        test(t('tests:validation_d6b86b27'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [{ group: { name: 'User' } }],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasGroup('Admin')).toBe(false);
        });

        test(t('tests:validation_2b735dec'), () => {
            const userInstance = {
                id: 1,
                username: 'User',
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            expect(user.hasGroup('Admin')).toBe(false);
        });
    });

    describe('setBlacklist', () => {
        test(t('tests:validation_9bdd0189'), async () => {
            const updatedUser = {
                id: 1,
                username: 'BadUser',
                botId: 1,
                isBlacklisted: true,
                groups: [],
            };

            mockUserUpdate.mockResolvedValue(updatedUser);

            const userInstance = {
                id: 1,
                username: 'BadUser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.server.com' },
            };

            const user = new User(userInstance, botConfig);

            await user.setBlacklist(true);

            expect(mockUserUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isBlacklisted: true },
            });

            expect(user.user.isBlacklisted).toBe(true);
        });
    });

    describe('clearCache', () => {
        test(t('tests:validation_684b186f'), () => {
            User.cache.set('1:testuser', {});
            User.cache.set('1:anotheruser', {});

            User.clearCache('TestUser', 1);

            expect(User.cache.has('1:testuser')).toBe(false);
            expect(User.cache.has('1:anotheruser')).toBe(true);
        });

        test(t('tests:validation_b473b940'), () => {
            expect(() => User.clearCache(null, null)).not.toThrow();
            expect(() => User.clearCache('', '')).not.toThrow();
        });
    });

    describe('getUser', () => {
        test(t('tests:validation_38e53a17'), async () => {
            await expect(User.getUser(null, 1)).rejects.toThrow(
                t('tests:validation_74db81a7')
            );
        });

        test(t('tests:validation_99bd823e'), async () => {
            await expect(User.getUser('TestUser', null)).rejects.toThrow(
                t('tests:validation_74db81a7')
            );
        });

        test(t('tests:validation_bc1274ff'), async () => {
            const cachedUser = new User(
                { id: 1, username: 'testuser', isBlacklisted: false, groups: [] },
                { id: 1, owners: '', server: { host: 'test.com' } }
            );

            User.cache.set('1:testuser', cachedUser);

            const user = await User.getUser('TestUser', 1);

            expect(user).toBe(cachedUser);
            expect(mockUserFindUnique).not.toHaveBeenCalled();
        });

        test(t('tests:validation_8b2f1478'), async () => {
            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const defaultGroup = {
                id: 1,
                name: 'User',
            };

            const newUser = {
                id: 1,
                username: 'newuser',
                botId: 1,
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'User',
                            permissions: [],
                        },
                    },
                ],
            };

            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(null);
            mockGroupFindUnique.mockResolvedValue(defaultGroup);
            mockUserUpsert.mockResolvedValue(newUser);

            const user = await User.getUser('NewUser', 1);

            expect(user).toBeInstanceOf(User);
            expect(user.username).toBe('newuser');
            expect(mockUserUpsert).toHaveBeenCalled();
        });

        test(t('tests:validation_124c0d1b'), async () => {
            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const existingUser = {
                id: 1,
                username: 'existinguser',
                botId: 1,
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Admin',
                            permissions: [{ permission: { name: 'admin.*' } }],
                        },
                    },
                ],
            };

            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(existingUser);

            const user = await User.getUser('ExistingUser', 1);

            expect(user).toBeInstanceOf(User);
            expect(user.username).toBe('existinguser');
            expect(user.hasPermission('admin.kick')).toBe(true);
        });

        test(t('tests:validation_84521741'), async () => {
            const botConfig = {
                id: 1,
                owners: 'TestOwner',
                server: { host: 'test.com' },
            };

            const existingUser = {
                id: 1,
                username: 'testowner',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            mockUserFindUnique.mockResolvedValue(existingUser);

            const user = await User.getUser('TestOwner', 1, botConfig);

            expect(user.isOwner).toBe(true);
            expect(mockBotFindUnique).not.toHaveBeenCalled();
        });

        test(t('tests:validation_7972d36d'), async () => {
            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const existingUser = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(existingUser);

            await User.getUser('TestUser', 1);

            expect(User.cache.has('1:testuser')).toBe(true);

            // Второй вызов must вернуть from кеша
            await User.getUser('TestUser', 1);

            expect(mockUserFindUnique).toHaveBeenCalledTimes(1);
        });

        test(t('tests:validation_2ac38df4'), async () => {
            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const newUser = {
                id: 1,
                username: 'newuser',
                botId: 1,
                isBlacklisted: false,
                groups: [], // Без групп
            };

            // Mock console.warn for verification предупреждения
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(null);
            mockGroupFindUnique.mockResolvedValue(null); // Дефолтная группа не найдена
            mockUserUpsert.mockResolvedValue(newUser);

            const user = await User.getUser('NewUser', 1);

            expect(user).toBeInstanceOf(User);
            expect(user.username).toBe('newuser');
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining(t('tests:msg_90deb400')User\t('tests:msg_e821f785'))
            );
            expect(mockUserUpsert).toHaveBeenCalled();

            consoleWarnSpy.mockRestore();
        });
    });

    describe('addGroup', () => {
        test(t('tests:validation_1aa1b2df'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            const group = { id: 5, name: 'Moderator' };
            const updatedUser = {
                ...userInstance,
                groups: [
                    {
                        group: {
                            name: 'Moderator',
                            permissions: [],
                        },
                    },
                ],
            };

            mockGroupFindUnique.mockResolvedValue(group);
            mockUserGroupFindUnique.mockResolvedValue(null); // Связь не существует
            mockUserGroupCreate.mockResolvedValue({});
            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(updatedUser);

            const result = await user.addGroup('Moderator');

            expect(mockGroupFindUnique).toHaveBeenCalledWith({
                where: { botId_name: { botId: 1, name: 'Moderator' } },
            });
            expect(mockUserGroupCreate).toHaveBeenCalledWith({
                data: { userId: 1, groupId: 5 },
            });
            expect(result).toBeInstanceOf(User);
        });

        test(t('tests:validation_0b5629cb'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            mockGroupFindUnique.mockResolvedValue(null);

            await expect(user.addGroup('NonExistent')).rejects.toThrow(
                t('tests:msg_c8659cbe')
            );
        });

        test(t('tests:validation_0f37df8f'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            const group = { id: 5, name: 'Moderator' };
            const existingLink = { userId: 1, groupId: 5 };

            mockGroupFindUnique.mockResolvedValue(group);
            mockUserGroupFindUnique.mockResolvedValue(existingLink); // Связь уже существует
            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(userInstance);

            await user.addGroup('Moderator');

            expect(mockUserGroupCreate).not.toHaveBeenCalled();
        });
    });

    describe('removeGroup', () => {
        test(t('tests:validation_064d3689'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Moderator',
                            permissions: [],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            const group = { id: 5, name: 'Moderator' };
            const updatedUser = {
                ...userInstance,
                groups: [],
            };

            mockGroupFindUnique.mockResolvedValue(group);
            mockUserGroupDelete.mockResolvedValue({});
            mockUserGroupCount.mockResolvedValue(1); // Осталась 1 группа
            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(updatedUser);

            const result = await user.removeGroup('Moderator');

            expect(mockUserGroupDelete).toHaveBeenCalledWith({
                where: { userId_groupId: { userId: 1, groupId: 5 } },
            });
            expect(result).toBeInstanceOf(User);
        });

        test(t('tests:validation_0b5629cb'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            mockGroupFindUnique.mockResolvedValue(null);

            await expect(user.removeGroup('NonExistent')).rejects.toThrow(
                t('tests:msg_c8659cbe')
            );
        });

        test(t('tests:validation_ac69d883'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [
                    {
                        group: {
                            name: 'Moderator',
                            permissions: [],
                        },
                    },
                ],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            const moderatorGroup = { id: 5, name: 'Moderator' };
            const defaultGroup = { id: 1, name: 'User' };
            const updatedUser = {
                ...userInstance,
                groups: [
                    {
                        group: {
                            name: 'User',
                            permissions: [],
                        },
                    },
                ],
            };

            mockGroupFindUnique
                .mockResolvedValueOnce(moderatorGroup) // Первый вызов для Moderator
                .mockResolvedValueOnce(defaultGroup); // Второй вызов для дефолтной группы User
            mockUserGroupDelete.mockResolvedValue({});
            mockUserGroupCount.mockResolvedValue(0); // Не осталось групп
            mockUserGroupCreate.mockResolvedValue({});
            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(updatedUser);

            await user.removeGroup('Moderator');

            expect(mockUserGroupCount).toHaveBeenCalledWith({
                where: { userId: 1 },
            });
            expect(mockGroupFindUnique).toHaveBeenCalledWith({
                where: { botId_name: { botId: 1, name: 'User' } },
            });
            expect(mockUserGroupCreate).toHaveBeenCalledWith({
                data: { userId: 1, groupId: 1 },
            });
        });
    });

    describe('refresh', () => {
        test(t('tests:validation_224fab5a'), async () => {
            const userInstance = {
                id: 1,
                username: 'testuser',
                botId: 1,
                isBlacklisted: false,
                groups: [],
            };

            const botConfig = {
                id: 1,
                owners: '',
                server: { host: 'test.com' },
            };

            const user = new User(userInstance, botConfig);

            const updatedUserInstance = {
                ...userInstance,
                isBlacklisted: true, // Изменилось
            };

            mockBotFindUnique.mockResolvedValue(botConfig);
            mockUserFindUnique.mockResolvedValue(updatedUserInstance);

            const refreshedUser = await user.refresh();

            expect(refreshedUser).toBeInstanceOf(User);
            expect(User.cache.has('1:testuser')).toBe(true);
        });
    });
});
