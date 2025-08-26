import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

interface User {
    id: string
    email: string
    name: string
    lastname: string
    role: string
    status: string
}

@Injectable()
export class JwtTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async generateAccessToken(user: User): Promise<string> {
        const secret = this.configService.get<string>('JWT_SECRET')
        if (!secret) {
            throw new Error('JWT_SECRET is not configured')
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,
            status: user.status
        }

        return this.jwtService.sign(payload, {
            secret,
            expiresIn: this.configService.get<string>('JWT_EXPIRATION')
        })
    }

    async generateRefreshToken(user: User): Promise<string> {
        const payload = {
            sub: user.id,
            email: user.email,
            type: 'refresh'
        }

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION')
        })
    }

    async verifyAccessToken(token: string): Promise<any> {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_SECRET')
        })
    }

    async verifyRefreshToken(token: string): Promise<any> {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET')
        })
    }

    decodeToken(token: string): any {
        return this.jwtService.decode(token)
    }

    getTokenExpiration(token: string): Date | null {
        const decoded = this.decodeToken(token)
        if (decoded && decoded.exp) {
            return new Date(decoded.exp * 1000)
        }
        return null
    }

    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token)
        if (!decoded || !decoded.exp) {
            return true
        }
        return Date.now() >= decoded.exp * 1000
    }

    extractPayload(token: string): any {
        const decoded = this.decodeToken(token)
        if (!decoded) {
            return null
        }
        return {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            lastname: decoded.lastname,
            role: decoded.role,
            status: decoded.status
        }
    }
}
