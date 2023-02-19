import 'dotenv/config'
import nodemailer from 'nodemailer';
import Email from '../models/Email';

// Configurações de transporte
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_SENDER_USER,
        pass: process.env.EMAIL_SENDER_PASS
    }
});

// Configurações de email
// const mailOptions = {
//     from: process.env.EMAIL,
//     to: 'destinatario@example.com',
//     subject: 'Teste de email',
//     text: 'Este é um email de teste enviado usando o nodemailer.'
// };

// Envia o email
export const sendEmail = (mailOptions:Email) =>{
    transporter.sendMail(
        {
            from: process.env.EMAIL,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text
        }, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}
