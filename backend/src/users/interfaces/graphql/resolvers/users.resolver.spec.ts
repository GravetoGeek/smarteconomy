import { Test, TestingModule } from '@nestjs/testing'
import { UsersResolver } from './users.resolver'
import { UsersApplicationService } from '../../../application/services/users-application.service'
import { LoggerService } from '@/shared/services/logger.service'
import { UserRole } from '../../../domain/user.entity'
import { CreateUserInput } from '../inputs/create-user.input'
import { SearchUsersInput } from '../inputs/search-users.input'
import { UpdateUserInput } from '../inputs/update-user.input'

describe('UsersResolver', () => {
    let resolver: UsersResolver
    let usersApplicationService: jest.Mocked<UsersApplicationService>
    let loggerService: jest.Mocked<LoggerService>

    const createMockUser = (overrides: any = {}) => ({
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
    } as any)

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersResolver,
                {
                    provide: UsersApplicationService,
                    useValue: {
                        createUser: jest.fn(),
                        findUserById: jest.fn(),
                        findUserByEmail: jest.fn(),
                        updateUser: jest.fn(),
                        deleteUser: jest.fn(),
                        searchUsers: jest.fn()
                    }
                },
                {
                    provide: LoggerService,
                    useValue: {
                        logOperation: jest.fn(),
                        logError: jest.fn(),
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn()
                    }
                }
            ]
        }).compile()

        resolver = module.get<UsersResolver>(UsersResolver)
        usersApplicationService = module.get(UsersApplicationService)
        loggerService = module.get(LoggerService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('users', () => {
        it('should return all users successfully', async () => {
            // Arrange
            const mockUsers = [
                createMockUser(),
                createMockUser({ email: 'user2@test.com' })
            ]
            const mockSearchResult = {
                users: mockUsers,
                total: 2,
                currentPage: 1,
                limit: 100,
                totalPages: 1,
                lastPage: 1
            }
            usersApplicationService.searchUsers.mockResolvedValue(mockSearchResult as any)

            // Act
            const result = await resolver.users()

            // Assert
            expect(result).toEqual(mockUsers)
            expect(usersApplicationService.searchUsers).toHaveBeenCalledWith({ page: 1, limit: 100 })
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ALL_USERS_START',
                null,
                'UsersResolver'
            )
        })

        it('should handle errors gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed')
            usersApplicationService.searchUsers.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.users()).rejects.toThrow('Database connection failed')
            expect(loggerService.logError).toHaveBeenCalledWith(
                'GRAPHQL_GET_ALL_USERS_ERROR',
                error,
                'UsersResolver'
            )
        })
    })

    describe('userById', () => {
        it('should return user when found', async () => {
            // Arrange
            const userId = 'user-123'
            const mockUser = createMockUser({ id: userId })
            usersApplicationService.findUserById.mockResolvedValue(mockUser as any)

            // Act
            const result = await resolver.userById(userId)

            // Assert
            expect(result).toEqual(mockUser)
            expect(usersApplicationService.findUserById).toHaveBeenCalledWith(userId)
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_USER_BY_ID_START',
                { id: userId },
                'UsersResolver'
            )
        })

        it('should return null when user not found', async () => {
            // Arrange
            const userId = 'non-existent-user'
            usersApplicationService.findUserById.mockResolvedValue(null)

            // Act
            const result = await resolver.userById(userId)

            // Assert
            expect(result).toBeNull()
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_USER_BY_ID_NOT_FOUND',
                { id: userId },
                'UsersResolver'
            )
        })
    })

    describe('userByEmail', () => {
        it('should return user when found by email', async () => {
            // Arrange
            const email = 'test@example.com'
            const mockUser = createMockUser({ email })
            usersApplicationService.findUserByEmail.mockResolvedValue(mockUser as any)

            // Act
            const result = await resolver.userByEmail(email)

            // Assert
            expect(result).toEqual(mockUser)
            expect(usersApplicationService.findUserByEmail).toHaveBeenCalledWith(email)
        })

        it('should return null when user not found by email', async () => {
            // Arrange
            const email = 'nonexistent@example.com'
            usersApplicationService.findUserByEmail.mockResolvedValue(null)

            // Act
            const result = await resolver.userByEmail(email)

            // Assert
            expect(result).toBeNull()
        })

        it('should handle errors gracefully and return null', async () => {
            // Arrange
            const email = 'error@example.com'
            const error = new Error('Database error')
            usersApplicationService.findUserByEmail.mockRejectedValue(error)

            // Act
            const result = await resolver.userByEmail(email)

            // Assert
            expect(result).toBeNull()
            expect(loggerService.logError).toHaveBeenCalled()
        })
    })

    describe('searchUsers', () => {
        it('should return search results successfully', async () => {
            // Arrange
            const searchInput: SearchUsersInput = {
                page: 1,
                limit: 10,
                filter: 'john',
                sort: 'name',
                sortDirection: 'asc'
            }
            const mockUsers = [
                createMockUser({ name: 'John Doe' }),
                createMockUser({ name: 'John Smith' })
            ]
            const mockSearchResult = {
                users: mockUsers,
                total: 2,
                currentPage: 1,
                limit: 10,
                totalPages: 1,
                lastPage: 1
            }
            usersApplicationService.searchUsers.mockResolvedValue(mockSearchResult as any)

            // Act
            const result = await resolver.searchUsers(searchInput)

            // Assert
            expect(result).toEqual({
                items: mockUsers,
                total: 2,
                currentPage: 1,
                limit: 10,
                totalPages: 1,
                lastPage: 1
            })
            expect(usersApplicationService.searchUsers).toHaveBeenCalledWith(searchInput)
        })

        it('should handle search errors', async () => {
            // Arrange
            const searchInput: SearchUsersInput = { page: 1, limit: 10 }
            const error = new Error('Search failed')
            usersApplicationService.searchUsers.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.searchUsers(searchInput)).rejects.toThrow('Search failed')
            expect(loggerService.logError).toHaveBeenCalled()
        })
    })

    describe('createUser', () => {
        it('should create user successfully', async () => {
            // Arrange
            const createUserInput: CreateUserInput = {
                email: 'newuser@test.com',
                name: 'New',
                lastname: 'User',
                birthdate: '1990-01-01',
                role: UserRole.USER,
                genderId: 'gender-123',
                professionId: 'profession-123',
                password: 'securePassword123'
            }
            const mockUser = createMockUser({
                email: createUserInput.email,
                name: createUserInput.name,
                lastname: createUserInput.lastname
            })
            usersApplicationService.createUser.mockResolvedValue(mockUser as any)

            // Act
            const result = await resolver.createUser(createUserInput)

            // Assert
            expect(result).toEqual(mockUser)
            expect(usersApplicationService.createUser).toHaveBeenCalledWith({
                email: createUserInput.email,
                name: createUserInput.name,
                lastname: createUserInput.lastname,
                birthdate: createUserInput.birthdate,
                role: createUserInput.role,
                genderId: createUserInput.genderId,
                professionId: createUserInput.professionId,
                password: createUserInput.password
            })
        })

        it('should handle validation errors', async () => {
            // Arrange
            const createUserInput: CreateUserInput = {
                email: 'invalid-email',
                name: '',
                lastname: '',
                birthdate: '1990-01-01',
                role: UserRole.USER,
                genderId: 'gender-123',
                professionId: 'profession-123',
                password: '123'
            }
            const error = new Error('Validation failed: Invalid email format')
            usersApplicationService.createUser.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.createUser(createUserInput)).rejects.toThrow('Validation failed')
            expect(loggerService.logError).toHaveBeenCalled()
        })
    })

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            // Arrange
            const userId = 'user-123'
            const updateInput: UpdateUserInput = {
                name: 'Updated Name',
                lastname: 'Updated Lastname'
            }
            const mockUpdatedUser = createMockUser({
                id: userId,
                name: updateInput.name,
                lastname: updateInput.lastname
            })
            usersApplicationService.updateUser.mockResolvedValue(mockUpdatedUser as any)

            // Act
            const result = await resolver.updateUser(userId, updateInput)

            // Assert
            expect(result).toEqual({
                user: mockUpdatedUser,
                success: true,
                message: 'User updated successfully'
            })
            expect(usersApplicationService.updateUser).toHaveBeenCalledWith(userId, updateInput)
        })

        it('should handle user not found', async () => {
            // Arrange
            const userId = 'non-existent-user'
            const updateInput: UpdateUserInput = { name: 'New Name' }
            usersApplicationService.updateUser.mockResolvedValue(null)

            // Act
            const result = await resolver.updateUser(userId, updateInput)

            // Assert
            expect(result).toEqual({
                user: null,
                success: false,
                message: 'User not found'
            })
        })
    })

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            // Arrange
            const userId = 'user-123'
            usersApplicationService.deleteUser.mockResolvedValue(true)

            // Act
            const result = await resolver.deleteUser(userId)

            // Assert
            expect(result).toEqual({
                success: true,
                message: 'User deleted successfully'
            })
            expect(usersApplicationService.deleteUser).toHaveBeenCalledWith(userId)
        })

        it('should handle user not found during deletion', async () => {
            // Arrange
            const userId = 'non-existent-user'
            usersApplicationService.deleteUser.mockResolvedValue(false)

            // Act
            const result = await resolver.deleteUser(userId)

            // Assert
            expect(result).toEqual({
                success: false,
                message: 'User not found'
            })
        })

        it('should handle deletion errors', async () => {
            // Arrange
            const userId = 'user-123'
            const error = new Error('Deletion failed')
            usersApplicationService.deleteUser.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.deleteUser(userId)).rejects.toThrow('Deletion failed')
            expect(loggerService.logError).toHaveBeenCalled()
        })
    })
})
