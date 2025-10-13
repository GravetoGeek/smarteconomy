import {Injectable} from '@nestjs/common'
import {PrismaService} from '../../../database/prisma/prisma.service'
import {PasswordResetToken} from '../../domain/entities/password-reset-token.entity'
import {PasswordResetTokenRepositoryPort} from '../../domain/ports/password-reset-token-repository.port'

@Injectable()
export class PasswordResetTokenRepository implements PasswordResetTokenRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async save(token: PasswordResetToken): Promise<void> {
        await this.prisma.passwordResetToken.create({
            data: {
                userId: token.userId,
                token: token.token,
                expiresAt: token.expiresAt,
                used: token.used,
            },
        })
    }

    async findByToken(token: string): Promise<PasswordResetToken|null> {
        const result=await this.prisma.passwordResetToken.findUnique({
            where: {token},
        })
        if(!result) return null
        return new PasswordResetToken(result.userId,result.token,result.expiresAt,result.used)
    }

    async markAsUsed(token: string): Promise<void> {
        await this.prisma.passwordResetToken.update({
            where: {token},
            data: {used: true},
        })
    }
}
