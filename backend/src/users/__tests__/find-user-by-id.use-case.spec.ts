import {Test,TestingModule} from '@nestjs/testing'
import {FindUserByIdUseCase} from '../application/use-cases/find-user-by-id.use-case'
import {UserRepositoryPort} from '../domain/ports/user-repository.port'
import {User,UserRole} from '../domain/user.entity'
import {USER_REPOSITORY} from '../domain/tokens'

describe('FindUserByIdUseCase',() => {
    let useCase: FindUserByIdUseCase
    let mockUserRepository: jest.Mocked<UserRepositoryPort>

    beforeEach(async () => {
        const mockUserRepositoryImpl={
            save: jest.fn(),
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

        const module: TestingModule=await Test.createTestingModule({
            providers: [
                FindUserByIdUseCase,
                {
                    provide: USER_REPOSITORY,
                    useValue: mockUserRepositoryImpl
                }
            ]
        }).compile()

        useCase=module.get<FindUserByIdUseCase>(FindUserByIdUseCase)
        mockUserRepository=module.get(USER_REPOSITORY)
    })

    it('should be defined',() => {
        expect(useCase).toBeDefined()
    })

    describe('execute',() => {
        const validRequest={
            id: 'user-123'
        }

        it('should return user when found',async () => {
            // Arrange
            const expectedUser=User.create({
                email: 'test@example.com',
                name: 'John',
                lastname: 'Doe',
                birthdate: '1990-01-01',
                role: UserRole.USER,
                genderId: 'gender-id',
                professionId: 'profession-id',
                password: 'SecurePass123'
            })

            mockUserRepository.findById.mockResolvedValue(expectedUser)

            // Act
            const result=await useCase.execute(validRequest)

            // Assert
            expect(mockUserRepository.findById).toHaveBeenCalledWith(validRequest.id)
            expect(result.user).toEqual(expectedUser)
        })

        it('should return null when user not found',async () => {
            // Arrange
            mockUserRepository.findById.mockResolvedValue(null)

            // Act
            const result=await useCase.execute(validRequest)

            // Assert
            expect(mockUserRepository.findById).toHaveBeenCalledWith(validRequest.id)
            expect(result.user).toBeNull()
        })
    })
})
