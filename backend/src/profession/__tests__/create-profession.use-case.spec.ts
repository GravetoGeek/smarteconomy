import {Test,TestingModule} from '@nestjs/testing'
import {CreateProfessionUseCase} from '../application/use-cases/create-profession.use-case'
import {Profession,ProfessionType} from '../domain/entities/profession'
import {InvalidProfessionTypeException,ProfessionAlreadyExistsException} from '../domain/exceptions/profession-domain.exception'
import {ProfessionRepositoryPort} from '../domain/ports/profession-repository.port'
import {PROFESSION_REPOSITORY} from '../domain/tokens'

describe('CreateProfessionUseCase',() => {
    let useCase: CreateProfessionUseCase
    let mockProfessionRepository: jest.Mocked<ProfessionRepositoryPort>

    beforeEach(async () => {
        const mockRepository={
            save: jest.fn(),
            findById: jest.fn(),
            findByProfession: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            existsById: jest.fn(),
            existsByProfession: jest.fn()
        }

        const module: TestingModule=await Test.createTestingModule({
            providers: [
                CreateProfessionUseCase,
                {
                    provide: PROFESSION_REPOSITORY,
                    useValue: mockRepository
                }
            ]
        }).compile()

        useCase=module.get<CreateProfessionUseCase>(CreateProfessionUseCase)
        mockProfessionRepository=module.get(PROFESSION_REPOSITORY)
    })

    it('should be defined',() => {
        expect(useCase).toBeDefined()
    })

    describe('execute',() => {
        it('should create a profession successfully',async () => {
            // Arrange
            const professionInput='ENGINEER'
            const mockProfession=Profession.create(ProfessionType.ENGINEER)

            mockProfessionRepository.existsByProfession.mockResolvedValue(false)
            mockProfessionRepository.save.mockResolvedValue(mockProfession)

            // Act
            const result=await useCase.execute(professionInput)

            // Assert
            expect(result).toBe(mockProfession)
            expect(mockProfessionRepository.existsByProfession).toHaveBeenCalledWith(ProfessionType.ENGINEER)
            expect(mockProfessionRepository.save).toHaveBeenCalledWith(mockProfession)
        })

        it('should create a profession with Portuguese input',async () => {
            // Arrange
            const professionInput='Engenheiro'
            const mockProfession=Profession.create(ProfessionType.ENGINEER)

            mockProfessionRepository.existsByProfession.mockResolvedValue(false)
            mockProfessionRepository.save.mockResolvedValue(mockProfession)

            // Act
            const result=await useCase.execute(professionInput)

            // Assert
            expect(result).toBe(mockProfession)
            expect(mockProfessionRepository.existsByProfession).toHaveBeenCalledWith(ProfessionType.ENGINEER)
        })

        it('should throw ProfessionAlreadyExistsException when profession already exists',async () => {
            // Arrange
            const professionInput='DOCTOR'
            mockProfessionRepository.existsByProfession.mockResolvedValue(true)

            // Act & Assert
            await expect(useCase.execute(professionInput)).rejects.toThrow(ProfessionAlreadyExistsException)
            expect(mockProfessionRepository.existsByProfession).toHaveBeenCalledWith(ProfessionType.DOCTOR)
            expect(mockProfessionRepository.save).not.toHaveBeenCalled()
        })

        it('should throw InvalidProfessionTypeException for invalid profession',async () => {
            // Arrange
            const professionInput='INVALID_PROFESSION'

            // Act & Assert
            await expect(useCase.execute(professionInput)).rejects.toThrow(InvalidProfessionTypeException)
            expect(mockProfessionRepository.existsByProfession).not.toHaveBeenCalled()
            expect(mockProfessionRepository.save).not.toHaveBeenCalled()
        })

        it('should handle case-insensitive input',async () => {
            // Arrange
            const professionInput='developer'
            const mockProfession=Profession.create(ProfessionType.DEVELOPER)

            mockProfessionRepository.existsByProfession.mockResolvedValue(false)
            mockProfessionRepository.save.mockResolvedValue(mockProfession)

            // Act
            const result=await useCase.execute(professionInput)

            // Assert
            expect(result).toBe(mockProfession)
            expect(mockProfessionRepository.existsByProfession).toHaveBeenCalledWith(ProfessionType.DEVELOPER)
        })
    })
})
