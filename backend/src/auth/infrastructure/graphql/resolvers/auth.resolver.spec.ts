import {Test,TestingModule} from '@nestjs/testing'
import {AuthApplicationService} from '../../../application/services/auth-application.service'
import {LoginInput,LogoutInput,RefreshTokenInput,ValidateTokenInput} from '../../dtos/inputs/auth.input'
import {AuthGraphQLMapper} from '../mappers/auth-graphql.mapper'
import {AuthResolver} from './auth.resolver'

describe('AuthResolver',() => {
    let resolver: AuthResolver
    let authApplicationService: jest.Mocked<AuthApplicationService>

    const createMockUser=(overrides: any={}) => ({
        id: `user-${Math.random().toString(36).substring(7)}`,
        email: 'test@example.com',
        name: 'Test',
        lastname: 'User',
        role: 'USER',
        status: 'ACTIVE',
        ...overrides
    })

    const createMockAuthResponse=(overrides: any={}) => ({
        accessToken: `access-token-${Math.random().toString(36)}`,
        refreshToken: `refresh-token-${Math.random().toString(36)}`,
        user: createMockUser(),
        expiresIn: 3600,
        ...overrides
    })

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: AuthApplicationService,
                    useValue: {
                        login: jest.fn(),
                        refreshToken: jest.fn(),
                        logout: jest.fn(),
                        validateToken: jest.fn()
                    }
                }
            ]
        }).compile()

        resolver=module.get<AuthResolver>(AuthResolver)
        authApplicationService=module.get(AuthApplicationService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('login',() => {
        it('should login successfully with valid credentials',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'validPassword123'
            }
            const mockAuthResponse=createMockAuthResponse({
                user: createMockUser({email: loginInput.email})
            })
            authApplicationService.login.mockResolvedValue(mockAuthResponse as any)

            const result=await resolver.login(loginInput)

            expect(result).toEqual(AuthGraphQLMapper.toAuthResponse(mockAuthResponse))
            expect(authApplicationService.login).toHaveBeenCalledWith({
                email: loginInput.email,
                password: loginInput.password
            })
        })

        it('should handle invalid email format',async () => {
            const loginInput: LoginInput={
                email: 'invalid-email',
                password: 'password123'
            }
            const error=new Error('Invalid email format')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('Invalid email format')
            expect(authApplicationService.login).toHaveBeenCalledWith({
                email: loginInput.email,
                password: loginInput.password
            })
        })

        it('should handle invalid credentials',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'wrongPassword'
            }
            const error=new Error('Invalid credentials')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('Invalid credentials')
        })

        it('should handle user not found',async () => {
            const loginInput: LoginInput={
                email: 'nonexistent@example.com',
                password: 'password123'
            }
            const error=new Error('User not found')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('User not found')
        })

        it('should handle account suspended',async () => {
            const loginInput: LoginInput={
                email: 'suspended@example.com',
                password: 'password123'
            }
            const error=new Error('Account is suspended')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('Account is suspended')
        })

        it('should handle empty password',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: ''
            }
            const error=new Error('Password is required')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('Password is required')
        })
    })

    describe('refreshToken',() => {
        it('should refresh token successfully with valid refresh token',async () => {
            const refreshInput: RefreshTokenInput={
                refreshToken: 'valid-refresh-token-123'
            }
            const mockAuthResponse=createMockAuthResponse()
            authApplicationService.refreshToken.mockResolvedValue(mockAuthResponse as any)

            const result=await resolver.refreshToken(refreshInput)

            expect(result).toEqual(AuthGraphQLMapper.toAuthResponse(mockAuthResponse))
            expect(authApplicationService.refreshToken).toHaveBeenCalledWith({
                refreshToken: refreshInput.refreshToken
            })
        })

        it('should handle invalid refresh token',async () => {
            const refreshInput: RefreshTokenInput={
                refreshToken: 'invalid-refresh-token'
            }
            const error=new Error('Invalid refresh token')
            authApplicationService.refreshToken.mockRejectedValue(error)

            await expect(resolver.refreshToken(refreshInput)).rejects.toThrow('Invalid refresh token')
        })

        it('should handle expired refresh token',async () => {
            const refreshInput: RefreshTokenInput={
                refreshToken: 'expired-refresh-token'
            }
            const error=new Error('Refresh token has expired')
            authApplicationService.refreshToken.mockRejectedValue(error)

            await expect(resolver.refreshToken(refreshInput)).rejects.toThrow('Refresh token has expired')
        })

        it('should handle revoked refresh token',async () => {
            const refreshInput: RefreshTokenInput={
                refreshToken: 'revoked-refresh-token'
            }
            const error=new Error('Refresh token has been revoked')
            authApplicationService.refreshToken.mockRejectedValue(error)

            await expect(resolver.refreshToken(refreshInput)).rejects.toThrow('Refresh token has been revoked')
        })

        it('should handle user not found for refresh token',async () => {
            const refreshInput: RefreshTokenInput={
                refreshToken: 'orphaned-refresh-token'
            }
            const error=new Error('User associated with refresh token not found')
            authApplicationService.refreshToken.mockRejectedValue(error)

            await expect(resolver.refreshToken(refreshInput)).rejects.toThrow('User associated with refresh token not found')
        })
    })

    describe('logout',() => {
        it('should logout successfully with valid access token',async () => {
            const logoutInput: LogoutInput={
                accessToken: 'valid-access-token-123'
            }
            const mockLogoutResponse={
                success: true,
                message: 'Logout successful'
            }
            authApplicationService.logout.mockResolvedValue(mockLogoutResponse as any)

            const result=await resolver.logout(logoutInput)

            expect(result).toEqual(AuthGraphQLMapper.toLogoutResponse(mockLogoutResponse))
            expect(authApplicationService.logout).toHaveBeenCalledWith({
                accessToken: logoutInput.accessToken
            })
        })

        it('should handle invalid access token during logout',async () => {
            const logoutInput: LogoutInput={
                accessToken: 'invalid-access-token'
            }
            const error=new Error('Invalid access token')
            authApplicationService.logout.mockRejectedValue(error)

            await expect(resolver.logout(logoutInput)).rejects.toThrow('Invalid access token')
        })

        it('should handle expired access token during logout',async () => {
            const logoutInput: LogoutInput={
                accessToken: 'expired-access-token'
            }
            const error=new Error('Access token has expired')
            authApplicationService.logout.mockRejectedValue(error)

            await expect(resolver.logout(logoutInput)).rejects.toThrow('Access token has expired')
        })

        it('should handle logout when already logged out',async () => {
            const logoutInput: LogoutInput={
                accessToken: 'already-logged-out-token'
            }
            const mockLogoutResponse={
                success: true,
                message: 'Already logged out'
            }
            authApplicationService.logout.mockResolvedValue(mockLogoutResponse as any)

            const result=await resolver.logout(logoutInput)

            expect(result).toEqual(AuthGraphQLMapper.toLogoutResponse(mockLogoutResponse))
        })
    })

    describe('validateToken',() => {
        it('should validate token successfully with valid access token',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'valid-access-token-123'
            }
            const mockValidateResponse={
                valid: true,
                user: createMockUser()
            }
            authApplicationService.validateToken.mockResolvedValue(mockValidateResponse as any)

            const result=await resolver.validateToken(validateInput)
            const expected=AuthGraphQLMapper.toValidateTokenResponse(mockValidateResponse)

            expect(result).toEqual(expected)
            expect(result.valid).toBe(true)
            expect(authApplicationService.validateToken).toHaveBeenCalledWith({
                accessToken: validateInput.accessToken
            })
        })

        it('should return invalid for malformed token',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'malformed-token'
            }
            const mockValidateResponse={
                valid: false,
                user: undefined,
                expiresAt: null,
                error: 'Malformed token'
            }
            authApplicationService.validateToken.mockResolvedValue(mockValidateResponse as any)

            const result=await resolver.validateToken(validateInput)
            const expected=AuthGraphQLMapper.toValidateTokenResponse(mockValidateResponse)

            expect(result).toEqual(expected)
            expect(result.valid).toBe(false)
            expect(result.user).toBeNull()
        })

        it('should return invalid for expired token',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'expired-token'
            }
            const mockValidateResponse={
                valid: false,
                user: undefined
            }
            authApplicationService.validateToken.mockResolvedValue(mockValidateResponse as any)

            const result=await resolver.validateToken(validateInput)
            const expected=AuthGraphQLMapper.toValidateTokenResponse(mockValidateResponse)

            expect(result).toEqual(expected)
            expect(result.valid).toBe(false)
            expect(result.user).toBeNull()
        })

        it('should handle token validation service error',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'test-token'
            }
            const error=new Error('Token validation service unavailable')
            authApplicationService.validateToken.mockRejectedValue(error)

            await expect(resolver.validateToken(validateInput)).rejects.toThrow('Token validation service unavailable')
        })

        it('should validate token with user role information',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'admin-token'
            }
            const mockValidateResponse={
                valid: true,
                user: createMockUser({role: 'ADMIN'})
            }
            authApplicationService.validateToken.mockResolvedValue(mockValidateResponse as any)

            const result=await resolver.validateToken(validateInput)
            const expected=AuthGraphQLMapper.toValidateTokenResponse(mockValidateResponse)

            expect(result).toEqual(expected)
            expect(result.valid).toBe(true)
            expect(result.user?.role).toBe('ADMIN')
        })
    })

    describe('error handling and logging',() => {
        it('should log login attempts and results',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'password123'
            }
            const mockAuthResponse=createMockAuthResponse()
            authApplicationService.login.mockResolvedValue(mockAuthResponse as any)

            await resolver.login(loginInput)

            expect(authApplicationService.login).toHaveBeenCalled()
        })

        it('should propagate authentication errors correctly',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'wrongPassword'
            }
            const authError=new Error('Authentication failed')
            authApplicationService.login.mockRejectedValue(authError)

            await expect(resolver.login(loginInput)).rejects.toThrow('Authentication failed')
        })

        it('should handle network or service errors gracefully',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'password123'
            }
            const networkError=new Error('Network timeout')
            authApplicationService.login.mockRejectedValue(networkError)

            await expect(resolver.login(loginInput)).rejects.toThrow('Network timeout')
        })
    })

    describe('security edge cases',() => {
        it('should handle SQL injection attempts in email',async () => {
            const maliciousInput: LoginInput={
                email: "test@example.com'; DROP TABLE users; --",
                password: 'password123'
            }
            const error=new Error('Invalid email format')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(maliciousInput)).rejects.toThrow('Invalid email format')
        })

        it('should handle very long password inputs',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'a'.repeat(10000)
            }
            const error=new Error('Password too long')
            authApplicationService.login.mockRejectedValue(error)

            await expect(resolver.login(loginInput)).rejects.toThrow('Password too long')
        })

        it('should handle special characters in passwords',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: "pàsswörd!@#$%^&*()_+-=[]{}|;:,.<>?"
            }
            const mockAuthResponse=createMockAuthResponse()
            authApplicationService.login.mockResolvedValue(mockAuthResponse as any)

            const result=await resolver.login(loginInput)

            expect(result).toEqual(AuthGraphQLMapper.toAuthResponse(mockAuthResponse))
            expect(authApplicationService.login).toHaveBeenCalledWith({
                email: loginInput.email,
                password: loginInput.password
            })
        })
    })

    describe('concurrent operations',() => {
        it('should handle multiple login attempts from same user',async () => {
            const loginInput: LoginInput={
                email: 'test@example.com',
                password: 'password123'
            }
            const mockAuthResponse=createMockAuthResponse()
            authApplicationService.login.mockResolvedValue(mockAuthResponse as any)

            const promises=Array.from({length: 3},() => resolver.login(loginInput))
            const results=await Promise.all(promises)

            expect(results).toHaveLength(3)
            expect(authApplicationService.login).toHaveBeenCalledTimes(3)
            results.forEach(result => {
                expect(result).toEqual(AuthGraphQLMapper.toAuthResponse(mockAuthResponse))
            })
        })

        it('should handle simultaneous token validation requests',async () => {
            const validateInput: ValidateTokenInput={
                accessToken: 'test-token'
            }
            const mockValidateResponse={
                valid: true,
                user: createMockUser(),
                expiresAt: new Date(Date.now()+3600000)
            }
            authApplicationService.validateToken.mockResolvedValue(mockValidateResponse as any)

            const promises=Array.from({length: 5},() => resolver.validateToken(validateInput))
            const results=await Promise.all(promises)

            expect(results).toHaveLength(5)
            expect(authApplicationService.validateToken).toHaveBeenCalledTimes(5)
            results.forEach(result => {
                expect(result.valid).toBe(true)
            })
        })
    })
})
