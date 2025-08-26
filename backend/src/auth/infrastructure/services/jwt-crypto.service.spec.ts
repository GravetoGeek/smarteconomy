import { Test, TestingModule } from '@nestjs/testing'
import { JwtCryptoService } from './jwt-crypto.service'
import { JwtPayload } from '../../domain/ports/jwt-service.port'

describe('JwtCryptoService', () => {
    let service: JwtCryptoService

    const mockPayload: JwtPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'USER'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtCryptoService]
        }).compile()

        service = module.get<JwtCryptoService>(JwtCryptoService)
    })

    describe('sign', () => {
        it('should generate a JWT token with correct structure', async () => {
            // Act
            const token = await service.sign(mockPayload)

            // Assert
            expect(token).toBeDefined()
            expect(typeof token).toBe('string')

            const parts = token.split('.')
            expect(parts).toHaveLength(3)

            // Verify each part is base64url encoded
            parts.forEach(part => {
                expect(part).toMatch(/^[A-Za-z0-9_-]+$/)
            })
        })

        it('should include provided payload data in token', async () => {
            // Act
            const token = await service.sign(mockPayload)

            // Assert
            const decoded = service.decode(token)
            expect(decoded).toMatchObject({
                sub: mockPayload.sub,
                email: mockPayload.email,
                role: mockPayload.role
            })
        })

        it('should add timestamp fields to payload', async () => {
            // Arrange
            const beforeSign = Math.floor(Date.now() / 1000)

            // Act
            const token = await service.sign(mockPayload)

            // Assert
            const decoded = service.decode(token)
            expect(decoded?.iat).toBeGreaterThanOrEqual(beforeSign)
            expect(decoded?.exp).toBeGreaterThan(decoded?.iat || 0)

            // Token should expire in 24 hours (86400 seconds)
            expect(decoded?.exp).toBe((decoded?.iat || 0) + (24 * 60 * 60))
        })

        it('should generate different tokens for different payloads', async () => {
            // Arrange
            const payload1 = { ...mockPayload, sub: 'user-1' }
            const payload2 = { ...mockPayload, sub: 'user-2' }

            // Act
            const token1 = await service.sign(payload1)
            const token2 = await service.sign(payload2)

            // Assert
            expect(token1).not.toBe(token2)
        })

        it('should handle payload with additional fields', async () => {
            // Arrange
            const extendedPayload = {
                ...mockPayload,
                customField: 'customValue',
                permissions: ['read', 'write']
            }

            // Act
            const token = await service.sign(extendedPayload)

            // Assert
            const decoded = service.decode(token)
            expect((decoded as any)?.customField).toBe('customValue')
            expect((decoded as any)?.permissions).toEqual(['read', 'write'])
        })

        it('should handle empty payload', async () => {
            // Arrange
            const emptyPayload = {} as JwtPayload

            // Act
            const token = await service.sign(emptyPayload)

            // Assert
            expect(token).toBeDefined()
            const decoded = service.decode(token)
            expect(decoded).toHaveProperty('iat')
            expect(decoded).toHaveProperty('exp')
        })
    })

    describe('verify', () => {
        it('should verify valid token and return payload', async () => {
            // Arrange
            const token = await service.sign(mockPayload)

            // Act
            const result = await service.verify(token)

            // Assert
            expect(result).toMatchObject(mockPayload)
            expect(result.iat).toBeDefined()
            expect(result.exp).toBeDefined()
        })

        it('should throw error for malformed token', async () => {
            // Arrange
            const malformedToken = 'not.a.valid.jwt'

            // Act & Assert
            await expect(service.verify(malformedToken)).rejects.toThrow('Invalid token')
        })

        it('should throw error for token with invalid signature', async () => {
            // Arrange
            const token = await service.sign(mockPayload)
            const tamperedToken = token.slice(0, -5) + 'XXXXX' // Tamper with signature

            // Act & Assert
            await expect(service.verify(tamperedToken)).rejects.toThrow('Invalid token')
        })

        it('should throw error for token with wrong number of parts', async () => {
            // Arrange
            const invalidTokenStructure = 'header.payload' // Missing signature

            // Act & Assert
            await expect(service.verify(invalidTokenStructure)).rejects.toThrow('Invalid token')
        })

        it('should throw error for expired token', async () => {
            // Arrange
            const expiredPayload = {
                ...mockPayload,
                iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
                exp: Math.floor(Date.now() / 1000) - 1800   // 30 minutes ago
            }

            // Create token manually with expired timestamp
            const header = { alg: 'HS256', typ: 'JWT' }
            const encodedHeader = (service as any).base64UrlEncode(JSON.stringify(header))
            const encodedPayload = (service as any).base64UrlEncode(JSON.stringify(expiredPayload))
            const signature = (service as any).createSignature(`${encodedHeader}.${encodedPayload}`)
            const encodedSignature = (service as any).base64UrlEncode(signature)
            const expiredToken = `${encodedHeader}.${encodedPayload}.${encodedSignature}`

            // Act & Assert
            await expect(service.verify(expiredToken)).rejects.toThrow('Invalid token')
        })

        it('should handle token with corrupted payload', async () => {
            // Arrange
            const token = await service.sign(mockPayload)
            const parts = token.split('.')
            const corruptedPayload = parts[1].slice(0, -3) + 'XXX' // Corrupt payload
            const corruptedToken = `${parts[0]}.${corruptedPayload}.${parts[2]}`

            // Act & Assert
            await expect(service.verify(corruptedToken)).rejects.toThrow('Invalid token')
        })

        it('should verify token without expiration field', async () => {
            // Arrange
            const payloadWithoutExp = { ...mockPayload }
            delete (payloadWithoutExp as any).exp

            const header = { alg: 'HS256', typ: 'JWT' }
            const encodedHeader = (service as any).base64UrlEncode(JSON.stringify(header))
            const encodedPayload = (service as any).base64UrlEncode(JSON.stringify(payloadWithoutExp))
            const signature = (service as any).createSignature(`${encodedHeader}.${encodedPayload}`)
            const encodedSignature = (service as any).base64UrlEncode(signature)
            const tokenWithoutExp = `${encodedHeader}.${encodedPayload}.${encodedSignature}`

            // Act
            const result = await service.verify(tokenWithoutExp)

            // Assert
            expect(result).toMatchObject(payloadWithoutExp)
        })
    })

    describe('decode', () => {
        it('should decode valid token without verification', async () => {
            // Arrange
            const token = await service.sign(mockPayload)

            // Act
            const result = service.decode(token)

            // Assert
            expect(result).toMatchObject(mockPayload)
            expect(result?.iat).toBeDefined()
            expect(result?.exp).toBeDefined()
        })

        it('should return null for malformed token', () => {
            // Arrange
            const malformedToken = 'not.a.jwt'

            // Act
            const result = service.decode(malformedToken)

            // Assert
            expect(result).toBeNull()
        })

        it('should return null for token with wrong number of parts', () => {
            // Arrange
            const invalidToken = 'header.payload' // Missing signature

            // Act
            const result = service.decode(invalidToken)

            // Assert
            expect(result).toBeNull()
        })

        it('should decode token even with invalid signature', async () => {
            // Arrange
            const token = await service.sign(mockPayload)
            const tamperedToken = token.slice(0, -5) + 'XXXXX' // Tamper with signature

            // Act
            const result = service.decode(tamperedToken)

            // Assert
            // Decode should work regardless of signature validity
            expect(result).toMatchObject(mockPayload)
        })

        it('should decode expired token', async () => {
            // Arrange
            const expiredPayload = {
                ...mockPayload,
                exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
            }

            const header = { alg: 'HS256', typ: 'JWT' }
            const encodedHeader = (service as any).base64UrlEncode(JSON.stringify(header))
            const encodedPayload = (service as any).base64UrlEncode(JSON.stringify(expiredPayload))
            const signature = (service as any).createSignature(`${encodedHeader}.${encodedPayload}`)
            const encodedSignature = (service as any).base64UrlEncode(signature)
            const expiredToken = `${encodedHeader}.${encodedPayload}.${encodedSignature}`

            // Act
            const result = service.decode(expiredToken)

            // Assert
            // Decode should work even for expired tokens
            expect(result).toMatchObject(expiredPayload)
        })

        it('should handle token with corrupted but decodable payload', () => {
            // Arrange
            const payload = { test: 'data' }
            const encodedPayload = (service as any).base64UrlEncode(JSON.stringify(payload))
            const tokenWithValidPayload = `header.${encodedPayload}.signature`

            // Act
            const result = service.decode(tokenWithValidPayload)

            // Assert
            expect(result).toEqual(payload)
        })
    })

    describe('private methods', () => {
        describe('base64UrlEncode/Decode', () => {
            it('should encode and decode strings correctly', () => {
                // Arrange
                const testString = '{"sub":"test","data":"value"}'

                // Act
                const encoded = (service as any).base64UrlEncode(testString)
                const decoded = (service as any).base64UrlDecode(encoded)

                // Assert
                expect(decoded).toBe(testString)
                expect(encoded).not.toContain('+')
                expect(encoded).not.toContain('/')
                expect(encoded).not.toContain('=')
            })

            it('should handle special characters', () => {
                // Arrange
                const testString = 'test+/=data'

                // Act
                const encoded = (service as any).base64UrlEncode(testString)
                const decoded = (service as any).base64UrlDecode(encoded)

                // Assert
                expect(decoded).toBe(testString)
            })

            it('should handle empty string', () => {
                // Arrange
                const emptyString = ''

                // Act
                const encoded = (service as any).base64UrlEncode(emptyString)
                const decoded = (service as any).base64UrlDecode(encoded)

                // Assert
                expect(decoded).toBe(emptyString)
            })

            it('should handle unicode characters', () => {
                // Arrange
                const unicodeString = 'test 测试 🚀'

                // Act
                const encoded = (service as any).base64UrlEncode(unicodeString)
                const decoded = (service as any).base64UrlDecode(encoded)

                // Assert
                expect(decoded).toBe(unicodeString)
            })
        })

        describe('createSignature', () => {
            it('should create consistent signatures for same data', () => {
                // Arrange
                const testData = 'test.data.string'

                // Act
                const signature1 = (service as any).createSignature(testData)
                const signature2 = (service as any).createSignature(testData)

                // Assert
                expect(signature1).toBe(signature2)
            })

            it('should create different signatures for different data', () => {
                // Arrange
                const data1 = 'test.data.one'
                const data2 = 'test.data.two'

                // Act
                const signature1 = (service as any).createSignature(data1)
                const signature2 = (service as any).createSignature(data2)

                // Assert
                expect(signature1).not.toBe(signature2)
            })
        })

        describe('simpleHash', () => {
            it('should create consistent hashes for same input', () => {
                // Arrange
                const testInput = 'test input string'

                // Act
                const hash1 = (service as any).simpleHash(testInput)
                const hash2 = (service as any).simpleHash(testInput)

                // Assert
                expect(hash1).toBe(hash2)
            })

            it('should create different hashes for different inputs', () => {
                // Arrange
                const input1 = 'test input one'
                const input2 = 'test input two'

                // Act
                const hash1 = (service as any).simpleHash(input1)
                const hash2 = (service as any).simpleHash(input2)

                // Assert
                expect(hash1).not.toBe(hash2)
            })

            it('should handle empty string', () => {
                // Arrange
                const emptyInput = ''

                // Act
                const hash = (service as any).simpleHash(emptyInput)

                // Assert
                expect(hash).toBeDefined()
                expect(typeof hash).toBe('string')
            })
        })
    })

    describe('integration scenarios', () => {
        it('should handle sign -> verify -> decode workflow', async () => {
            // Arrange
            const originalPayload = {
                ...mockPayload,
                permissions: ['read', 'write'],
                sessionId: 'session-123'
            }

            // Act
            const token = await service.sign(originalPayload)
            const verifiedPayload = await service.verify(token)
            const decodedPayload = service.decode(token)

            // Assert
            expect(verifiedPayload).toMatchObject(originalPayload)
            expect(decodedPayload).toMatchObject(originalPayload)
            expect(verifiedPayload).toEqual(decodedPayload)
        })

        it('should handle multiple tokens with different payloads', async () => {
            // Arrange
            const payload1 = { ...mockPayload, sub: 'user-1', role: 'USER' }
            const payload2 = { ...mockPayload, sub: 'user-2', role: 'ADMIN' }

            // Act
            const token1 = await service.sign(payload1)
            const token2 = await service.sign(payload2)

            const verified1 = await service.verify(token1)
            const verified2 = await service.verify(token2)

            // Assert
            expect(verified1.sub).toBe('user-1')
            expect(verified1.role).toBe('USER')
            expect(verified2.sub).toBe('user-2')
            expect(verified2.role).toBe('ADMIN')
        })

        it('should maintain token integrity across encode/decode cycles', async () => {
            // Arrange
            const complexPayload = {
                ...mockPayload,
                metadata: {
                    loginTime: new Date().toISOString(),
                    ipAddress: '192.168.1.1',
                    userAgent: 'Mozilla/5.0'
                },
                permissions: ['read', 'write', 'delete'],
                preferences: {
                    theme: 'dark',
                    language: 'pt-BR'
                }
            }

            // Act
            const token = await service.sign(complexPayload)
            const decoded = service.decode(token)
            const verified = await service.verify(token)

            // Assert
            expect(decoded).toMatchObject(complexPayload)
            expect(verified).toMatchObject(complexPayload)
            expect((decoded as any)?.metadata).toEqual(complexPayload.metadata)
            expect((verified as any).preferences).toEqual(complexPayload.preferences)
        })
    })
})
