import {Inject,Injectable} from '@nestjs/common'
import {UserRepositoryPort} from '../../../users/domain/ports/user-repository.port'
import {PasswordResetTokenRepositoryPort} from '../../domain/ports/password-reset-token-repository.port'
import {HASH_SERVICE,PASSWORD_RESET_TOKEN_REPOSITORY,USER_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
        private readonly passwordResetTokenRepository: PasswordResetTokenRepositoryPort,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE) private readonly hashService: any
    ) {}

    async execute(token: string,newPassword: string): Promise<boolean> {
        const resetToken=await this.passwordResetTokenRepository.findByToken(token)
        if(!resetToken||resetToken.used||resetToken.expiresAt<new Date()) {
            throw new Error('Token inválido ou expirado')
        }
        const user=await this.userRepository.findById(resetToken.userId)
        if(!user) throw new Error('Usuário não encontrado')
        const hashed=await this.hashService.hash(newPassword)
        await this.userRepository.updatePassword(user.id,hashed)
        await this.passwordResetTokenRepository.markAsUsed(token)
        return true
    }
}
