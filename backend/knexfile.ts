// Update with your config settings.
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

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
      extension: 'ts',
      directory: resolve(__dirname,'app/migrations')
    },
    seeds: {
      extension: 'ts',
      directory: resolve(__dirname,'app/seeds'),
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
      directory: resolve(__dirname,'app/migrations')
    },
    seeds: {
      directory: resolve(__dirname,'app/seeds'),
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
      directory: resolve(__dirname,'app/migrations')
    },
    seeds: {
      directory: resolve(__dirname,'app/seeds'),
    }
  }

}
