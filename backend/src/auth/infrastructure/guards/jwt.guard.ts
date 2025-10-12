import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, Inject } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JWT_SERVICE } from '../../domain/tokens'
import { JwtServicePort } from '../../domain/ports/jwt-service.port'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        @Inject(JWT_SERVICE) private readonly jwtService: JwtServicePort
    ) { }

    getRequest(context: ExecutionContext) {
        try {
            const ctx = GqlExecutionContext.create(context)
            return ctx.getContext().req
        } catch (error) {
            // Re-throw GraphQL context creation errors
            if (error instanceof Error && error.message.includes('GraphQL')) {
                throw error
            }
            // Handle other errors gracefully
            return null
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Handle null context by throwing error (as expected by tests)
        if (!context) {
            throw new Error('Execution context is null')
        }

        const request = this.getRequest(context)

        // Handle invalid GraphQL context gracefully
        if (!request || !request.headers) {
            return false
        }

        const authHeader = request.headers.authorization

        if (!authHeader) {
            return false
        }

        const token = this.extractTokenFromHeader(authHeader)
        if (token === undefined) {
            return false
        }

        try {
            // Use async verify method from custom JwtServicePort
            const payload = await this.jwtService.verify(token)
            request.user = payload
            return true
        } catch (error) {
            console.log('[JwtGuard] Token verification failed:', error.message)
            return false
        }
    }

    private extractTokenFromHeader(authHeader: string | null): string | undefined {
        if (!authHeader) return undefined

        // Check if it starts with Bearer (case insensitive), but don't trim yet
        const bearerPattern = /^bearer\s+(.*)$/i
        const match = authHeader.match(bearerPattern)

        if (!match) {
            return undefined
        }

        // Return the token part (everything after "Bearer "), even if empty
        // This handles cases like "Bearer " which should return ""
        return match[1].trim()
    }
}
