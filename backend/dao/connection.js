const knex = require('knex')
const config = require('../knexfile')
require('dotenv').config()

const connection = knex(config[process.env.ENV])

module.exports = {
  connection
}