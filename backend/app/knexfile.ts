// Update with your config settings.
require('dotenv').config()
const {resolve} = require('path')
module.exports = {

  development: {
    client: `${process.env.DB_CLIENT}`,
    connection: {
      host:`${process.env.DB_HOST}`,
      database: `${process.env.DB}`,
      user:     `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname,'migrations')
    },
    seeds: {
      directory: resolve(__dirname,'seeds'),
    }
  },

  staging: {
    client: `${process.env.CLIENT_DB}`,
    connection: {
      database: `${process.env.DB}`,
      user:     `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname,'migrations')
    },
    seeds: {
      directory: resolve(__dirname,'seeds'),
    }
  },

  production: {
    client: `${process.env.CLIENT_DB}`,
    connection: {
      database: `${process.env.DB}`,
      user:     `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname,'migrations')
    },
    seeds: {
      directory: resolve(__dirname,'seeds'),
    }
  }

};
