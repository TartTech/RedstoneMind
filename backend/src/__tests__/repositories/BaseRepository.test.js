const BaseRepository = require('../../repositories/BaseRepository');
const { t } = require('../../i18n');

describe('BaseRepository', () => {
    let repository;
    let mockPrisma;

    beforeEach(() => {
        // Mock Prisma client
        mockPrisma = {
            testModel: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
            }
        };

        repository = new BaseRepository({ prisma: mockPrisma });
        repository.modelName = 'testModel';
    });

    describe('findById', () => {
        test(t('tests:validation_851a0baf'), async () => {
            const mockResult = { id: 1, name: 'Test' };
            mockPrisma.testModel.findUnique.mockResolvedValue(mockResult);

            const result = await repository.findById(1);

            expect(mockPrisma.testModel.findUnique).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('findMany', () => {
        test(t('tests:validation_768f6ced'), async () => {
            const mockResults = [{ id: 1 }, { id: 2 }];
            mockPrisma.testModel.findMany.mockResolvedValue(mockResults);

            const results = await repository.findMany();

            expect(mockPrisma.testModel.findMany).toHaveBeenCalledWith({
                where: {}
            });
            expect(results).toEqual(mockResults);
        });

        test(t('tests:validation_b9a5d93a'), async () => {
            const mockResults = [{ id: 1, status: 'active' }];
            mockPrisma.testModel.findMany.mockResolvedValue(mockResults);

            const results = await repository.findMany({ status: 'active' });

            expect(mockPrisma.testModel.findMany).toHaveBeenCalledWith({
                where: { status: 'active' }
            });
            expect(results).toEqual(mockResults);
        });

        test(t('tests:validation_9e00dd42'), async () => {
            const mockResults = [{ id: 1 }];
            mockPrisma.testModel.findMany.mockResolvedValue(mockResults);

            const results = await repository.findMany(
                { status: 'active' },
                { orderBy: { createdAt: 'desc' }, take: 10 }
            );

            expect(mockPrisma.testModel.findMany).toHaveBeenCalledWith({
                where: { status: 'active' },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
            expect(results).toEqual(mockResults);
        });
    });

    describe('create', () => {
        test(t('tests:validation_313bfc2a'), async () => {
            const newData = { name: 'New Item' };
            const mockResult = { id: 1, ...newData };
            mockPrisma.testModel.create.mockResolvedValue(mockResult);

            const result = await repository.create(newData);

            expect(mockPrisma.testModel.create).toHaveBeenCalledWith({
                data: newData
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('update', () => {
        test(t('tests:validation_0c98e11f'), async () => {
            const updateData = { name: 'Updated' };
            const mockResult = { id: 1, ...updateData };
            mockPrisma.testModel.update.mockResolvedValue(mockResult);

            const result = await repository.update(1, updateData);

            expect(mockPrisma.testModel.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateData
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('delete', () => {
        test(t('tests:validation_e55857e5'), async () => {
            const mockResult = { id: 1 };
            mockPrisma.testModel.delete.mockResolvedValue(mockResult);

            const result = await repository.delete(1);

            expect(mockPrisma.testModel.delete).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('count', () => {
        test(t('tests:validation_7325e010'), async () => {
            mockPrisma.testModel.count.mockResolvedValue(42);

            const result = await repository.count({ status: 'active' });

            expect(mockPrisma.testModel.count).toHaveBeenCalledWith({
                where: { status: 'active' }
            });
            expect(result).toBe(42);
        });
    });

    describe('model getter', () => {
        test(t('tests:validation_e42266c1'), () => {
            const model = repository.model;
            expect(model).toBe(mockPrisma.testModel);
        });
    });
});
