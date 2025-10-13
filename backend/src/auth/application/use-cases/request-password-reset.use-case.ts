import {Inject,Injectable} from '@nestjs/common'
import {randomBytes} from 'crypto'
import {SmtpMailService} from '../../../shared/services/smtp-mail.service'
import {UserRepositoryPort} from '../../../users/domain/ports/user-repository.port'
import {PasswordResetToken} from '../../domain/entities/password-reset-token.entity'
import {PasswordResetTokenRepositoryPort} from '../../domain/ports/password-reset-token-repository.port'
import {PASSWORD_RESET_TOKEN_REPOSITORY,USER_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class RequestPasswordResetUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly mailService: SmtpMailService,
        @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
        private readonly passwordResetTokenRepository: PasswordResetTokenRepositoryPort
    ) {}

    async execute(email: string): Promise<void> {
        const user=await this.userRepository.findByEmail(email)
        if(!user) throw new Error('Usuário não encontrado')

        // Gerar token seguro
        const token=randomBytes(32).toString('hex')
        // Salvar token no banco
        const expiresAt=new Date(Date.now()+1000*60*30) // 30 minutos
        const resetToken=new PasswordResetToken(user.id,token,expiresAt,false)
        await this.passwordResetTokenRepository.save(resetToken)

        // Montar link de recuperação
        const resetLink=`${process.env.FRONTEND_URL||'http://localhost:3000'}/reset-password?token=${token}`
        const isDevelopment=process.env.NODE_ENV==='development'

        // Enviar e-mail
        await this.mailService.sendMail({
            to: email,
            subject: 'Recuperação de senha - SmartEconomy',
            text: `Olá!\n\n${isDevelopment? 'Para redefinir sua senha, copie o token abaixo e cole no aplicativo:':`Clique no link abaixo para redefinir sua senha:\n${resetLink}\n\nOu copie o token:`}\n\n${token}\n\nEste token expira em 30 minutos.\n\nSe não foi você, ignore este e-mail.`,
            html: isDevelopment? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Recuperação de Senha</h2>
                    <p>Olá,</p>
                    <p>Recebemos uma solicitação para redefinir sua senha do SmartEconomy.</p>
                    <p><strong>Copie o token abaixo e cole no aplicativo:</strong></p>
                    <p style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; font-family: monospace; font-size: 14px; word-break: break-all;">
                        ${token}
                    </p>
                    <p style="color: #666; font-size: 12px;">Este token expira em 30 minutos.</p>
                    <p style="color: #666; font-size: 12px;">Se você não solicitou esta alteração, ignore este e-mail.</p>
                </div>
            ` :`
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Recuperação de Senha</h2>
                    <p>Olá,</p>
                    <p>Recebemos uma solicitação para redefinir sua senha do SmartEconomy.</p>
                    <p>
                        <a href="${resetLink}"
                           style="display: inline-block; padding: 12px 24px; background-color: #007bff;
                                  color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                            Redefinir Senha
                        </a>
                    </p>
                    <p>Ou copie e cole o token abaixo no aplicativo:</p>
                    <p style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; font-family: monospace;">
                        ${token}
                    </p>
                    <p style="color: #666; font-size: 12px;">Este link expira em 30 minutos.</p>
                    <p style="color: #666; font-size: 12px;">Se você não solicitou esta alteração, ignore este e-mail.</p>
                </div>
            `
        })
    }
}
