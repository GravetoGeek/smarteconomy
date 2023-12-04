import 'dotenv/config'
const knexfile = require('../../knexfile')

const enviroment: string = process.env.ENV || 'development'
const connection = require('knex')(knexfile[enviroment])

export default connection
