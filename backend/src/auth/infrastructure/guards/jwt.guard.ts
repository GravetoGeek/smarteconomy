import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context)
        const authHeader = request?.headers?.authorization

        if (!authHeader) {
            return false
        }

        const token = this.extractTokenFromHeader(authHeader)
        if (!token) {
            return false
        }

        try {
            const payload = await this.jwtService.verifyAsync(token)
            request.user = payload
            return true
        } catch (error) {
            return false
        }
    }

    private extractTokenFromHeader(authHeader: string | null): string | undefined {
        if (!authHeader) return undefined

        const parts = authHeader.split(' ')
        const [type, token] = parts

        if (type !== 'Bearer' || !token || token.trim() === '') {
            return undefined
        }

        return token
    }
}
