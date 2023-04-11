import nodemailer from 'nodemailer'
import Email from '../models/Email'

export const sendEmail = (email:Email) =>{
    try{
        // Configurações de transporte
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_SENDER_USER,
                pass: process.env.EMAIL_SENDER_PASS
            }
        })
        return transporter.sendMail(
            {
                from: process.env.EMAIL,
                to: email.to,
                subject: email.subject,
                text: email.text
            }
        )
    }
    catch(error:any){
        if(error?.statusCode) return {statusCode: error.statusCode || 500, message: error.message || 'Erro no servidor'}
        return error
    }
}