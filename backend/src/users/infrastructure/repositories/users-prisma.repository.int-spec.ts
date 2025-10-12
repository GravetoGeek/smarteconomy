import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../../database/prisma/prisma.service'
import { UsersPrismaRepository } from './users-prisma.repository'
import { User, UserRole, AccountStatus } from '../../domain/user.entity'
import { LoggerService } from '../../../shared/services/logger.service'
import { TestDatabaseUtils, TestDataFactory } from '../../../__tests__/utils/test-helpers'

describe('UsersPrismaRepository Integration', () => {
    let repository: UsersPrismaRepository
    let prisma: PrismaService
    let loggerService: LoggerService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersPrismaRepository,
                PrismaService,
                LoggerService
            ]
        }).compile()

        repository = module.get<UsersPrismaRepository>(UsersPrismaRepository)
        prisma = module.get<PrismaService>(PrismaService)
        loggerService = module.get<LoggerService>(LoggerService)

        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        await TestDatabaseUtils.clearDatabase(prisma)
        const seedData = await TestDatabaseUtils.seedTestData(prisma)
    })

    describe('save', () => {
        it('should save new user successfully', async () => {
            // Arrange
            const userData = TestDataFactory.createUserData({
                email: 'integration@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const user = User.create(userData)

            // Act
            const savedUser = await repository.save(user)

            // Assert
            expect(savedUser).toBeDefined()
            expect(savedUser.id).toBe(user.id)
            expect(savedUser.email).toBe(user.email)
            expect(savedUser.name).toBe(user.name)
            expect(savedUser.lastname).toBe(user.lastname)
            expect(savedUser.role).toBe(UserRole.USER)
            expect(savedUser.status).toBe(AccountStatus.ACTIVE)
        })

        it('should update existing user', async () => {
            // Arrange
            const userData = TestDataFactory.createUserData({
                email: 'update@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const user = User.create(userData)
            await repository.save(user)

            // Modify user
            user.updateProfile('UpdatedName', 'UpdatedLastname')

            // Act
            const updatedUser = await repository.save(user)

            // Assert
            expect(updatedUser.id).toBe(user.id)
            expect(updatedUser.name).toBe('UpdatedName')
            expect(updatedUser.lastname).toBe('UpdatedLastname')
            expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.createdAt.getTime())
        })

        it('should handle different user roles', async () => {
            // Arrange
            const adminUser = User.create({
                ...TestDataFactory.createUserData(),
                email: 'admin@test.com',
                role: UserRole.ADMIN,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const regularUser = User.create({
                ...TestDataFactory.createUserData(),
                email: 'user@test.com',
                role: UserRole.USER,
                genderId: '550e8400-e29b-41d4-a716-446655440002',
                professionId: '660e8400-e29b-41d4-a716-446655440002'
            })

            // Act
            const savedAdmin = await repository.save(adminUser)
            const savedUser = await repository.save(regularUser)

            // Assert
            expect(savedAdmin.role).toBe(UserRole.ADMIN)
            expect(savedUser.role).toBe(UserRole.USER)
            expect(savedAdmin.isAdmin()).toBe(true)
            expect(savedUser.isAdmin()).toBe(false)
        })
    })

    describe('findById', () => {
        it('should find user by id', async () => {
            // Arrange
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email: 'findbyid@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const savedUser = await repository.save(user)

            // Act
            const foundUser = await repository.findById(savedUser.id)

            // Assert
            expect(foundUser).toBeDefined()
            expect(foundUser?.id).toBe(savedUser.id)
            expect(foundUser?.email).toBe(savedUser.email)
            expect(foundUser?.name).toBe(savedUser.name)
            expect(foundUser?.lastname).toBe(savedUser.lastname)
        })

        it('should return null for non-existent user', async () => {
            // Act
            const result = await repository.findById('non-existent-id')

            // Assert
            expect(result).toBeNull()
        })

        it('should reconstitute user correctly with all properties', async () => {
            // Arrange
            const originalUser = User.create({
                email: 'reconstitute@test.com',
                name: 'Test',
                lastname: 'User',
                birthdate: '1990-01-01',
                role: UserRole.ADMIN,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001',
                password: 'hashedPassword123'
            })
            await repository.save(originalUser)

            // Act
            const foundUser = await repository.findById(originalUser.id)

            // Assert
            expect(foundUser).toBeInstanceOf(User)
            expect(foundUser?.email).toBe(originalUser.email)
            expect(foundUser?.name).toBe(originalUser.name)
            expect(foundUser?.lastname).toBe(originalUser.lastname)
            expect(foundUser?.role).toBe(UserRole.ADMIN)
            expect(foundUser?.isAdmin()).toBe(true)
            expect(foundUser?.genderId).toBe(originalUser.genderId)
            expect(foundUser?.professionId).toBe(originalUser.professionId)
        })
    })

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            // Arrange
            const email = 'findbyemail@test.com'
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            await repository.save(user)

            // Act
            const foundUser = await repository.findByEmail(email)

            // Assert
            expect(foundUser).toBeDefined()
            expect(foundUser?.email).toBe(email)
            expect(foundUser?.id).toBe(user.id)
        })

        it('should return null for non-existent email', async () => {
            // Act
            const result = await repository.findByEmail('nonexistent@test.com')

            // Assert
            expect(result).toBeNull()
        })

        it('should handle case sensitivity correctly', async () => {
            // Arrange
            const email = 'CaseSensitive@Test.com'
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            await repository.save(user)

            // Act
            const foundUser = await repository.findByEmail(email.toLowerCase())

            // Assert - Depending on database collation, this might find the user or not
            // Most databases are case-insensitive for email searches
            expect(foundUser?.email.toLowerCase()).toBe(email.toLowerCase())
        })
    })

    describe('existsByEmail', () => {
        it('should return true for existing email', async () => {
            // Arrange
            const email = 'exists@test.com'
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            await repository.save(user)

            // Act
            const exists = await repository.existsByEmail(email)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent email', async () => {
            // Act
            const exists = await repository.existsByEmail('doesnotexist@test.com')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('existsById', () => {
        it('should return true for existing user id', async () => {
            // Arrange
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email: 'existsbyid@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const savedUser = await repository.save(user)

            // Act
            const exists = await repository.existsById(savedUser.id)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent user id', async () => {
            // Act
            const exists = await repository.existsById('non-existent-id')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('delete', () => {
        it('should delete user successfully', async () => {
            // Arrange
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email: 'delete@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const savedUser = await repository.save(user)

            // Act
            await repository.delete(savedUser.id)

            // Assert
            const deletedUser = await repository.findById(savedUser.id)
            expect(deletedUser).toBeNull()
        })

        it('should handle deletion of non-existent user', async () => {
            // Act & Assert
            await expect(repository.delete('non-existent-id')).rejects.toThrow()
        })
    })

    describe('search', () => {
        beforeEach(async () => {
            // Setup test data for search
            const users = [
                User.create({
                    email: 'alice@search.com',
                    name: 'Alice',
                    lastname: 'Johnson',
                    birthdate: '1990-01-01',
                    role: UserRole.USER,
                    genderId: '550e8400-e29b-41d4-a716-446655440001',
                    professionId: '660e8400-e29b-41d4-a716-446655440001',
                    password: 'password123'
                }),
                User.create({
                    email: 'bob@search.com',
                    name: 'Bob',
                    lastname: 'Smith',
                    birthdate: '1985-06-15',
                    role: UserRole.ADMIN,
                    genderId: '550e8400-e29b-41d4-a716-446655440002',
                    professionId: '660e8400-e29b-41d4-a716-446655440002',
                    password: 'password456'
                }),
                User.create({
                    email: 'charlie@search.com',
                    name: 'Charlie',
                    lastname: 'Brown',
                    birthdate: '1992-12-25',
                    role: UserRole.USER,
                    genderId: '550e8400-e29b-41d4-a716-446655440001',
                    professionId: '660e8400-e29b-41d4-a716-446655440001',
                    password: 'password789'
                })
            ]

            for (const user of users) {
                await repository.save(user)
            }
        })

        it('should search users with pagination', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 2
            })

            // Assert
            expect(result.items).toHaveLength(2)
            expect(result.total).toBe(3)
            expect(result.currentPage).toBe(1)
            expect(result.limit).toBe(2)
            expect(result.totalPages).toBe(2)
        })

        it('should filter users by name', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'Alice'
            })

            // Assert
            expect(result.items).toHaveLength(1)
            expect(result.items[0].name).toBe('Alice')
        })

        it('should sort users by specified field', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                sort: 'name',
                sortDirection: 'asc'
            })

            // Assert
            expect(result.items[0].name).toBe('Alice')
            expect(result.items[1].name).toBe('Bob')
            expect(result.items[2].name).toBe('Charlie')
        })

        it('should handle case insensitive search', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'alice'
            })

            // Assert
            expect(result.items).toHaveLength(1)
            expect(result.items[0].name).toBe('Alice')
        })

        it('should return empty result for non-matching filter', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'NonExistentUser'
            })

            // Assert
            expect(result.items).toHaveLength(0)
            expect(result.total).toBe(0)
        })
    })

    describe('findAll', () => {
        it('should return all users', async () => {
            // Arrange
            const users = [
                User.create({
                    ...TestDataFactory.createUserData(),
                    email: 'user1@findall.com',
                    genderId: '550e8400-e29b-41d4-a716-446655440001',
                    professionId: '660e8400-e29b-41d4-a716-446655440001'
                }),
                User.create({
                    ...TestDataFactory.createUserData(),
                    email: 'user2@findall.com',
                    genderId: '550e8400-e29b-41d4-a716-446655440002',
                    professionId: '660e8400-e29b-41d4-a716-446655440002'
                })
            ]

            for (const user of users) {
                await repository.save(user)
            }

            // Act
            const allUsers = await repository.findAll()

            // Assert
            expect(allUsers).toHaveLength(2)
            expect(allUsers.every(user => user instanceof User)).toBe(true)
        })

        it('should return empty array when no users exist', async () => {
            // Act
            const allUsers = await repository.findAll()

            // Assert
            expect(allUsers).toEqual([])
        })
    })

    describe('error handling', () => {
        it('should handle database connection errors gracefully', async () => {
            // Arrange
            const disconnectedPrisma = new PrismaService()
            const disconnectedRepository = new UsersPrismaRepository(disconnectedPrisma, loggerService)
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email: 'error@test.com',
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })

            // Act & Assert
            await expect(disconnectedRepository.save(user)).rejects.toThrow()
        })

        it('should handle constraint violations appropriately', async () => {
            // Arrange
            const email = 'duplicate@test.com'
            const user1 = User.create({
                ...TestDataFactory.createUserData(),
                email,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            const user2 = User.create({
                ...TestDataFactory.createUserData(),
                email,
                genderId: '550e8400-e29b-41d4-a716-446655440002',
                professionId: '660e8400-e29b-41d4-a716-446655440002'
            })

            await repository.save(user1)

            // Act & Assert
            await expect(repository.save(user2)).rejects.toThrow()
        })
    })

    describe('data integrity', () => {
        it('should maintain data consistency across operations', async () => {
            // Arrange
            const userData = {
                email: 'consistency@test.com',
                name: 'Consistency',
                lastname: 'Test',
                birthdate: '1990-01-01',
                role: UserRole.USER,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001',
                password: 'consistencyPassword123'
            }
            const user = User.create(userData)

            // Act
            const saved = await repository.save(user)
            const foundById = await repository.findById(saved.id)
            const foundByEmail = await repository.findByEmail(saved.email)
            const existsById = await repository.existsById(saved.id)
            const existsByEmail = await repository.existsByEmail(saved.email)

            // Assert
            expect(foundById?.id).toBe(saved.id)
            expect(foundByEmail?.id).toBe(saved.id)
            expect(foundById?.email).toBe(foundByEmail?.email)
            expect(existsById).toBe(true)
            expect(existsByEmail).toBe(true)
        })

        it('should handle user state changes correctly', async () => {
            // Arrange
            const user = User.create({
                ...TestDataFactory.createUserData(),
                email: 'statechange@test.com',
                role: UserRole.USER,
                genderId: '550e8400-e29b-41d4-a716-446655440001',
                professionId: '660e8400-e29b-41d4-a716-446655440001'
            })
            await repository.save(user)

            // Act - Change user state
            user.promoteToAdmin()
            user.suspend()
            user.updateProfile('NewName', 'NewLastname')

            const updatedUser = await repository.save(user)
            const retrievedUser = await repository.findById(updatedUser.id)

            // Assert
            expect(retrievedUser?.isAdmin()).toBe(true)
            expect(retrievedUser?.isSuspended()).toBe(true)
            expect(retrievedUser?.name).toBe('NewName')
            expect(retrievedUser?.lastname).toBe('NewLastname')
        })
    })
})
