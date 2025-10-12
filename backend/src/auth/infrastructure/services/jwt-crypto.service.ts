import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { JwtServicePort, JwtPayload } from '../../domain/ports/jwt-service.port'

@Injectable()
export class JwtCryptoService implements JwtServicePort {
    private readonly secret = process.env.JWT_SECRET || 'dev-secret-key'

    async sign(payload: JwtPayload): Promise<string> {
        // Implementação temporária usando crypto nativo
        // TODO: Substituir por @nestjs/jwt quando disponível
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        }

        const now = Math.floor(Date.now() / 1000)
        const exp = now + (24 * 60 * 60) // 24 horas

        const payloadWithTimestamps = {
            ...payload,
            iat: now,
            exp
        }

        const encodedHeader = this.base64UrlEncode(JSON.stringify(header))
        const encodedPayload = this.base64UrlEncode(JSON.stringify(payloadWithTimestamps))
        
        const signature = this.createSignature(`${encodedHeader}.${encodedPayload}`)
        const encodedSignature = this.base64UrlEncode(signature)

        return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
    }

    async verify(token: string): Promise<JwtPayload> {
        try {
            const parts = token.split('.')
            if (parts.length !== 3) {
                throw new Error('Invalid token format')
            }

            const [encodedHeader, encodedPayload, encodedSignature] = parts
            
            const signature = this.createSignature(`${encodedHeader}.${encodedPayload}`)
            const expectedSignature = this.base64UrlEncode(signature)

            if (encodedSignature !== expectedSignature) {
                throw new Error('Invalid signature')
            }

            const payload = JSON.parse(this.base64UrlDecode(encodedPayload))
            
            // Verificar expiração
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < now) {
                throw new Error('Token expired')
            }

            return payload
        } catch (error) {
            throw new Error('Invalid token')
        }
    }

    decode(token: string): JwtPayload | null {
        try {
            const parts = token.split('.')
            if (parts.length !== 3) {
                return null
            }

            const payload = JSON.parse(this.base64UrlDecode(parts[1]))
            return payload
        } catch (error) {
            return null
        }
    }

    private createSignature(data: string): string {
        // Usando crypto.createHmac do Node.js (nativo)
        const hmac = crypto.createHmac('sha256', this.secret)
        hmac.update(data)
        return hmac.digest('base64')
    }

    private base64UrlEncode(str: string): string {
        return Buffer.from(str)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
    }

    private base64UrlDecode(str: string): string {
        str = str.replace(/-/g, '+').replace(/_/g, '/')
        while (str.length % 4) {
            str += '='
        }
        return Buffer.from(str, 'base64').toString()
    }
}
