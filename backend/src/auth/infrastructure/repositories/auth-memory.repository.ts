import { Injectable } from '@nestjs/common'
import { AuthToken } from '../../domain/entities/auth-token'
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port'

@Injectable()
export class AuthMemoryRepository implements AuthRepositoryPort {
    private tokens: Map<string, AuthToken> = new Map()
    private revokedTokens: Set<string> = new Set()

    async saveToken(token: AuthToken): Promise<AuthToken> {
        this.tokens.set(token.accessToken, token)
        return token
    }

    async findTokenByAccessToken(accessToken: string): Promise<AuthToken | null> {
        return this.tokens.get(accessToken) || null
    }

    async findTokenByRefreshToken(refreshToken: string): Promise<AuthToken | null> {
        for (const token of this.tokens.values()) {
            if (token.refreshToken === refreshToken) {
                return token
            }
        }
        return null
    }

    async revokeToken(accessToken: string): Promise<void> {
        this.revokedTokens.add(accessToken)
        this.tokens.delete(accessToken)
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        const tokensToRevoke: string[] = []
        
        for (const [accessToken, token] of this.tokens.entries()) {
            if (token.userId === userId) {
                tokensToRevoke.push(accessToken)
            }
        }

        for (const accessToken of tokensToRevoke) {
            await this.revokeToken(accessToken)
        }
    }

    async isTokenRevoked(accessToken: string): Promise<boolean> {
        return this.revokedTokens.has(accessToken)
    }

    async cleanupExpiredTokens(): Promise<void> {
        const now = new Date()
        const tokensToRemove: string[] = []

        for (const [accessToken, token] of this.tokens.entries()) {
            if (token.isExpired()) {
                tokensToRemove.push(accessToken)
            }
        }

        for (const accessToken of tokensToRemove) {
            this.tokens.delete(accessToken)
        }
    }
}
