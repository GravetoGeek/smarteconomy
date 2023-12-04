import csv from 'csv-parser'
import * as fs from 'fs'
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('professions', (table) => {
        table.increments('id').primary()
        table.string('cbo').notNullable()
        table.string('title').notNullable()
        table.string('type').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.hasTable('professions').then(async (exists) => {
        if (exists) {
            return knex.schema.dropTable('professions')
        }
    })
}
