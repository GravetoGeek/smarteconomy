import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/database/prisma/prisma.service'
import { LoggerService } from '@/shared/services/logger.service'
import { ConfigModule } from '@nestjs/config'
import { UserRole } from '@/users/domain/user.entity'
import { AccountType } from '@/accounts/domain/account.entity'
import { GenderType } from '@/gender/domain/entities/gender'

/**
 * Test Data Factories
 * Utility functions to create test data objects
 */
export class TestDataFactory {
    static createUserData(overrides: Partial<any> = {}) {
        return {
            email: `user${Math.random().toString(36).substring(7)}@test.com`,
            name: 'Test',
            lastname: 'User',
            birthdate: '1990-01-01',
            role: UserRole.USER,
            genderId: '550e8400-e29b-41d4-a716-446655440001',
            professionId: '660e8400-e29b-41d4-a716-446655440001',
            password: 'hashedPassword123',
            ...overrides
        }
    }

    static createUserModel(overrides: Partial<any> = {}) {
        return {
            id: `user-${Math.random().toString(36).substring(7)}`,
            email: `user${Math.random().toString(36).substring(7)}@test.com`,
            name: 'Test',
            lastname: 'User',
            birthdate: new Date('1990-01-01'),
            role: 'USER',
            genderId: '550e8400-e29b-41d4-a716-446655440001',
            professionId: '660e8400-e29b-41d4-a716-446655440001',
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides
        }
    }

    static createAccountData(overrides: Partial<any> = {}) {
        return {
            name: 'Test Account',
            type: AccountType.CHECKING,
            balance: 1000.00,
            userId: 'user-id-123',
            ...overrides
        }
    }

    static createGenderData(overrides: Partial<any> = {}) {
        return {
            gender: GenderType.MALE,
            ...overrides
        }
    }

    static createProfessionData(overrides: Partial<any> = {}) {
        return {
            profession: 'Desenvolvedor de Software',
            ...overrides
        }
    }

    static createCategoryData(overrides: Partial<any> = {}) {
        return {
            category: 'Tecnologia',
            ...overrides
        }
    }
}

/**
 * Mock Providers
 * Common mock implementations for testing
 */
export class MockProviders {
    static createMockPrismaService() {
        return {
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
                upsert: jest.fn()
            },
            account: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
                upsert: jest.fn()
            },
            gender: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
                upsert: jest.fn(),
                findFirst: jest.fn()
            },
            profession: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
                upsert: jest.fn(),
                findFirst: jest.fn()
            },
            postCategory: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
                upsert: jest.fn(),
                findFirst: jest.fn()
            },
            $connect: jest.fn(),
            $disconnect: jest.fn(),
            $transaction: jest.fn()
        }
    }

    static createMockLoggerService() {
        return {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            logError: jest.fn(),
            logInfo: jest.fn(),
            logWarning: jest.fn(),
            logDebug: jest.fn(),
            logOperation: jest.fn()
        }
    }

    static createMockUsersApplicationService() {
        return {
            createUser: jest.fn(),
            findUserById: jest.fn(),
            findUserByEmail: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            searchUsers: jest.fn()
        }
    }

    static createMockRepository<T = any>() {
        return {
            save: jest.fn(),
            findById: jest.fn(),
            findByIdOrFail: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            search: jest.fn(),
            existsById: jest.fn(),
            existsByEmail: jest.fn(),
            existsByName: jest.fn(),
            existsByGender: jest.fn(),
            existsByProfession: jest.fn(),
            existsByCategory: jest.fn(),
            findByEmail: jest.fn(),
            findByName: jest.fn(),
            findByGender: jest.fn(),
            findByProfession: jest.fn(),
            findByCategory: jest.fn(),
            findAllByUser: jest.fn(),
            sortableFields: ['id', 'name', 'createdAt', 'updatedAt']
        } as unknown as jest.Mocked<T>
    }
}

/**
 * Test Module Builder
 * Utility to create consistent test modules
 */
export class TestModuleBuilder {
    static async createTestingModule(providers: any[] = [], imports: any[] = []) {
        return await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env.test'
                }),
                ...imports
            ],
            providers: [
                {
                    provide: PrismaService,
                    useValue: MockProviders.createMockPrismaService()
                },
                {
                    provide: LoggerService,
                    useValue: MockProviders.createMockLoggerService()
                },
                ...providers
            ]
        }).compile()
    }

    static async createIntegrationTestingModule(providers: any[] = [], imports: any[] = []) {
        return await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env.test'
                }),
                ...imports
            ],
            providers: [
                PrismaService, // Real PrismaService for integration tests
                LoggerService,
                ...providers
            ]
        }).compile()
    }
}

/**
 * Test Database Utilities
 * Helper functions for database testing
 */
export class TestDatabaseUtils {
    static async clearDatabase(prisma: any) {
        // Delete in order to respect foreign key constraints
        await prisma.account.deleteMany()
        await prisma.user.deleteMany()
        await prisma.gender.deleteMany()
        await prisma.profession.deleteMany()
        await prisma.postCategory.deleteMany()
    }

    static async seedTestData(prisma: any) {
        // Create test genders
        const genders = await Promise.all([
            prisma.gender.create({
                data: {
                    id: '550e8400-e29b-41d4-a716-446655440001',
                    gender: 'Masculino'
                }
            }),
            prisma.gender.create({
                data: {
                    id: '550e8400-e29b-41d4-a716-446655440002',
                    gender: 'Feminino'
                }
            })
        ])

        // Create test professions
        const professions = await Promise.all([
            prisma.profession.create({
                data: {
                    id: '660e8400-e29b-41d4-a716-446655440001',
                    profession: 'Desenvolvedor de Software'
                }
            }),
            prisma.profession.create({
                data: {
                    id: '660e8400-e29b-41d4-a716-446655440002',
                    profession: 'Analista de Sistemas'
                }
            })
        ])

        // Create test categories
        const categories = await Promise.all([
            prisma.postCategory.create({
                data: {
                    id: '770e8400-e29b-41d4-a716-446655440001',
                    category: 'Tecnologia'
                }
            }),
            prisma.postCategory.create({
                data: {
                    id: '770e8400-e29b-41d4-a716-446655440002',
                    category: 'Finanças'
                }
            })
        ])

        return { genders, professions, categories }
    }
}

/**
 * Test Assertions
 * Custom assertion helpers
 */
export class TestAssertions {
    static expectValidUUID(value: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        expect(value).toMatch(uuidRegex)
    }

    static expectValidDate(date: Date) {
        expect(date).toBeInstanceOf(Date)
        expect(date.getTime()).not.toBeNaN()
    }

    static expectEntityStructure(entity: any, expectedProperties: string[]) {
        expectedProperties.forEach(property => {
            expect(entity).toHaveProperty(property)
        })
    }

    static expectRepositoryMethodsCalled(mockRepository: any, methods: string[]) {
        methods.forEach(method => {
            expect(mockRepository[method]).toHaveBeenCalled()
        })
    }
}

/**
 * Environment Configuration
 * Test environment setup utilities
 */
export class TestEnvironment {
    static setupTestEnvironment() {
        process.env.NODE_ENV = 'test'
        process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/smarteconomy_test'
        process.env.JWT_SECRET = 'test-secret'
    }

    static cleanupTestEnvironment() {
        delete process.env.NODE_ENV
        delete process.env.DATABASE_URL
        delete process.env.JWT_SECRET
    }
}
