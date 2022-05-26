const env = process.env.ENV || 'development'
const knexfile = require('../knexfile')
const knex = require('knex')(knexfile[env])

module.exports = knex