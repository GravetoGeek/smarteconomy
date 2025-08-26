import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../../database/prisma/prisma.service'
import { GenderPrismaRepository } from './gender-prisma.repository'
import { Gender, GenderType } from '../../domain/entities/gender'
import { LoggerService } from '../../../shared/services/logger.service'
import { TestDatabaseUtils, TestDataFactory } from '../../../__tests__/utils/test-helpers'

describe('GenderPrismaRepository Integration', () => {
    let repository: GenderPrismaRepository
    let prisma: PrismaService
    let loggerService: LoggerService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenderPrismaRepository,
                PrismaService,
                LoggerService
            ]
        }).compile()

        repository = module.get<GenderPrismaRepository>(GenderPrismaRepository)
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
        it('should save new gender successfully', async () => {
            // Arrange
            const genderData = TestDataFactory.createGenderData({
                gender: GenderType.NON_BINARY
            })
            const gender = Gender.create(genderData)

            // Act
            const savedGender = await repository.save(gender)

            // Assert
            expect(savedGender).toBeDefined()
            expect(savedGender.id).toBe(gender.id)
            expect(savedGender.gender).toBe(GenderType.NON_BINARY)
            expect(savedGender.createdAt).toBeInstanceOf(Date)
            expect(savedGender.updatedAt).toBeInstanceOf(Date)
        })

        it('should update existing gender', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.MALE
            })
            await repository.save(gender)

            // Simulate update by creating new instance with same ID
            const updatedGender = Gender.reconstitute({
                id: gender.id,
                gender: GenderType.FEMALE.toString(),
                createdAt: gender.createdAt,
                updatedAt: new Date()
            })

            // Act
            const result = await repository.save(updatedGender)

            // Assert
            expect(result.id).toBe(gender.id)
            expect(result.gender).toBe(GenderType.FEMALE)
            expect(result.updatedAt.getTime()).toBeGreaterThan(gender.createdAt.getTime())
        })

        it('should handle different gender types', async () => {
            // Arrange
            const genders = [
                Gender.create({ gender: GenderType.MALE }),
                Gender.create({ gender: GenderType.FEMALE }),
                Gender.create({ gender: GenderType.OTHER }),
                Gender.create({ gender: GenderType.PREFER_NOT_TO_SAY }),
                Gender.create({ gender: GenderType.NON_BINARY })
            ]

            // Act
            const savedGenders = []
            for (const gender of genders) {
                savedGenders.push(await repository.save(gender))
            }

            // Assert
            expect(savedGenders).toHaveLength(5)
            expect(savedGenders[0].gender).toBe(GenderType.MALE)
            expect(savedGenders[1].gender).toBe(GenderType.FEMALE)
            expect(savedGenders[2].gender).toBe(GenderType.OTHER)
            expect(savedGenders[3].gender).toBe(GenderType.PREFER_NOT_TO_SAY)
            expect(savedGenders[4].gender).toBe(GenderType.NON_BINARY)
        })
    })

    describe('findById', () => {
        it('should find gender by id', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.AGENDER
            })
            const savedGender = await repository.save(gender)

            // Act
            const foundGender = await repository.findById(savedGender.id)

            // Assert
            expect(foundGender).toBeDefined()
            expect(foundGender?.id).toBe(savedGender.id)
            expect(foundGender?.gender).toBe(GenderType.AGENDER)
        })

        it('should return null for non-existent gender', async () => {
            // Act
            const result = await repository.findById('non-existent-id')

            // Assert
            expect(result).toBeNull()
        })

        it('should reconstitute gender correctly', async () => {
            // Arrange
            const originalGender = Gender.create({
                gender: GenderType.GENDERFLUID
            })
            await repository.save(originalGender)

            // Act
            const foundGender = await repository.findById(originalGender.id)

            // Assert
            expect(foundGender).toBeInstanceOf(Gender)
            expect(foundGender?.gender).toBe(GenderType.GENDERFLUID)
            expect(foundGender?.isAgender()).toBe(false)
            expect(foundGender?.isNonBinary()).toBe(false)
        })
    })

    describe('findByGender', () => {
        it('should find gender by gender type', async () => {
            // Arrange
            const genderType = GenderType.BIGENDER
            const gender = Gender.create({
                gender: genderType
            })
            await repository.save(gender)

            // Act
            const foundGender = await repository.findByGender(genderType)

            // Assert
            expect(foundGender).toBeDefined()
            expect(foundGender?.gender).toBe(genderType)
            expect(foundGender?.id).toBe(gender.id)
        })

        it('should return null for non-existent gender type', async () => {
            // Act
            const result = await repository.findByGender('NON_EXISTENT')

            // Assert
            expect(result).toBeNull()
        })

        it('should handle string-based gender search', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.PAN_GENDER
            })
            await repository.save(gender)

            // Act
            const foundGender = await repository.findByGender(GenderType.PAN_GENDER.toString())

            // Assert
            expect(foundGender).toBeDefined()
            expect(foundGender?.gender).toBe(GenderType.PAN_GENDER)
        })
    })

    describe('existsByGender', () => {
        it('should return true for existing gender type', async () => {
            // Arrange
            const genderType = GenderType.DEMI_GENDER
            const gender = Gender.create({
                gender: genderType
            })
            await repository.save(gender)

            // Act
            const exists = await repository.existsByGender(genderType)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent gender type', async () => {
            // Act
            const exists = await repository.existsByGender('NON_EXISTENT')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('existsById', () => {
        it('should return true for existing gender id', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.MALE
            })
            const savedGender = await repository.save(gender)

            // Act
            const exists = await repository.existsById(savedGender.id)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent gender id', async () => {
            // Act
            const exists = await repository.existsById('non-existent-id')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('delete', () => {
        it('should delete gender successfully', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.FEMALE
            })
            const savedGender = await repository.save(gender)

            // Act
            await repository.delete(savedGender.id)

            // Assert
            const deletedGender = await repository.findById(savedGender.id)
            expect(deletedGender).toBeNull()
        })

        it('should handle deletion of non-existent gender', async () => {
            // Act & Assert
            await expect(repository.delete('non-existent-id')).rejects.toThrow()
        })
    })

    describe('findAll', () => {
        it('should return all genders', async () => {
            // Arrange
            const genders = [
                Gender.create({ gender: GenderType.MALE }),
                Gender.create({ gender: GenderType.FEMALE }),
                Gender.create({ gender: GenderType.OTHER })
            ]

            for (const gender of genders) {
                await repository.save(gender)
            }

            // Act
            const allGenders = await repository.findAll()

            // Assert
            expect(allGenders).toHaveLength(3)
            expect(allGenders.every(gender => gender instanceof Gender)).toBe(true)
        })

        it('should return empty array when no genders exist', async () => {
            // Act
            const allGenders = await repository.findAll()

            // Assert
            expect(allGenders).toEqual([])
        })

        it('should return genders in creation order', async () => {
            // Arrange
            const firstGender = Gender.create({ gender: GenderType.MALE })
            const secondGender = Gender.create({ gender: GenderType.FEMALE })

            await repository.save(firstGender)
            // Small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 10))
            await repository.save(secondGender)

            // Act
            const allGenders = await repository.findAll()

            // Assert
            expect(allGenders).toHaveLength(2)
            expect(allGenders[0].createdAt.getTime()).toBeLessThanOrEqual(allGenders[1].createdAt.getTime())
        })
    })

    describe('domain methods validation', () => {
        it('should validate gender domain methods', async () => {
            // Arrange
            const maleGender = Gender.create({ gender: GenderType.MALE })
            const femaleGender = Gender.create({ gender: GenderType.FEMALE })
            const otherGender = Gender.create({ gender: GenderType.OTHER })
            const nonBinaryGender = Gender.create({ gender: GenderType.NON_BINARY })

            await repository.save(maleGender)
            await repository.save(femaleGender)
            await repository.save(otherGender)
            await repository.save(nonBinaryGender)

            // Act
            const savedMale = await repository.findById(maleGender.id)
            const savedFemale = await repository.findById(femaleGender.id)
            const savedOther = await repository.findById(otherGender.id)
            const savedNonBinary = await repository.findById(nonBinaryGender.id)

            // Assert
            expect(savedMale?.isMale()).toBe(true)
            expect(savedMale?.isFemale()).toBe(false)

            expect(savedFemale?.isFemale()).toBe(true)
            expect(savedFemale?.isMale()).toBe(false)

            expect(savedOther?.isOther()).toBe(true)
            expect(savedOther?.isMale()).toBe(false)

            expect(savedNonBinary?.isNonBinary()).toBe(true)
            expect(savedNonBinary?.isMale()).toBe(false)
        })
    })

    describe('error handling', () => {
        it('should handle database connection errors gracefully', async () => {
            // Arrange
            const disconnectedPrisma = new PrismaService()
            const disconnectedRepository = new GenderPrismaRepository(disconnectedPrisma)
            const gender = Gender.create({
                gender: GenderType.MALE
            })

            // Act & Assert
            await expect(disconnectedRepository.save(gender)).rejects.toThrow()
        })

        it('should handle constraint violations appropriately', async () => {
            // This test checks if we can save the same gender type multiple times
            // which should be allowed for the gender entity
            const gender1 = Gender.create({ gender: GenderType.MALE })
            const gender2 = Gender.create({ gender: GenderType.MALE })

            // Act & Assert
            await expect(repository.save(gender1)).resolves.not.toThrow()
            await expect(repository.save(gender2)).resolves.not.toThrow()

            // Both should exist with different IDs
            expect(gender1.id).not.toBe(gender2.id)
        })
    })

    describe('data integrity', () => {
        it('should maintain data consistency across operations', async () => {
            // Arrange
            const genderData = {
                gender: GenderType.AGENDER
            }
            const gender = Gender.create(genderData)

            // Act
            const saved = await repository.save(gender)
            const foundById = await repository.findById(saved.id)
            const foundByGender = await repository.findByGender(saved.gender)
            const existsById = await repository.existsById(saved.id)
            const existsByGender = await repository.existsByGender(saved.gender)

            // Assert
            expect(foundById?.id).toBe(saved.id)
            expect(foundByGender?.id).toBe(saved.id)
            expect(foundById?.gender).toBe(foundByGender?.gender)
            expect(existsById).toBe(true)
            expect(existsByGender).toBe(true)
        })

        it('should maintain proper timestamps', async () => {
            // Arrange
            const gender = Gender.create({
                gender: GenderType.GENDERFLUID
            })

            // Act
            const savedGender = await repository.save(gender)

            // Assert
            expect(savedGender.createdAt).toEqual(gender.createdAt)
            expect(savedGender.updatedAt).toEqual(gender.updatedAt)
            expect(savedGender.createdAt).toBeInstanceOf(Date)
            expect(savedGender.updatedAt).toBeInstanceOf(Date)
        })
    })
})
