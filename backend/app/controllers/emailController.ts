import 'dotenv/config'
import { Request, Response } from 'express'
import Email from '../models/Email'
import { sendEmail } from '../utils/sendEmail'
import { smtpStatus } from '../utils/smtpStatus'

// Configurações de email
// const mailOptions = {
//     from: process.env.EMAIL,
//     to: 'destinatario@example.com',
//     subject: 'Teste de email',
//     text: 'Este é um email de teste enviado usando o nodemailer.'
// };

// Envia o email
export const sendMail = async (req: Request, res: Response) => {
    try {
        let email: Email = req.body
        // Configurações de transporte
        let smtpResponse = await sendEmail(email)
        let response = smtpResponse.response.split(' ')

        switch (response[0]) {
            case '250':
                return res.status(200).json({message: smtpStatus[response[0] as keyof typeof smtpStatus]})
            case '550':
                return res.status(400).json({message: smtpStatus[response[0] as keyof typeof smtpStatus]})
            default:
                return res.status(500).json({message: smtpStatus[response[0] as keyof typeof smtpStatus]})
        }
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
