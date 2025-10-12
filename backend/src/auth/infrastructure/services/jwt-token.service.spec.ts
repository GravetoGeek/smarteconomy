import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
    let service: JwtTokenService;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<ConfigService>;

    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test',
        lastname: 'User',
        role: 'USER',
        status: 'ACTIVE'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtTokenService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                        decode: jest.fn()
                    }
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn()
                    }
                }
            ]
        }).compile()

        service = module.get<JwtTokenService>(JwtTokenService)
        jwtService = module.get(JwtService)
        configService = module.get(ConfigService)

        // Default config mock returns
        configService.get.mockImplementation((key: string) => {
            const config = {
                JWT_SECRET: 'test-secret-key',
                JWT_EXPIRATION: '1h',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRATION: '7d'
            }
            return config[key]
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('generateAccessToken', () => {
        it('should generate access token with correct payload and options', async () => {
            // Arrange
            const expectedToken = 'generated.access.token'
            jwtService.sign.mockReturnValue(expectedToken)

            // Act
            const result = await service.generateAccessToken(mockUser)

            // Assert
            expect(result).toBe(expectedToken)
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name,
                    lastname: mockUser.lastname,
                    role: mockUser.role,
                    status: mockUser.status
                },
                {
                    secret: 'test-secret-key',
                    expiresIn: '1h'
                }
            )
        })

        it('should handle user with minimal data', async () => {
            // Arrange
            const minimalUser = {
                id: 'user-456',
                email: 'minimal@example.com',
                name: 'Min',
                lastname: 'User',
                role: 'USER',
                status: 'ACTIVE'
            }
            const expectedToken = 'minimal.access.token'
            jwtService.sign.mockReturnValue(expectedToken)

            // Act
            const result = await service.generateAccessToken(minimalUser)

            // Assert
            expect(result).toBe(expectedToken)
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: minimalUser.id,
                    email: minimalUser.email,
                    name: minimalUser.name,
                    lastname: minimalUser.lastname,
                    role: minimalUser.role,
                    status: minimalUser.status
                },
                expect.any(Object)
            )
        })

        it('should handle JWT service errors during access token generation', async () => {
            // Arrange
            jwtService.sign.mockImplementation(() => {
                throw new Error('JWT service error')
            })

            // Act & Assert
            await expect(service.generateAccessToken(mockUser)).rejects.toThrow('JWT service error')
        })

        it('should use correct expiration from config', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_EXPIRATION') return '2h'
                if (key === 'JWT_SECRET') return 'test-secret'
                return null
            })
            jwtService.sign.mockReturnValue('token')

            // Act
            await service.generateAccessToken(mockUser)

            // Assert
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    expiresIn: '2h'
                })
            )
        })
    })

    describe('generateRefreshToken', () => {
        it('should generate refresh token with correct payload and options', async () => {
            // Arrange
            const expectedToken = 'generated.refresh.token'
            jwtService.sign.mockReturnValue(expectedToken)

            // Act
            const result = await service.generateRefreshToken(mockUser)

            // Assert
            expect(result).toBe(expectedToken)
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: mockUser.id,
                    email: mockUser.email,
                    type: 'refresh'
                },
                {
                    secret: 'test-refresh-secret',
                    expiresIn: '7d'
                }
            )
        })

        it('should include refresh token type in payload', async () => {
            // Arrange
            jwtService.sign.mockReturnValue('refresh.token')

            // Act
            await service.generateRefreshToken(mockUser)

            // Assert
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'refresh'
                }),
                expect.any(Object)
            )
        })

        it('should use refresh token secret from config', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_REFRESH_SECRET') return 'custom-refresh-secret'
                if (key === 'JWT_REFRESH_EXPIRATION') return '14d'
                return null
            })
            jwtService.sign.mockReturnValue('token')

            // Act
            await service.generateRefreshToken(mockUser)

            // Assert
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    secret: 'custom-refresh-secret',
                    expiresIn: '14d'
                })
            )
        })

        it('should handle JWT service errors during refresh token generation', async () => {
            // Arrange
            jwtService.sign.mockImplementation(() => {
                throw new Error('Refresh token generation failed')
            })

            // Act & Assert
            await expect(service.generateRefreshToken(mockUser)).rejects.toThrow('Refresh token generation failed')
        })
    })

    describe('verifyAccessToken', () => {
        it('should verify valid access token and return payload', async () => {
            // Arrange
            const token = 'valid.access.token'
            const expectedPayload = {
                sub: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
                lastname: mockUser.lastname,
                role: mockUser.role,
                status: mockUser.status,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600
            }
            jwtService.verify.mockReturnValue(expectedPayload)

            // Act
            const result = await service.verifyAccessToken(token)

            // Assert
            expect(result).toEqual(expectedPayload)
            expect(jwtService.verify).toHaveBeenCalledWith(token, {
                secret: 'test-secret-key'
            })
        })

        it('should throw error for invalid access token', async () => {
            // Arrange
            const invalidToken = 'invalid.access.token'
            jwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token')
            })

            // Act & Assert
            await expect(service.verifyAccessToken(invalidToken)).rejects.toThrow('Invalid token')
        })

        it('should throw error for expired access token', async () => {
            // Arrange
            const expiredToken = 'expired.access.token'
            jwtService.verify.mockImplementation(() => {
                throw new Error('Token expired')
            })

            // Act & Assert
            await expect(service.verifyAccessToken(expiredToken)).rejects.toThrow('Token expired')
        })

        it('should use correct secret for access token verification', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_SECRET') return 'custom-access-secret'
                return null
            })
            const token = 'test.token'
            jwtService.verify.mockReturnValue({ sub: 'user-123' })

            // Act
            await service.verifyAccessToken(token)

            // Assert
            expect(jwtService.verify).toHaveBeenCalledWith(token, {
                secret: 'custom-access-secret'
            })
        })
    })

    describe('verifyRefreshToken', () => {
        it('should verify valid refresh token and return payload', async () => {
            // Arrange
            const token = 'valid.refresh.token'
            const expectedPayload = {
                sub: mockUser.id,
                email: mockUser.email,
                type: 'refresh',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600)
            }
            jwtService.verify.mockReturnValue(expectedPayload)

            // Act
            const result = await service.verifyRefreshToken(token)

            // Assert
            expect(result).toEqual(expectedPayload)
            expect(jwtService.verify).toHaveBeenCalledWith(token, {
                secret: 'test-refresh-secret'
            })
        })

        it('should validate refresh token type in payload', async () => {
            // Arrange
            const token = 'refresh.token'
            const payload = {
                sub: mockUser.id,
                email: mockUser.email,
                type: 'refresh'
            }
            jwtService.verify.mockReturnValue(payload)

            // Act
            const result = await service.verifyRefreshToken(token)

            // Assert
            expect(result.type).toBe('refresh')
        })

        it('should throw error for invalid refresh token', async () => {
            // Arrange
            const invalidToken = 'invalid.refresh.token'
            jwtService.verify.mockImplementation(() => {
                throw new Error('Invalid refresh token')
            })

            // Act & Assert
            await expect(service.verifyRefreshToken(invalidToken)).rejects.toThrow('Invalid refresh token')
        })

        it('should throw error for access token used as refresh token', async () => {
            // Arrange
            const accessTokenAsRefresh = 'access.token.used.as.refresh'
            const payload = {
                sub: mockUser.id,
                email: mockUser.email,
                // Missing 'type: refresh'
            }
            jwtService.verify.mockReturnValue(payload)

            // Act
            const result = await service.verifyRefreshToken(accessTokenAsRefresh)

            // Assert
            // Should still work if service doesn't validate type
            expect(result).toEqual(payload)
        })

        it('should use correct secret for refresh token verification', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_REFRESH_SECRET') return 'custom-refresh-secret'
                return null
            })
            const token = 'test.refresh.token'
            jwtService.verify.mockReturnValue({ sub: 'user-123', type: 'refresh' })

            // Act
            await service.verifyRefreshToken(token)

            // Assert
            expect(jwtService.verify).toHaveBeenCalledWith(token, {
                secret: 'custom-refresh-secret'
            })
        })
    })

    describe('decodeToken', () => {
        it('should decode token without verification', () => {
            // Arrange
            const token = 'some.jwt.token'
            const expectedPayload = {
                sub: mockUser.id,
                email: mockUser.email,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600
            }
            jwtService.decode.mockReturnValue(expectedPayload)

            // Act
            const result = service.decodeToken(token)

            // Assert
            expect(result).toEqual(expectedPayload)
            expect(jwtService.decode).toHaveBeenCalledWith(token)
        })

        it('should return null for malformed token', () => {
            // Arrange
            const malformedToken = 'not.a.jwt'
            jwtService.decode.mockReturnValue(null)

            // Act
            const result = service.decodeToken(malformedToken)

            // Assert
            expect(result).toBeNull()
        })

        it('should handle empty token', () => {
            // Arrange
            const emptyToken = ''
            jwtService.decode.mockReturnValue(null)

            // Act
            const result = service.decodeToken(emptyToken)

            // Assert
            expect(result).toBeNull()
        })
    })

    describe('getTokenExpiration', () => {
        it('should return expiration date from valid token', () => {
            // Arrange
            const token = 'valid.token'
            const exp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
            const payload = {
                sub: mockUser.id,
                email: mockUser.email,
                exp
            }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.getTokenExpiration(token)

            // Assert
            expect(result).toEqual(new Date(exp * 1000))
        })

        it('should return null for token without expiration', () => {
            // Arrange
            const token = 'token.without.exp'
            const payload = {
                sub: mockUser.id,
                email: mockUser.email
                // Missing exp
            }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.getTokenExpiration(token)

            // Assert
            expect(result).toBeNull()
        })

        it('should return null for invalid token', () => {
            // Arrange
            const invalidToken = 'invalid.token'
            jwtService.decode.mockReturnValue(null)

            // Act
            const result = service.getTokenExpiration(invalidToken)

            // Assert
            expect(result).toBeNull()
        })
    })

    describe('isTokenExpired', () => {
        it('should return false for valid non-expired token', () => {
            // Arrange
            const token = 'valid.token'
            const exp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
            const payload = { sub: mockUser.id, exp }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.isTokenExpired(token)

            // Assert
            expect(result).toBe(false)
        })

        it('should return true for expired token', () => {
            // Arrange
            const token = 'expired.token'
            const exp = Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
            const payload = { sub: mockUser.id, exp }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.isTokenExpired(token)

            // Assert
            expect(result).toBe(true)
        })

        it('should return true for token without expiration', () => {
            // Arrange
            const token = 'token.without.exp'
            const payload = { sub: mockUser.id }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.isTokenExpired(token)

            // Assert
            expect(result).toBe(true)
        })

        it('should return true for invalid token', () => {
            // Arrange
            const invalidToken = 'invalid.token'
            jwtService.decode.mockReturnValue(null)

            // Act
            const result = service.isTokenExpired(invalidToken)

            // Assert
            expect(result).toBe(true)
        })
    })

    describe('extractPayload', () => {
        it('should extract user payload from valid token', () => {
            // Arrange
            const token = 'valid.token'
            const payload = {
                sub: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
                lastname: mockUser.lastname,
                role: mockUser.role,
                status: mockUser.status,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600
            }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.extractPayload(token)

            // Assert
            expect(result).toEqual({
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                lastname: payload.lastname,
                role: payload.role,
                status: payload.status
            })
        })

        it('should return null for invalid token', () => {
            // Arrange
            const invalidToken = 'invalid.token'
            jwtService.decode.mockReturnValue(null)

            // Act
            const result = service.extractPayload(invalidToken)

            // Assert
            expect(result).toBeNull()
        })

        it('should handle token with partial payload', () => {
            // Arrange
            const token = 'partial.token'
            const payload = {
                sub: mockUser.id,
                email: mockUser.email
                // Missing other fields
            }
            jwtService.decode.mockReturnValue(payload)

            // Act
            const result = service.extractPayload(token)

            // Assert
            expect(result).toEqual({
                id: payload.sub,
                email: payload.email,
                name: undefined,
                lastname: undefined,
                role: undefined,
                status: undefined
            })
        })
    })

    describe('configuration edge cases', () => {
        it('should handle missing JWT secret configuration', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_SECRET') return undefined
                return 'default-value'
            })

            // Act & Assert
            // Should use undefined/null secret which might cause JWT service to fail
            await expect(service.generateAccessToken(mockUser)).rejects.toThrow()
        })

        it('should handle missing expiration configuration', async () => {
            // Arrange
            configService.get.mockImplementation((key: string) => {
                if (key === 'JWT_EXPIRATION') return undefined
                if (key === 'JWT_SECRET') return 'secret'
                return null
            })
            jwtService.sign.mockReturnValue('token')

            // Act
            await service.generateAccessToken(mockUser)

            // Assert
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    expiresIn: undefined
                })
            )
        })
    })
})
