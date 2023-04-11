import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import os from 'os'
import router from './routes'

const interfaces = os.networkInterfaces()
const interfaceInfo = Object.values(interfaces)
    .flat()
    .find((info) => {
        return info?.family === 'IPv4' && !info.internal
    })
const address: string | undefined =
    interfaceInfo?.address || process.env.NODE_HOST || 'localhost'
const port: number = Number(process.env.NODE_PORT) || 8000
process.env.DB_HOST = address
process.env.NODE_HOST = address
const app = express()

app.use(cors())
// { origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}` }
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('', router)

app.listen(port, () => {
    console.log(`Servidor online: http://${address}:${port}`)
})
