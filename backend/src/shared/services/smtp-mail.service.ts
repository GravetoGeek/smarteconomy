import {Injectable,Logger} from '@nestjs/common'
import * as nodemailer from 'nodemailer'

export interface SmtpMailOptions {
    to: string
    subject: string
    text?: string
    html?: string
}

@Injectable()
export class SmtpMailService {
    private readonly transporter: nodemailer.Transporter
    private readonly logger=new Logger(SmtpMailService.name)

    constructor() {
        const smtpUser=process.env.SMTP_USER
        const smtpPass=process.env.SMTP_PASS

        if(!smtpUser||!smtpPass) {
            this.logger.warn('SMTP credentials not configured. Email sending will fail.')
        }

        this.transporter=nodemailer.createTransport({
            host: process.env.SMTP_HOST||'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT)||587,
            secure: false,
            auth: smtpUser&&smtpPass? {
                user: smtpUser,
                pass: smtpPass,
            }:undefined,
        })
    }

    async sendMail(options: SmtpMailOptions): Promise<void> {
        const isDevelopment=process.env.NODE_ENV==='development'
        const useEmailLogging=process.env.USE_EMAIL_LOGGING==='true'

        // Em desenvolvimento ou quando configurado, apenas loga o email ao invés de enviar
        if(isDevelopment||useEmailLogging) {
            this.logger.log('=== EMAIL ENVIADO (MODO DESENVOLVIMENTO) ===')
            this.logger.log(`Para: ${options.to}`)
            this.logger.log(`Assunto: ${options.subject}`)
            this.logger.log(`Texto: ${options.text}`)
            this.logger.log(`HTML: ${options.html}`)
            this.logger.log('============================================')
            return
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM||process.env.SMTP_USER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            this.logger.log(`Email sent successfully to ${options.to}`)
        } catch(error) {
            this.logger.error(`Failed to send email to ${options.to}`)

            // Se falhar no envio, loga o email como fallback
            this.logger.warn('=== EMAIL (FALLBACK - FALHA NO ENVIO) ===')
            this.logger.warn(`Para: ${options.to}`)
            this.logger.warn(`Assunto: ${options.subject}`)
            this.logger.warn(`Texto: ${options.text}`)
            this.logger.warn('==========================================')

            // Em desenvolvimento, não propaga o erro para não quebrar o fluxo
            if(isDevelopment) {
                this.logger.warn('Erro ignorado em modo desenvolvimento')
                return
            }

            throw error
        }
    }
}
