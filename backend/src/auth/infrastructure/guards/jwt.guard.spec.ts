import {ExecutionContext} from '@nestjs/common'
import {GqlExecutionContext} from '@nestjs/graphql'
import {Test,TestingModule} from '@nestjs/testing'
import {JwtServicePort} from '../../domain/ports/jwt-service.port'
import {JWT_SERVICE} from '../../domain/tokens'
import {JwtGuard} from './jwt.guard'

describe('JwtGuard',() => {
    let guard: JwtGuard
    let jwtService: jest.Mocked<JwtServicePort>

    beforeEach(async () => {
        const jwtServiceMock: jest.Mocked<JwtServicePort>={
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn()
        }

        const module: TestingModule=await Test.createTestingModule({
            providers: [
                JwtGuard,
                {
                    provide: JWT_SERVICE,
                    useValue: jwtServiceMock
                }
            ]
        }).compile()

        guard=module.get<JwtGuard>(JwtGuard)
        jwtService=module.get<JwtServicePort>(JWT_SERVICE) as jest.Mocked<JwtServicePort>
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    const createMockGraphQLContext=(token?: string) => {
        const req={
            headers: {
                authorization: token? `Bearer ${token}`:undefined
            }
        }

        const mockContext={
            switchToHttp: jest.fn(),
            getHandler: jest.fn(),
            getClass: jest.fn()
        } as unknown as ExecutionContext

        jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
            getContext: () => ({req})
        } as any)

        return mockContext
    }

    describe('canActivate',() => {
        it('should return true for valid JWT token',async () => {
            // Arrange
            const validToken='valid.jwt.token'
            const context=createMockGraphQLContext(validToken)
            const mockPayload={
                sub: 'user-123',
                email: 'test@example.com',
                role: 'USER',
                iat: Math.floor(Date.now()/1000),
                exp: Math.floor(Date.now()/1000)+3600
            }
            jwtService.verify.mockResolvedValue(mockPayload)

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(true)
            expect(jwtService.verify).toHaveBeenCalledWith(validToken)
        })

        it('should return false when no authorization header is present',async () => {
            // Arrange
            const context=createMockGraphQLContext()

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).not.toHaveBeenCalled()
        })

        it('should return false when authorization header does not start with Bearer',async () => {
            // Arrange
            const req={
                headers: {
                    authorization: 'Basic dGVzdDp0ZXN0'
                }
            }

            const mockContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
                getContext: () => ({req})
            } as any)

            // Act
            const result=await guard.canActivate(mockContext)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).not.toHaveBeenCalled()
        })

        it('should return false for malformed Bearer token',async () => {
            // Arrange
            const req={
                headers: {
                    authorization: 'Bearer'
                }
            }

            const mockContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
                getContext: () => ({req})
            } as any)

            // Act
            const result=await guard.canActivate(mockContext)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).not.toHaveBeenCalled()
        })

        it('should return false for invalid JWT token',async () => {
            // Arrange
            const invalidToken='invalid.jwt.token'
            const context=createMockGraphQLContext(invalidToken)
            jwtService.verify.mockRejectedValue(new Error('Invalid token'))

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).toHaveBeenCalledWith(invalidToken)
        })

        it('should return false for expired JWT token',async () => {
            // Arrange
            const expiredToken='expired.jwt.token'
            const context=createMockGraphQLContext(expiredToken)
            jwtService.verify.mockRejectedValue(new Error('Token expired'))

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).toHaveBeenCalledWith(expiredToken)
        })

        it('should return false for JWT token with invalid signature',async () => {
            // Arrange
            const tamperedToken='tampered.jwt.token'
            const context=createMockGraphQLContext(tamperedToken)
            jwtService.verify.mockRejectedValue(new Error('Invalid signature'))

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).toHaveBeenCalledWith(tamperedToken)
        })

        it('should handle malformed JWT structure',async () => {
            // Arrange
            const malformedToken='not.a.valid.jwt.structure.here'
            const context=createMockGraphQLContext(malformedToken)
            jwtService.verify.mockRejectedValue(new Error('Malformed token'))

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).toHaveBeenCalledWith(malformedToken)
        })

        it('should add user to request context when token is valid',async () => {
            // Arrange
            const validToken='valid.jwt.token'
            const mockPayload={
                sub: 'user-456',
                email: 'user@example.com',
                role: 'USER',
                iat: Math.floor(Date.now()/1000),
                exp: Math.floor(Date.now()/1000)+3600
            }
            jwtService.verify.mockResolvedValue(mockPayload)

            const req={
                headers: {
                    authorization: `Bearer ${validToken}`
                }
            }

            const mockContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
                getContext: () => ({req})
            } as any)

            // Act
            const result=await guard.canActivate(mockContext)

            // Assert
            expect(result).toBe(true)
            expect(req).toHaveProperty('user',mockPayload)
            expect(jwtService.verify).toHaveBeenCalledWith(validToken)
        })

        it('should handle empty token after Bearer',async () => {
            // Arrange
            const req={
                headers: {
                    authorization: 'Bearer '
                }
            }

            const mockContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
                getContext: () => ({req})
            } as any)

            jwtService.verify.mockRejectedValue(new Error('Empty token'))

            // Act
            const result=await guard.canActivate(mockContext)

            // Assert
            expect(result).toBe(false)
            expect(jwtService.verify).toHaveBeenCalledWith('')
        })

        it('should handle case insensitive Bearer prefix',async () => {
            // Arrange
            const validToken='valid.jwt.token'
            const req={
                headers: {
                    authorization: `bearer ${validToken}`
                }
            }

            const mockContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockReturnValue({
                getContext: () => ({req})
            } as any)

            const mockPayload={
                sub: 'user-789',
                email: 'test@example.com',
                role: 'USER'
            }
            jwtService.verify.mockResolvedValue(mockPayload)

            // Act
            const result=await guard.canActivate(mockContext)

            // Assert
            expect(result).toBe(true)
            expect(jwtService.verify).toHaveBeenCalledWith(validToken)
        })
    })

    describe('extractTokenFromHeader',() => {
        it('should extract token from properly formatted Bearer header',() => {
            // Arrange
            const token='sample.jwt.token'
            const authHeader=`Bearer ${token}`

            // Act
            const extractedToken=(guard as any).extractTokenFromHeader(authHeader)

            // Assert
            expect(extractedToken).toBe(token)
        })

        it('should return undefined for header without Bearer prefix',() => {
            // Arrange
            const authHeader='Basic dGVzdDp0ZXN0'

            // Act
            const extractedToken=(guard as any).extractTokenFromHeader(authHeader)

            // Assert
            expect(extractedToken).toBeUndefined()
        })

        it('should return undefined for empty header',() => {
            // Arrange
            const authHeader=''

            // Act
            const extractedToken=(guard as any).extractTokenFromHeader(authHeader)

            // Assert
            expect(extractedToken).toBeUndefined()
        })

        it('should return undefined for null header',() => {
            // Arrange
            const authHeader=null

            // Act
            const extractedToken=(guard as any).extractTokenFromHeader(authHeader)

            // Assert
            expect(extractedToken).toBeUndefined()
        })

        it('should handle extra spaces in Bearer header',() => {
            // Arrange
            const token='sample.jwt.token'
            const authHeader=`Bearer   ${token}`

            // Act
            const extractedToken=(guard as any).extractTokenFromHeader(authHeader)

            // Assert
            expect(extractedToken).toBe(token)
        })
    })

    describe('error scenarios',() => {
        it('should handle JwtService throwing unexpected errors',async () => {
            // Arrange
            const validToken='valid.jwt.token'
            const context=createMockGraphQLContext(validToken)
            jwtService.verify.mockImplementation(() => {
                throw new Error('Unexpected JWT service error')
            })

            // Act
            const result=await guard.canActivate(context)

            // Assert
            expect(result).toBe(false)
        })

        it('should handle null context gracefully',async () => {
            // Arrange
            const nullContext=null as any

            // Act & Assert
            await expect(guard.canActivate(nullContext)).rejects.toThrow()
        })

        it('should handle context without GraphQL structure',async () => {
            // Arrange
            const invalidContext={
                switchToHttp: jest.fn(),
                getHandler: jest.fn(),
                getClass: jest.fn()
            } as unknown as ExecutionContext

            jest.spyOn(GqlExecutionContext,'create').mockImplementation(() => {
                throw new Error('Not a GraphQL context')
            })

            // Act & Assert
            await expect(guard.canActivate(invalidContext)).rejects.toThrow()
        })
    })
})
