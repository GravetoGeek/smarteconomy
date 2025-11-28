import {Test,TestingModule} from '@nestjs/testing'
import {CreateUserUseCase} from '../application/use-cases/create-user.use-case'
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
        const mockUserRepositoryImpl={
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findByIdOrFail: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            search: jest.fn(),
            existsByEmail: jest.fn(),
            existsById: jest.fn(),
            sortableFields: ['id','email','name']
        }

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
        const validRequest={
            email: 'test@example.com',
            name: 'John',
            lastname: 'Doe',
            birthdate: '1990-01-01',
            role: UserRole.USER,
            genderId: 'gender-id',
            professionId: 'profession-id',
            password: 'SecurePass123!'
        }

        it('should create user successfully',async () => {
            // Arrange
            const hashedPassword='hashedPassword123!'
            const expectedUser=User.create({
                ...validRequest,
                password: hashedPassword
            })

            mockUserRepository.existsByEmail.mockResolvedValue(false)
            mockHashService.hash.mockResolvedValue(hashedPassword)
            mockUserRepository.create.mockResolvedValue(expectedUser)

            // Act
            const result=await useCase.execute(validRequest)

            // Assert
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).toHaveBeenCalledWith(validRequest.password)
            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User))
            expect(result.user).toEqual(expectedUser)
        })

        it('should throw UserEmailAlreadyExistsException when email already exists',async () => {
            // Arrange
            mockUserRepository.existsByEmail.mockResolvedValue(true)

            // Act & Assert
            await expect(useCase.execute(validRequest)).rejects.toThrow(
                UserEmailAlreadyExistsException
            )
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(validRequest.email)
            expect(mockHashService.hash).not.toHaveBeenCalled()
            expect(mockUserRepository.create).not.toHaveBeenCalled()
        })

        it('should validate email format through User entity',async () => {
            // Arrange
            const invalidEmailRequest={
                ...validRequest,
                email: 'invalid-email'
            }

            mockUserRepository.existsByEmail.mockResolvedValue(false)

            // Act & Assert
            await expect(useCase.execute(invalidEmailRequest)).rejects.toThrow('Invalid email format')
        })

        it('should validate password complexity through User entity',async () => {
            // Arrange
            const weakPasswordRequest={
                ...validRequest,
                password: 'weak'
            }

            mockUserRepository.existsByEmail.mockResolvedValue(false)

            // Act & Assert
            await expect(useCase.execute(weakPasswordRequest)).rejects.toThrow(
                'Password must be at least 8 characters long'
            )
        })

        it('should validate age through User entity',async () => {
            // Arrange
            const youngUserRequest={
                ...validRequest,
                birthdate: '2015-01-01'
            }

            mockUserRepository.existsByEmail.mockResolvedValue(false)

            // Act & Assert
            await expect(useCase.execute(youngUserRequest)).rejects.toThrow(
                'User must be at least 13 years old'
            )
        })
    })
})
