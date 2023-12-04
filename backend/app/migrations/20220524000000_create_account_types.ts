import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('account_types', (table) => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('description').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.hasTable('account_types').then(async (exists) => {
        if (exists) {
            return knex.schema.dropTable('account_types')
        }
    })
}
