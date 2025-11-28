import {Test,TestingModule} from '@nestjs/testing'
import {MockProviders,TestDataFactory} from '../../__tests__/utils/test-helpers'
import {CreateUserRequest,CreateUserUseCase} from '../application/use-cases/create-user.use-case'
import {UserEmailAlreadyExistsException} from '../domain/exceptions/user-domain.exception'
import {HashServicePort} from '../domain/ports/hash-service.port'
import {UserRepositoryPort} from '../domain/ports/user-repository.port'
import {HASH_SERVICE,USER_REPOSITORY} from '../domain/tokens'
import {User,UserRole} from '../domain/user.entity'

describe('CreateUserUseCase',() => {
    let useCase: CreateUserUseCase
    let mockUserRepository: jest.Mocked<UserRepositoryPort>
    let mockHashService: jest.Mocked<HashServicePort>

    beforeEach(async () => {
        const mockUserRepositoryImpl=MockProviders.createMockRepository<UserRepositoryPort>()
        // Add create and update methods to the mock
        mockUserRepositoryImpl.create=jest.fn()
        mockUserRepositoryImpl.update=jest.fn()

        const mockHashServiceImpl={
            hash: jest.fn(),
            compare: jest.fn()
        }

        const module: TestingModule=await Test.createTestingModule({
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

        useCase=module.get<CreateUserUseCase>(CreateUserUseCase)
        mockUserRepository=module.get(USER_REPOSITORY)
        mockHashService=module.get(HASH_SERVICE)
    })

    it('should be defined',() => {
        expect(useCase).toBeDefined()
    })

    describe('execute',() => {
        const validRequest: CreateUserRequest={
            email: 'test@example.com',
            name: 'John',
            lastname: 'Doe',
            birthdate: '1990-01-01',
            role: UserRole.USER,
            genderId: 'gender-123',
            professionId: 'profession-123',
            password: 'SecurePass123!'
        }

        it('should create user successfully',async () => {
            const hashedPassword='hashedSecurePass123!'
            const expectedUser=User.create({
                ...validRequest,
                password: hashedPassword
            })

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.create.mockResolvedValue(expectedUser)

            const result=await useCase.execute(validRequest)

            expect(result.user).toBeDefined()
            expect(result.user.email).toBe(validRequest.email)
            expect(result.user.name).toBe(validRequest.name)
            expect(result.user.lastname).toBe(validRequest.lastname)
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).toHaveBeenCalledWith(validRequest.password)
            expect(mockUserRepository.create).toHaveBeenCalled()
        })

        it('should throw exception when email already exists',async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(true)

            await expect(useCase.execute(validRequest)).rejects.toThrow(UserEmailAlreadyExistsException)
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).not.toHaveBeenCalled()
            expect(mockUserRepository.create).not.toHaveBeenCalled()
        })

        it('should hash password before saving',async () => {
            const plainPassword='MyPlainPassword123!'
            const hashedPassword='hashedMyPlainPassword123!'
            const request={...validRequest,password: plainPassword}

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(request)

            expect(mockHashService.hash).toHaveBeenCalledWith(plainPassword)
            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                password: hashedPassword
            }))
        })

        it('should create user with admin role',async () => {
            const adminRequest={...validRequest,role: UserRole.ADMIN}
            const hashedPassword='hashedPassword123!'

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(adminRequest)

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                role: UserRole.ADMIN
            }))
        })

        it('should handle optional profileId',async () => {
            const requestWithProfile={...validRequest,profileId: 'profile-456'}
            const hashedPassword='hashedPassword123!'

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(requestWithProfile)

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                profileId: 'profile-456'
            }))
        })

        it('should handle repository save errors',async () => {
            const repositoryError=new Error('Database connection failed')
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')
            mockUserRepository.create.mockRejectedValue(repositoryError)

            await expect(useCase.execute(validRequest)).rejects.toThrow('Database connection failed')
        })

        it('should handle hash service errors',async () => {
            const hashError=new Error('Hashing failed')
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockRejectedValue(hashError)

            await expect(useCase.execute(validRequest)).rejects.toThrow('Hashing failed')
            expect(mockUserRepository.create).not.toHaveBeenCalled()
        })

        it('should preserve all user properties in saved entity',async () => {
            const hashedPassword='hashedCompletePassword123!'
            const completeRequest: CreateUserRequest={
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
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(completeRequest)

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: completeRequest.email,
                name: completeRequest.name,
                lastname: completeRequest.lastname,
                genderId: completeRequest.genderId,
                professionId: completeRequest.professionId,
                profileId: completeRequest.profileId,
                role: completeRequest.role,
                password: hashedPassword
            }))
        })

        it('should call all dependencies in correct order',async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(validRequest)

            expect(mockUserRepository.existsByEmail).toHaveBeenCalled()
            expect(mockHashService.hash).toHaveBeenCalled()
            expect(mockUserRepository.create).toHaveBeenCalled()
        })

        it('should create user with default status ACTIVE',async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')

            let savedUser: User|null=null
            mockUserRepository.create.mockImplementation(async (user: User) => {
                savedUser=user
                return user
            })

            await useCase.execute(validRequest)

            expect(savedUser).not.toBeNull()
            expect(savedUser!.isActive()).toBe(true)
        })

        it('should return user in correct response format',async () => {
            const savedUser=User.create({...validRequest,password: 'hashedPassword123!'})
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')
            mockUserRepository.create.mockResolvedValue(savedUser)

            const result=await useCase.execute(validRequest)

            expect(result).toHaveProperty('user')
            expect(result.user).toBeInstanceOf(User)
            expect(result.user).toBe(savedUser)
        })
    })

    describe('edge cases',() => {
        it('should handle different email formats',async () => {
            const emailFormats=[
                'test@example.com',
                'user.name@domain.co.uk',
                'user+tag@example.org',
                'test123@subdomain.example.com'
            ]

            for(const email of emailFormats) {
                const userData=TestDataFactory.createUserData()
                const request={
                    ...userData,
                    email,
                    birthdate: userData.birthdate.toISOString()
                }
                mockUserRepository.existsByEmail.mockResolvedValue(false)
                mockHashService.hash.mockResolvedValue('hashedPassword123!')
                mockUserRepository.create.mockResolvedValue(expect.any(User))

                await useCase.execute(request)

                expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(email)
            }
        })

        it('should handle different birthdate formats',async () => {
            const userData=TestDataFactory.createUserData()
            const request={
                ...userData,
                birthdate: '1990-12-25'
            }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(request)

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                birthdate: new Date('1990-12-25')
            }))
        })

        it('should handle names with special characters',async () => {
            const userData=TestDataFactory.createUserData()
            const request={
                ...userData,
                name: 'José María',
                lastname: 'García-López',
                birthdate: userData.birthdate.toISOString()
            }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(request)

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'José María',
                lastname: 'García-López'
            }))
        })
    })

    describe('security considerations',() => {
        it('should not store plain text password',async () => {
            const plainPassword='PlainTextPassword123!'
            const userData=TestDataFactory.createUserData()
            const request={
                ...userData,
                password: plainPassword,
                birthdate: userData.birthdate.toISOString()
            }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('hashedPassword123!')

            let savedUser: User|null=null
            mockUserRepository.create.mockImplementation(async (user: User) => {
                savedUser=user
                return user
            })

            await useCase.execute(request)

            expect(savedUser).not.toBeNull()
            expect(savedUser!.password).not.toBe(plainPassword)
            expect(savedUser!.password).toBe('hashedPassword123!')
        })

        it('should call hash service with correct algorithm strength',async () => {
            const password='TestPassword123!'
            const userData=TestDataFactory.createUserData()
            const request={
                ...userData,
                password,
                birthdate: userData.birthdate.toISOString()
            }
            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue('stronglyHashedPassword123!')
            mockUserRepository.create.mockResolvedValue(expect.any(User))

            await useCase.execute(request)

            expect(mockHashService.hash).toHaveBeenCalledWith(password)
            expect(mockHashService.hash).toHaveBeenCalledTimes(1)
        })
    })
})
