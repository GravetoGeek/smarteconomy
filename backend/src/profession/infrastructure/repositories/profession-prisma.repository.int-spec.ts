import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../../database/prisma/prisma.service'
import { ProfessionPrismaRepository } from './profession-prisma.repository'
import { Profession, ProfessionType } from '../../domain/entities/profession'
import { LoggerService } from '../../../shared/services/logger.service'
import { TestDatabaseUtils, TestDataFactory } from '../../../__tests__/utils/test-helpers'

describe('ProfessionPrismaRepository Integration', () => {
    let repository: ProfessionPrismaRepository
    let prisma: PrismaService
    let loggerService: LoggerService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfessionPrismaRepository,
                PrismaService,
                LoggerService
            ]
        }).compile()

        repository = module.get<ProfessionPrismaRepository>(ProfessionPrismaRepository)
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
        it('should save new profession successfully', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.DEVELOPER)

            // Act
            const savedProfession = await repository.save(profession)

            // Assert
            expect(savedProfession).toBeDefined()
            expect(savedProfession.id).toBe(profession.id)
            expect(savedProfession.profession).toBe(ProfessionType.DEVELOPER)
            expect(savedProfession.createdAt).toBeInstanceOf(Date)
            expect(savedProfession.updatedAt).toBeInstanceOf(Date)
        })

        it('should update existing profession', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.ENGINEER)
            await repository.save(profession)

            // Modify profession
            profession.updateProfession(ProfessionType.ARCHITECT)

            // Act
            const updatedProfession = await repository.save(profession)

            // Assert
            expect(updatedProfession.id).toBe(profession.id)
            expect(updatedProfession.profession).toBe(ProfessionType.ARCHITECT)
            expect(updatedProfession.updatedAt.getTime()).toBeGreaterThanOrEqual(profession.createdAt.getTime())
        })

        it('should handle different profession types', async () => {
            // Arrange
            const professions = [
                Profession.create(ProfessionType.DOCTOR),
                Profession.create(ProfessionType.TEACHER),
                Profession.create(ProfessionType.LAWYER),
                Profession.create(ProfessionType.NURSE),
                Profession.create(ProfessionType.CONSULTANT)
            ]

            // Act
            const savedProfessions = []
            for (const profession of professions) {
                savedProfessions.push(await repository.save(profession))
            }

            // Assert
            expect(savedProfessions).toHaveLength(5)
            expect(savedProfessions[0].profession).toBe(ProfessionType.DOCTOR)
            expect(savedProfessions[1].profession).toBe(ProfessionType.TEACHER)
            expect(savedProfessions[2].profession).toBe(ProfessionType.LAWYER)
            expect(savedProfessions[3].profession).toBe(ProfessionType.NURSE)
            expect(savedProfessions[4].profession).toBe(ProfessionType.CONSULTANT)
        })
    })

    describe('findById', () => {
        it('should find profession by id', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.MANAGER)
            const savedProfession = await repository.save(profession)

            // Act
            const foundProfession = await repository.findById(savedProfession.id)

            // Assert
            expect(foundProfession).toBeDefined()
            expect(foundProfession?.id).toBe(savedProfession.id)
            expect(foundProfession?.profession).toBe(ProfessionType.MANAGER)
        })

        it('should return null for non-existent profession', async () => {
            // Act
            const result = await repository.findById('non-existent-id')

            // Assert
            expect(result).toBeNull()
        })

        it('should reconstitute profession correctly', async () => {
            // Arrange
            const originalProfession = Profession.create(ProfessionType.MARKETING)
            await repository.save(originalProfession)

            // Act
            const foundProfession = await repository.findById(originalProfession.id)

            // Assert
            expect(foundProfession).toBeInstanceOf(Profession)
            expect(foundProfession?.profession).toBe(ProfessionType.MARKETING)
            expect(foundProfession?.isDeveloper()).toBe(false)
            expect(foundProfession?.isHealthcare()).toBe(false)
        })
    })

    describe('findByProfession', () => {
        it('should find profession by profession type', async () => {
            // Arrange
            const professionType = ProfessionType.FINANCE
            const profession = Profession.create(professionType)
            await repository.save(profession)

            // Act
            const foundProfession = await repository.findByProfession(professionType)

            // Assert
            expect(foundProfession).toBeDefined()
            expect(foundProfession?.profession).toBe(professionType)
            expect(foundProfession?.id).toBe(profession.id)
        })

        it('should return null for non-existent profession type', async () => {
            // Act
            const result = await repository.findByProfession('NON_EXISTENT' as ProfessionType)

            // Assert
            expect(result).toBeNull()
        })

        it('should handle string-based profession search', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.HR)
            await repository.save(profession)

            // Act
            const foundProfession = await repository.findByProfession(ProfessionType.HR.toString() as ProfessionType)

            // Assert
            expect(foundProfession).toBeDefined()
            expect(foundProfession?.profession).toBe(ProfessionType.HR)
        })
    })

    describe('existsByProfession', () => {
        it('should return true for existing profession type', async () => {
            // Arrange
            const professionType = ProfessionType.OPERATIONS
            const profession = Profession.create(professionType)
            await repository.save(profession)

            // Act
            const exists = await repository.existsByProfession(professionType)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent profession type', async () => {
            // Act
            const exists = await repository.existsByProfession('NON_EXISTENT' as ProfessionType)

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('existsById', () => {
        it('should return true for existing profession id', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.RESEARCH)
            const savedProfession = await repository.save(profession)

            // Act
            const exists = await repository.existsById(savedProfession.id)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent profession id', async () => {
            // Act
            const exists = await repository.existsById('non-existent-id')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('delete', () => {
        it('should delete profession successfully', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.SALES)
            const savedProfession = await repository.save(profession)

            // Act
            await repository.delete(savedProfession.id)

            // Assert
            const deletedProfession = await repository.findById(savedProfession.id)
            expect(deletedProfession).toBeNull()
        })

        it('should handle deletion of non-existent profession', async () => {
            // Act & Assert
            await expect(repository.delete('non-existent-id')).rejects.toThrow()
        })
    })

    describe('findAll', () => {
        it('should return all professions', async () => {
            // Arrange
            const professions = [
                Profession.create(ProfessionType.DESIGNER),
                Profession.create(ProfessionType.ARCHITECT),
                Profession.create(ProfessionType.STUDENT)
            ]

            for (const profession of professions) {
                await repository.save(profession)
            }

            // Act
            const allProfessions = await repository.findAll()

            // Assert
            expect(allProfessions).toHaveLength(3)
            expect(allProfessions.every(profession => profession instanceof Profession)).toBe(true)
        })

        it('should return empty array when no professions exist', async () => {
            // Act
            const allProfessions = await repository.findAll()

            // Assert
            expect(allProfessions).toEqual([])
        })

        it('should return professions in creation order', async () => {
            // Arrange
            const firstProfession = Profession.create(ProfessionType.ENGINEER)
            const secondProfession = Profession.create(ProfessionType.DOCTOR)

            await repository.save(firstProfession)
            // Small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 10))
            await repository.save(secondProfession)

            // Act
            const allProfessions = await repository.findAll()

            // Assert
            expect(allProfessions).toHaveLength(2)
            expect(allProfessions[0].createdAt.getTime()).toBeLessThanOrEqual(allProfessions[1].createdAt.getTime())
        })
    })

    describe('domain methods validation', () => {
        it('should validate profession domain methods', async () => {
            // Arrange
            const engineerProfession = Profession.create(ProfessionType.ENGINEER)
            const doctorProfession = Profession.create(ProfessionType.DOCTOR)
            const teacherProfession = Profession.create(ProfessionType.TEACHER)
            const developerProfession = Profession.create(ProfessionType.DEVELOPER)
            const nurseProfession = Profession.create(ProfessionType.NURSE)

            await repository.save(engineerProfession)
            await repository.save(doctorProfession)
            await repository.save(teacherProfession)
            await repository.save(developerProfession)
            await repository.save(nurseProfession)

            // Act
            const savedEngineer = await repository.findById(engineerProfession.id)
            const savedDoctor = await repository.findById(doctorProfession.id)
            const savedTeacher = await repository.findById(teacherProfession.id)
            const savedDeveloper = await repository.findById(developerProfession.id)
            const savedNurse = await repository.findById(nurseProfession.id)

            // Assert
            expect(savedEngineer?.isEngineer()).toBe(true)
            expect(savedEngineer?.isTechnical()).toBe(true)
            expect(savedEngineer?.isHealthcare()).toBe(false)

            expect(savedDoctor?.isDoctor()).toBe(true)
            expect(savedDoctor?.isHealthcare()).toBe(true)
            expect(savedDoctor?.isTechnical()).toBe(false)

            expect(savedTeacher?.isTeacher()).toBe(true)
            expect(savedTeacher?.isHealthcare()).toBe(false)
            expect(savedTeacher?.isTechnical()).toBe(false)

            expect(savedDeveloper?.isDeveloper()).toBe(true)
            expect(savedDeveloper?.isTechnical()).toBe(true)
            expect(savedDeveloper?.isHealthcare()).toBe(false)

            expect(savedNurse?.isHealthcare()).toBe(true)
            expect(savedNurse?.isTechnical()).toBe(false)
            expect(savedNurse?.isDoctor()).toBe(false)
        })

        it('should validate profession updates', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.STUDENT)
            await repository.save(profession)

            // Act
            profession.updateProfession(ProfessionType.DEVELOPER)
            const updatedProfession = await repository.save(profession)
            const retrievedProfession = await repository.findById(updatedProfession.id)

            // Assert
            expect(retrievedProfession?.profession).toBe(ProfessionType.DEVELOPER)
            expect(retrievedProfession?.isDeveloper()).toBe(true)
            expect(retrievedProfession?.isTechnical()).toBe(true)
        })
    })

    describe('error handling', () => {
        it('should handle database connection errors gracefully', async () => {
            // Arrange
            const disconnectedPrisma = new PrismaService()
            const disconnectedRepository = new ProfessionPrismaRepository(disconnectedPrisma)
            const profession = Profession.create(ProfessionType.OTHER)

            // Act & Assert
            await expect(disconnectedRepository.save(profession)).rejects.toThrow()
        })

        it('should handle constraint violations appropriately', async () => {
            // This test checks if we can save the same profession type multiple times
            // which should be allowed for the profession entity
            const profession1 = Profession.create(ProfessionType.ENGINEER)
            const profession2 = Profession.create(ProfessionType.ENGINEER)

            // Act & Assert
            await expect(repository.save(profession1)).resolves.not.toThrow()
            await expect(repository.save(profession2)).resolves.not.toThrow()

            // Both should exist with different IDs
            expect(profession1.id).not.toBe(profession2.id)
        })
    })

    describe('data integrity', () => {
        it('should maintain data consistency across operations', async () => {
            // Arrange
            const professionType = ProfessionType.ENTREPRENEUR
            const profession = Profession.create(professionType)

            // Act
            const saved = await repository.save(profession)
            const foundById = await repository.findById(saved.id)
            const foundByProfession = await repository.findByProfession(saved.profession)
            const existsById = await repository.existsById(saved.id)
            const existsByProfession = await repository.existsByProfession(saved.profession)

            // Assert
            expect(foundById?.id).toBe(saved.id)
            expect(foundByProfession?.id).toBe(saved.id)
            expect(foundById?.profession).toBe(foundByProfession?.profession)
            expect(existsById).toBe(true)
            expect(existsByProfession).toBe(true)
        })

        it('should handle profession state changes correctly', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.ACCOUNTANT)
            await repository.save(profession)

            // Act - Change profession type
            profession.updateProfession(ProfessionType.FINANCE)

            const updatedProfession = await repository.save(profession)
            const retrievedProfession = await repository.findById(updatedProfession.id)

            // Assert
            expect(retrievedProfession?.profession).toBe(ProfessionType.FINANCE)
            expect(retrievedProfession?.isHealthcare()).toBe(false)
            expect(retrievedProfession?.isTechnical()).toBe(false)
        })

        it('should maintain proper timestamps', async () => {
            // Arrange
            const profession = Profession.create(ProfessionType.DESIGNER)

            // Act
            const savedProfession = await repository.save(profession)

            // Assert
            expect(savedProfession.createdAt).toEqual(profession.createdAt)
            expect(savedProfession.updatedAt).toEqual(profession.updatedAt)
            expect(savedProfession.createdAt).toBeInstanceOf(Date)
            expect(savedProfession.updatedAt).toBeInstanceOf(Date)
        })

        it('should handle business logic combinations', async () => {
            // Arrange
            const technicalProfessions = [
                Profession.create(ProfessionType.ENGINEER),
                Profession.create(ProfessionType.ARCHITECT),
                Profession.create(ProfessionType.DEVELOPER)
            ]

            const healthcareProfessions = [
                Profession.create(ProfessionType.DOCTOR),
                Profession.create(ProfessionType.NURSE)
            ]

            // Act
            for (const profession of [...technicalProfessions, ...healthcareProfessions]) {
                await repository.save(profession)
            }

            // Retrieve and validate
            const allSaved = await repository.findAll()
            const technical = allSaved.filter(p => p.isTechnical())
            const healthcare = allSaved.filter(p => p.isHealthcare())

            // Assert
            expect(technical).toHaveLength(3)
            expect(healthcare).toHaveLength(2)
            expect(technical.every(p => p.isTechnical())).toBe(true)
            expect(healthcare.every(p => p.isHealthcare())).toBe(true)

            // Verify no overlap (professions can't be both technical and healthcare in this model)
            const overlap = technical.filter(p => p.isHealthcare())
            expect(overlap).toHaveLength(0)
        })
    })
})
