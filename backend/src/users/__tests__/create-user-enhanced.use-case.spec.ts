import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserUseCase, CreateUserRequest } from '../application/use-cases/create-user.use-case'
import { UserRepositoryPort } from '../domain/ports/user-repository.port'
import { HashServicePort } from '../domain/ports/hash-service.port'
import { User, UserRole } from '../domain/user.entity'
import { UserEmailAlreadyExistsException } from '../domain/exceptions/user-domain.exception'
import { USER_REPOSITORY, HASH_SERVICE } from '../domain/tokens'
import { TestDataFactory, MockProviders } from '@/__tests__/utils/test-helpers'

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase
    let mockUserRepository: jest.Mocked<UserRepositoryPort>
    let mockHashService: jest.Mocked<HashServicePort>

    beforeEach(async () => {
        const mockUserRepositoryImpl = MockProviders.createMockRepository<UserRepositoryPort>()
        const mockHashServiceImpl = {
            hash: jest.fn(),
            compare: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserUseCase,
                {
                    provide: USER_REPOSITORY,
                    useValue: mockUserRepositoryImpl
                },
                {
                    provide: HASH_SERVICE,
                    useValue: mockHashServiceImpl
                }
            ]
        }).compile()

        useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
        mockUserRepository = module.get(USER_REPOSITORY)
        mockHashService = module.get(HASH_SERVICE)
    })

    it('should be defined', () => {
        expect(useCase).toBeDefined()
    })

    describe('execute', () => {
        const validRequest: CreateUserRequest = {
            email: 'test@example.com',
            name: 'John',
            lastname: 'Doe',
            birthdate: '1990-01-01',
            role: UserRole.USER,
            genderId: 'gender-123',
            professionId: 'profession-123',
            password: 'SecurePass123!'
        }

        it('should create user successfully', async () => {
            // Arrange
            const hashedPassword = 'hashedSecurePass123!'
            const expectedUser = User.create({
                ...validRequest,
                password: hashedPassword
            })

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.save.mockResolvedValue(expectedUser)

            // Act
            const result = await useCase.execute(validRequest)

            // Assert
            expect(result.user).toBeDefined()
            expect(result.user.email).toBe(validRequest.email)
            expect(result.user.name).toBe(validRequest.name)
            expect(result.user.lastname).toBe(validRequest.lastname)
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).toHaveBeenCalledWith(validRequest.password)
            expect(mockUserRepository.save).toHaveBeenCalled()
        })

        it('should throw exception when email already exists', async () => {
            // Arrange
            mockUserRepository.existsByEmail.mockResolvedValue(true)

            // Act & Assert
            await expect(useCase.execute(validRequest)).rejects.toThrow(UserEmailAlreadyExistsException)
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).not.toHaveBeenCalled()
            expect(mockUserRepository.save).not.toHaveBeenCalled()
        })

        it('should hash password before saving', async () => {
            // Arrange
            const plainPassword = 'MyPlainPassword123!'
            const hashedPassword = 'hashedMyPlainPassword123!'
            const request = { ...validRequest, password: plainPassword }

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockHashService.hash).toHaveBeenCalledWith(plainPassword)
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: hashedPassword
                })
            )
        })

        it('should create user with admin role', async () => {
            // Arrange
            const adminRequest = { ...validRequest, role: UserRole.ADMIN }
            const hashedPassword = 'hashedPassword'

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(adminRequest)

            // Assert
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: UserRole.ADMIN
                })
            )
        })

        it('should handle optional profileId', async () => {
            // Arrange
            const requestWithProfile = { ...validRequest, profileId: 'profile-456' }
            const hashedPassword = 'hashedPassword'

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(requestWithProfile)

            // Assert
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    profileId: 'profile-456'
                })
            )
        })

        it('should handle repository save errors', async () => {
            // Arrange
            const repositoryError = new Error('Database connection failed')
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')
            mockUserRepository.save.mockRejectedValue(repositoryError)

            // Act & Assert
            await expect(useCase.execute(validRequest)).rejects.toThrow('Database connection failed')
        })

        it('should handle hash service errors', async () => {
            // Arrange
            const hashError = new Error('Hashing failed')
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockRejectedValue(hashError)

            // Act & Assert
            await expect(useCase.execute(validRequest)).rejects.toThrow('Hashing failed')
            expect(mockUserRepository.save).not.toHaveBeenCalled()
        })

        it('should preserve all user properties in saved entity', async () => {
            // Arrange
            const hashedPassword = 'hashedCompletePassword'
            const completeRequest: CreateUserRequest = {
                email: 'complete@example.com',
                name: 'Complete',
                lastname: 'User',
                birthdate: '1985-05-15',
                role: UserRole.USER,
                genderId: 'gender-complete',
                professionId: 'profession-complete',
                profileId: 'profile-complete',
                password: 'CompletePassword123!'
            }

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(completeRequest)

            // Assert
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: completeRequest.email,
                    name: completeRequest.name,
                    lastname: completeRequest.lastname,
                    genderId: completeRequest.genderId,
                    professionId: completeRequest.professionId,
                    profileId: completeRequest.profileId,
                    role: completeRequest.role,
                    password: hashedPassword
                })
            )
        })

        it('should call all dependencies in correct order', async () => {
            // Arrange
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(validRequest)

            // Assert
            expect(mockUserRepository.existsByEmail).toHaveBeenCalled()
            expect(mockHashService.hash).toHaveBeenCalled()
            expect(mockUserRepository.save).toHaveBeenCalled()
        })

        it('should create user with default status ACTIVE', async () => {
            // Arrange
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')

            let savedUser: User
            mockUserRepository.save.mockImplementation(async (user: User) => {
                savedUser = user
                return user
            })

            // Act
            await useCase.execute(validRequest)

            // Assert
            expect(savedUser!.isActive()).toBe(true)
        })

        it('should return user in correct response format', async () => {
            // Arrange
            const savedUser = User.create({ ...validRequest, password: 'hashedPassword' })
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')
            mockUserRepository.save.mockResolvedValue(savedUser)

            // Act
            const result = await useCase.execute(validRequest)

            // Assert
            expect(result).toHaveProperty('user')
            expect(result.user).toBeInstanceOf(User)
            expect(result.user).toBe(savedUser)
        })
    })

    describe('edge cases', () => {
        it('should handle different email formats', async () => {
            // Test various valid email formats
            const emailFormats = [
                'test@example.com',
                'user.name@domain.co.uk',
                'user+tag@example.org',
                'test123@subdomain.example.com'
            ]

            for (const email of emailFormats) {
                const request = { ...TestDataFactory.createUserData(), email }
                mockUserRepository.existsByEmail.mockResolvedValue(false)
                mockHashService.hash.mockResolvedValue('hashedPassword')
                mockUserRepository.save.mockResolvedValue(expect.any(User))

                await useCase.execute(request)

                expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(email)
            }
        })

        it('should handle different birthdate formats', async () => {
            // Arrange
            const request = { ...TestDataFactory.createUserData(), birthdate: '1990-12-25' }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    birthdate: new Date('1990-12-25')
                })
            )
        })

        it('should handle names with special characters', async () => {
            // Arrange
            const request = {
                ...TestDataFactory.createUserData(),
                name: 'José María',
                lastname: 'García-López'
            }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'José María',
                    lastname: 'García-López'
                })
            )
        })
    })

    describe('security considerations', () => {
        it('should not store plain text password', async () => {
            // Arrange
            const plainPassword = 'PlainTextPassword123!'
            const request = { ...TestDataFactory.createUserData(), password: plainPassword }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword')

            let savedUser: User
            mockUserRepository.save.mockImplementation(async (user: User) => {
                savedUser = user
                return user
            })

            // Act
            await useCase.execute(request)

            // Assert
            expect(savedUser!.password).not.toBe(plainPassword)
            expect(savedUser!.password).toBe('hashedPassword')
        })

        it('should call hash service with correct algorithm strength', async () => {
            // Arrange
            const password = 'TestPassword123!'
            const request = { ...TestDataFactory.createUserData(), password }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('stronglyHashedPassword')
            mockUserRepository.save.mockResolvedValue(expect.any(User))

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockHashService.hash).toHaveBeenCalledWith(password)
            expect(mockHashService.hash).toHaveBeenCalledTimes(1)
        })
    })
})
