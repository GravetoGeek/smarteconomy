import {PasswordResetToken} from '../entities/password-reset-token.entity'

export interface PasswordResetTokenRepositoryPort {
    save(token: PasswordResetToken): Promise<void>
    findByToken(token: string): Promise<PasswordResetToken|null>
    markAsUsed(token: string): Promise<void>
}
