const PermissionRepository = require('../../repositories/PermissionRepository');
const { t } = require('../../i18n');

describe('PermissionRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            permission: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                upsert: jest.fn(),
            }
        };

        repository = new PermissionRepository({ prisma: mockPrisma });
    });

    test('должен установить modelName как "permission"', () => {
        expect(repository.modelName).toBe('permission');
    });

    describe('findByBotId', () => {
        test(t('tests:validation_1deb431d'), async () => {
            const mockPermissions = [
                { id: 1, botId: 1, name: 'admin.*' },
                { id: 2, botId: 1, name: 'user.say' }
            ];
            mockPrisma.permission.findMany.mockResolvedValue(mockPermissions);

            const results = await repository.findByBotId(1);

            expect(mockPrisma.permission.findMany).toHaveBeenCalledWith({
                where: { botId: 1 },
                orderBy: { name: 'asc' }
            });
            expect(results).toEqual(mockPermissions);
        });
    });

    describe('findByName', () => {
        test(t('tests:validation_880032e8'), async () => {
            const mockPermission = {
                id: 1,
                botId: 1,
                name: 'admin.ban'
            };
            mockPrisma.permission.findUnique.mockResolvedValue(mockPermission);

            const result = await repository.findByName(1, 'admin.ban');

            expect(mockPrisma.permission.findUnique).toHaveBeenCalledWith({
                where: {
                    botId_name: { botId: 1, name: 'admin.ban' }
                }
            });
            expect(result).toEqual(mockPermission);
        });
    });

    describe('upsertPermission', () => {
        test(t('tests:validation_a8c8a128'), async () => {
            const newPermission = {
                id: 1,
                botId: 1,
                name: 'user.fly',
                description: t('tests:msg_9f960af8')
            };
            mockPrisma.permission.upsert.mockResolvedValue(newPermission);

            const result = await repository.upsertPermission(1, 'user.fly', {
                description: t('tests:msg_9f960af8'),
                owner: 'plugin'
            });

            expect(mockPrisma.permission.upsert).toHaveBeenCalledWith({
                where: {
                    botId_name: { botId: 1, name: 'user.fly' }
                },
                update: {
                    description: t('tests:msg_9f960af8'),
                    owner: 'plugin'
                },
                create: {
                    botId: 1,
                    name: 'user.fly',
                    description: t('tests:msg_9f960af8'),
                    owner: 'plugin'
                }
            });
            expect(result).toEqual(newPermission);
        });

        test(t('tests:validation_55fda64d'), async () => {
            const updatedPermission = {
                id: 1,
                botId: 1,
                name: 'admin.*',
                description: t('tests:success_d9548cc4')
            };
            mockPrisma.permission.upsert.mockResolvedValue(updatedPermission);

            const result = await repository.upsertPermission(1, 'admin.*', {
                description: t('tests:success_d9548cc4')
            });

            expect(result).toEqual(updatedPermission);
        });
    });

    describe('findSystemPermissions', () => {
        test(t('tests:validation_0aacaaca'), async () => {
            const mockPermissions = [
                { id: 1, botId: 1, name: 'admin.*', owner: 'system' },
                { id: 2, botId: 1, name: 'user.*', owner: 'system' }
            ];
            mockPrisma.permission.findMany.mockResolvedValue(mockPermissions);

            const results = await repository.findSystemPermissions(1);

            expect(mockPrisma.permission.findMany).toHaveBeenCalledWith({
                where: {
                    botId: 1,
                    owner: 'system'
                }
            });
            expect(results).toEqual(mockPermissions);
        });
    });
});
