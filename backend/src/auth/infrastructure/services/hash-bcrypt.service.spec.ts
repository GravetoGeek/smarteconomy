import { Test, TestingModule } from '@nestjs/testing'
import { HashBcryptService } from './hash-bcrypt.service'

describe('HashBcryptService', () => {
    let service: HashBcryptService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HashBcryptService]
        }).compile()

        service = module.get<HashBcryptService>(HashBcryptService)
    })

    describe('hash', () => {
        it('should hash a password successfully', async () => {
            // Arrange
            const password = 'testPassword123'

            // Act
            const hashedPassword = await service.hash(password)

            // Assert
            expect(hashedPassword).toBeDefined()
            expect(typeof hashedPassword).toBe('string')
            expect(hashedPassword).not.toBe(password)
            expect(hashedPassword.length).toBeGreaterThan(0)
        })

        it('should generate different hashes for same password', async () => {
            // Arrange
            const password = 'samePassword123'

            // Act
            const hash1 = await service.hash(password)
            const hash2 = await service.hash(password)

            // Assert
            expect(hash1).not.toBe(hash2)
            expect(hash1).toBeDefined()
            expect(hash2).toBeDefined()
        })

        it('should handle empty password', async () => {
            // Arrange
            const emptyPassword = ''

            // Act
            const hashedPassword = await service.hash(emptyPassword)

            // Assert
            expect(hashedPassword).toBeDefined()
            expect(typeof hashedPassword).toBe('string')
        })

        it('should handle password with special characters', async () => {
            // Arrange
            const specialPassword = 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?'

            // Act
            const hashedPassword = await service.hash(specialPassword)

            // Assert
            expect(hashedPassword).toBeDefined()
            expect(hashedPassword).not.toBe(specialPassword)
        })

        it('should handle very long password', async () => {
            // Arrange
            const longPassword = 'a'.repeat(1000)

            // Act
            const hashedPassword = await service.hash(longPassword)

            // Assert
            expect(hashedPassword).toBeDefined()
            expect(hashedPassword).not.toBe(longPassword)
        })

        it('should handle unicode characters', async () => {
            // Arrange
            const unicodePassword = 'pássword测试🚀'

            // Act
            const hashedPassword = await service.hash(unicodePassword)

            // Assert
            expect(hashedPassword).toBeDefined()
            expect(hashedPassword).not.toBe(unicodePassword)
        })

        it('should use consistent salt rounds', async () => {
            // Arrange
            const password = 'testPassword'

            // Act
            const hash1 = await service.hash(password)
            const hash2 = await service.hash(password)

            // Assert
            // Both hashes should have the same structure (bcrypt format)
            expect(hash1).toMatch(/^\$2[aby]?\$\d+\$/)
            expect(hash2).toMatch(/^\$2[aby]?\$\d+\$/)

            // Extract salt rounds from hash (should be consistent)
            const rounds1 = hash1.split('$')[2]
            const rounds2 = hash2.split('$')[2]
            expect(rounds1).toBe(rounds2)
        })
    })

    describe('compare', () => {
        it('should return true for correct password', async () => {
            // Arrange
            const password = 'correctPassword123'
            const hashedPassword = await service.hash(password)

            // Act
            const isMatch = await service.compare(password, hashedPassword)

            // Assert
            expect(isMatch).toBe(true)
        })

        it('should return false for incorrect password', async () => {
            // Arrange
            const correctPassword = 'correctPassword123'
            const incorrectPassword = 'wrongPassword123'
            const hashedPassword = await service.hash(correctPassword)

            // Act
            const isMatch = await service.compare(incorrectPassword, hashedPassword)

            // Assert
            expect(isMatch).toBe(false)
        })

        it('should return false for empty password against hash', async () => {
            // Arrange
            const password = 'testPassword'
            const hashedPassword = await service.hash(password)

            // Act
            const isMatch = await service.compare('', hashedPassword)

            // Assert
            expect(isMatch).toBe(false)
        })

        it('should handle comparison with empty hash', async () => {
            // Arrange
            const password = 'testPassword'

            // Act
            const isMatch = await service.compare(password, '')

            // Assert
            expect(isMatch).toBe(false)
        })

        it('should handle comparison with malformed hash', async () => {
            // Arrange
            const password = 'testPassword'
            const malformedHash = 'not-a-valid-bcrypt-hash'

            // Act
            const isMatch = await service.compare(password, malformedHash)

            // Assert
            expect(isMatch).toBe(false)
        })

        it('should return true for password with special characters', async () => {
            // Arrange
            const specialPassword = 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?'
            const hashedPassword = await service.hash(specialPassword)

            // Act
            const isMatch = await service.compare(specialPassword, hashedPassword)

            // Assert
            expect(isMatch).toBe(true)
        })

        it('should return true for unicode password', async () => {
            // Arrange
            const unicodePassword = 'pássword测试🚀'
            const hashedPassword = await service.hash(unicodePassword)

            // Act
            const isMatch = await service.compare(unicodePassword, hashedPassword)

            // Assert
            expect(isMatch).toBe(true)
        })

        it('should be case sensitive', async () => {
            // Arrange
            const password = 'TestPassword123'
            const hashedPassword = await service.hash(password)

            // Act
            const isMatchLower = await service.compare('testpassword123', hashedPassword)
            const isMatchUpper = await service.compare('TESTPASSWORD123', hashedPassword)
            const isMatchCorrect = await service.compare('TestPassword123', hashedPassword)

            // Assert
            expect(isMatchLower).toBe(false)
            expect(isMatchUpper).toBe(false)
            expect(isMatchCorrect).toBe(true)
        })

        it('should handle whitespace differences', async () => {
            // Arrange
            const password = 'test password'
            const hashedPassword = await service.hash(password)

            // Act
            const isMatchWithTab = await service.compare('test\tpassword', hashedPassword)
            const isMatchWithExtra = await service.compare(' test password ', hashedPassword)
            const isMatchCorrect = await service.compare('test password', hashedPassword)

            // Assert
            expect(isMatchWithTab).toBe(false)
            expect(isMatchWithExtra).toBe(false)
            expect(isMatchCorrect).toBe(true)
        })

        it('should handle very long password comparison', async () => {
            // Arrange
            const longPassword = 'a'.repeat(1000)
            const hashedPassword = await service.hash(longPassword)

            // Act
            const isMatch = await service.compare(longPassword, hashedPassword)

            // Assert
            expect(isMatch).toBe(true)
        })
    })

    describe('integration scenarios', () => {
        it('should handle multiple password hashing and comparison', async () => {
            // Arrange
            const passwords = [
                'password1',
                'password2',
                'different_password'
            ]

            // Act
            const hashPromises = passwords.map(pwd => service.hash(pwd))
            const hashes = await Promise.all(hashPromises)

            // Assert - each password should match its own hash
            for (let i = 0; i < passwords.length; i++) {
                const isMatch = await service.compare(passwords[i], hashes[i])
                expect(isMatch).toBe(true)
            }

            // Assert - passwords should not match other hashes
            for (let i = 0; i < passwords.length; i++) {
                for (let j = 0; j < passwords.length; j++) {
                    if (i !== j) {
                        const isMatch = await service.compare(passwords[i], hashes[j])
                        expect(isMatch).toBe(false)
                    }
                }
            }
        }, 15000)

        it('should maintain consistency across multiple hash/compare cycles', async () => {
            // Arrange
            const password = 'consistencyTest123'

            // Act & Assert
            for (let i = 0; i < 3; i++) {
                const hashedPassword = await service.hash(password)
                const isMatch = await service.compare(password, hashedPassword)
                expect(isMatch).toBe(true)

                // Verify incorrect password still fails
                const isWrongMatch = await service.compare('wrongPassword', hashedPassword)
                expect(isWrongMatch).toBe(false)
            }
        }, 10000)

        it('should handle concurrent hashing operations', async () => {
            // Arrange
            const password = 'concurrentTest123'
            const operations = Array.from({ length: 10 }, () => service.hash(password))

            // Act
            const hashes = await Promise.all(operations)

            // Assert
            expect(hashes).toHaveLength(10)

            // All hashes should be different
            const uniqueHashes = new Set(hashes)
            expect(uniqueHashes.size).toBe(10)

            // All hashes should verify the original password
            const verificationPromises = hashes.map(hash => service.compare(password, hash))
            const verificationResults = await Promise.all(verificationPromises)

            verificationResults.forEach(result => {
                expect(result).toBe(true)
            })
        })

        it('should handle concurrent comparison operations', async () => {
            // Arrange
            const password = 'concurrentCompareTest'
            const hashedPassword = await service.hash(password)

            const operations = Array.from({ length: 10 }, () =>
                service.compare(password, hashedPassword)
            )

            // Act
            const results = await Promise.all(operations)

            // Assert
            expect(results).toHaveLength(10)
            results.forEach(result => {
                expect(result).toBe(true)
            })
        })
    })

    describe('error handling', () => {
        it('should handle null password input', async () => {
            // Act & Assert
            await expect(service.hash(null as any)).rejects.toThrow()
        })

        it('should handle undefined password input', async () => {
            // Act & Assert
            await expect(service.hash(undefined as any)).rejects.toThrow()
        })

        it('should handle null inputs in compare', async () => {
            // Arrange
            const password = 'test'
            const hash = await service.hash(password)

            // Act & Assert
            await expect(service.compare(null as any, hash)).rejects.toThrow()
            await expect(service.compare(password, null as any)).rejects.toThrow()
        })

        it('should handle undefined inputs in compare', async () => {
            // Arrange
            const password = 'test'
            const hash = await service.hash(password)

            // Act & Assert
            await expect(service.compare(undefined as any, hash)).rejects.toThrow()
            await expect(service.compare(password, undefined as any)).rejects.toThrow()
        })
    })

    describe('security considerations', () => {
        it('should use sufficient salt rounds for security', async () => {
            // Arrange
            const password = 'securityTest123'

            // Act
            const hashedPassword = await service.hash(password)

            // Assert
            // Extract salt rounds from bcrypt hash
            const saltRounds = parseInt(hashedPassword.split('$')[2])
            expect(saltRounds).toBeGreaterThanOrEqual(10) // Minimum recommended rounds
        })

        it('should produce hashes with proper bcrypt format', async () => {
            // Arrange
            const password = 'formatTest123'

            // Act
            const hashedPassword = await service.hash(password)

            // Assert
            // Bcrypt format: $2a$rounds$salt[22chars]hash[31chars]
            expect(hashedPassword).toMatch(/^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/)
        })

        it('should take reasonable time to hash (timing attack resistance)', async () => {
            // Arrange
            const password = 'timingTest123'
            const startTime = process.hrtime.bigint()

            // Act
            await service.hash(password)

            // Assert
            const endTime = process.hrtime.bigint()
            const durationMs = Number(endTime - startTime) / 1000000

            // Should take at least 10ms (indicates proper salt rounds)
            expect(durationMs).toBeGreaterThan(10)

            // Should not take more than 5 seconds (reasonable upper bound)
            expect(durationMs).toBeLessThan(5000)
        })

        it('should resist rainbow table attacks with different salts', async () => {
            // Arrange
            const password = 'rainbowTest123'

            // Act
            const hash1 = await service.hash(password)
            const hash2 = await service.hash(password)

            // Assert
            // Extract salt from hashes
            const salt1 = hash1.split('$').slice(0, 4).join('$')
            const salt2 = hash2.split('$').slice(0, 4).join('$')

            expect(salt1).not.toBe(salt2) // Different salts
            expect(hash1).not.toBe(hash2) // Different hashes
        })
    })
})
