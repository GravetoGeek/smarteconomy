// Update with your config settings.
require('dotenv').config()
module.exports = {

  development: {
    client: `${process.env.DB_CLIENT}`,
    connection: {
      host:`${process.env.DB_HOST}`,
      database: `${process.env.DB}`,
      user:     `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`
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
      tableName: 'knex_migrations'
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
      tableName: 'knex_migrations'
    }
  }

};
