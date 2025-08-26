import { AuthToken } from '../entities/auth-token'

export interface AuthRepositoryPort {
    saveToken(token: AuthToken): Promise<AuthToken>
    findTokenByAccessToken(accessToken: string): Promise<AuthToken | null>
    findTokenByRefreshToken(refreshToken: string): Promise<AuthToken | null>
    revokeToken(accessToken: string): Promise<void>
    revokeAllUserTokens(userId: string): Promise<void>
    isTokenRevoked(accessToken: string): Promise<boolean>
    cleanupExpiredTokens(): Promise<void>
}
