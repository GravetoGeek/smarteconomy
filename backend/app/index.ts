import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import os from 'os'
import router from './routes'

// Carrega as interfaces de rede
const interfaces = os.networkInterfaces()
const interfaceInfo = Object.values(interfaces)
    .flat()
    .find((info) => {
        return info?.family === 'IPv4' && !info.internal
    })

// Define o endereço e a porta do servidor
const address: string | undefined = interfaceInfo?.address || process.env.NODE_HOST || 'localhost'
const port: number = Number(process.env.NODE_PORT) || 8000
// Define as variáveis de ambiente
process.env.DB_HOST = address
process.env.NODE_HOST = address


//Carrega as variáveis de ambiente do frontend
const envConfigFrontend = fs.readFileSync('../frontend/.env').toString().split(/\n/g).reduce((acc, line) => {
    if (line.trim() !== '') {
        const [key, value] = line.split('=')
        acc[key] = value
    }
    return acc
}, {} as { [key: string]: string })

//Atualiza as variáveis de ambiente do frontend
envConfigFrontend.BACKEND_HOST = address
envConfigFrontend.FRONTEND_HOST = address

//Salva as variáveis de ambiente do frontend
const newEnvContent = Object.entries(envConfigFrontend).map(([key, value]) => `${key}=${value}`)
    .join('\n');
fs.writeFileSync('../frontend/.env', newEnvContent, { encoding: 'utf8' });


// Prosseguindo com o servidor
const app = express()

app.use(cors())
// { origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}` }
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('', router)

app.listen(port, () => {
    console.log(`Servidor online: http://${address}:${port}`)
})
