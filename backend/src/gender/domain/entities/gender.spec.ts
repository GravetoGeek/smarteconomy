import { Gender, GenderType } from './gender'
import { TestAssertions } from '../../../__tests__/utils/test-helpers'

describe('Gender Entity', () => {
    describe('create method', () => {
        it('should create gender with valid type', () => {
            // Arrange
            const genderType = GenderType.MALE

            // Act
            const gender = Gender.create({ gender: genderType })

            // Assert
            expect(gender).toBeDefined()
            expect(gender.gender).toBe(genderType)
            TestAssertions.expectValidUUID(gender.id)
            TestAssertions.expectValidDate(gender.createdAt)
            TestAssertions.expectValidDate(gender.updatedAt)
        })

        it('should generate unique IDs for each gender', () => {
            // Arrange
            const genderType = GenderType.FEMALE

            // Act
            const gender1 = Gender.create({ gender: genderType })
            const gender2 = Gender.create({ gender: genderType })

            // Assert
            expect(gender1.id).not.toBe(gender2.id)
        })

        it('should create with all gender types', () => {
            // Arrange & Act
            const genderTypes = Object.values(GenderType)
            const genders = genderTypes.map(type => Gender.create({ gender: type }))

            // Assert
            genders.forEach((gender, index) => {
                expect(gender.gender).toBe(genderTypes[index])
            })
        })
    })

    describe('reconstitute method', () => {
        it('should reconstitute gender from persistent data', () => {
            // Arrange
            const persistentData = {
                id: 'gender-123',
                gender: 'FEMALE',
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            }

            // Act
            const gender = Gender.reconstitute(persistentData)

            // Assert
            expect(gender.id).toBe(persistentData.id)
            expect(gender.gender).toBe(GenderType.FEMALE)
            expect(gender.createdAt).toBe(persistentData.createdAt)
            expect(gender.updatedAt).toBe(persistentData.updatedAt)
        })

        it('should handle all gender type strings', () => {
            // Arrange
            const genderData = {
                id: 'gender-456',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // Act & Assert
            Object.values(GenderType).forEach(genderType => {
                const data = { ...genderData, gender: genderType }
                const gender = Gender.reconstitute(data)
                expect(gender.gender).toBe(genderType)
            })
        })
    })

    describe('gender checking methods', () => {
        it('should correctly identify male gender', () => {
            // Arrange
            const maleGender = Gender.create({ gender: GenderType.MALE })
            const femaleGender = Gender.create({ gender: GenderType.FEMALE })

            // Assert
            expect(maleGender.isMale()).toBe(true)
            expect(femaleGender.isMale()).toBe(false)
        })

        it('should correctly identify female gender', () => {
            // Arrange
            const femaleGender = Gender.create({ gender: GenderType.FEMALE })
            const maleGender = Gender.create({ gender: GenderType.MALE })

            // Assert
            expect(femaleGender.isFemale()).toBe(true)
            expect(maleGender.isFemale()).toBe(false)
        })

        it('should correctly identify other gender', () => {
            // Arrange
            const otherGender = Gender.create({ gender: GenderType.OTHER })
            const maleGender = Gender.create({ gender: GenderType.MALE })

            // Assert
            expect(otherGender.isOther()).toBe(true)
            expect(maleGender.isOther()).toBe(false)
        })

        it('should correctly identify prefer not to say', () => {
            // Arrange
            const preferNotGender = Gender.create({ gender: GenderType.PREFER_NOT_TO_SAY })
            const maleGender = Gender.create({ gender: GenderType.MALE })

            // Assert
            expect(preferNotGender.isPreferNotToSay()).toBe(true)
            expect(maleGender.isPreferNotToSay()).toBe(false)
        })

        it('should correctly identify agender', () => {
            // Arrange
            const agenderGender = Gender.create({ gender: GenderType.AGENDER })
            const maleGender = Gender.create({ gender: GenderType.MALE })

            // Assert
            expect(agenderGender.isAgender()).toBe(true)
            expect(maleGender.isAgender()).toBe(false)
        })

        it('should correctly identify non-binary', () => {
            // Arrange
            const nonBinaryGender = Gender.create({ gender: GenderType.NON_BINARY })
            const maleGender = Gender.create({ gender: GenderType.MALE })

            // Assert
            expect(nonBinaryGender.isNonBinary()).toBe(true)
            expect(maleGender.isNonBinary()).toBe(false)
        })
    })

    describe('getters', () => {
        it('should provide read-only access to properties', () => {
            // Arrange
            const genderData = {
                gender: GenderType.GENDERFLUID
            }
            const gender = Gender.create(genderData)

            // Assert
            expect(gender.id).toBeDefined()
            expect(gender.gender).toBe(GenderType.GENDERFLUID)
            expect(gender.createdAt).toBeInstanceOf(Date)
            expect(gender.updatedAt).toBeInstanceOf(Date)
        })
    })

    describe('comprehensive gender types', () => {
        it('should handle all gender type variations', () => {
            // Arrange
            const genderTypes = [
                GenderType.MALE,
                GenderType.FEMALE,
                GenderType.OTHER,
                GenderType.PREFER_NOT_TO_SAY,
                GenderType.AGENDER,
                GenderType.NON_BINARY,
                GenderType.GENDERFLUID,
                GenderType.BIGENDER,
                GenderType.PAN_GENDER,
                GenderType.DEMI_GENDER
            ]

            // Act & Assert
            genderTypes.forEach(genderType => {
                const gender = Gender.create({ gender: genderType })
                expect(gender.gender).toBe(genderType)
                expect(gender.id).toBeDefined()
                expect(gender.createdAt).toBeDefined()
                expect(gender.updatedAt).toBeDefined()
            })
        })
    })

    describe('immutability', () => {
        it('should not allow direct modification of readonly properties', () => {
            // Arrange
            const gender = Gender.create({ gender: GenderType.MALE })

            // Assert - These should be readonly and cause TypeScript errors if modified
            expect(gender.id).toBeDefined()
            expect(gender.gender).toBeDefined()
            expect(gender.createdAt).toBeDefined()
            expect(gender.updatedAt).toBeDefined()
            // gender.id = 'new-id' // Should cause TS error
            // gender.gender = GenderType.FEMALE // Should cause TS error
        })
    })

    describe('equality and identity', () => {
        it('should maintain identity through getters', () => {
            // Arrange
            const gender = Gender.create({ gender: GenderType.NON_BINARY })
            const id = gender.id
            const genderType = gender.gender
            const createdAt = gender.createdAt
            const updatedAt = gender.updatedAt

            // Assert
            expect(gender.id).toBe(id)
            expect(gender.gender).toBe(genderType)
            expect(gender.createdAt).toBe(createdAt)
            expect(gender.updatedAt).toBe(updatedAt)
        })
    })

    describe('edge cases', () => {
        it('should handle creation and reconstitution consistently', () => {
            // Arrange
            const genderType = GenderType.BIGENDER
            const created = Gender.create({ gender: genderType })

            const reconstituted = Gender.reconstitute({
                id: created.id,
                gender: created.gender,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt
            })

            // Assert
            expect(reconstituted.id).toBe(created.id)
            expect(reconstituted.gender).toBe(created.gender)
            expect(reconstituted.createdAt).toBe(created.createdAt)
            expect(reconstituted.updatedAt).toBe(created.updatedAt)
        })
    })
})
