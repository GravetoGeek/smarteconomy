import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactiontypes_categories', (table) => {
        // table.increments('id').primary()
        table.integer('transaction_type_id').unsigned().notNullable().references('id').inTable('transaction_types').onDelete('CASCADE').onUpdate('CASCADE')
        // table.foreign('transaction_type_id').references('id').inTable('transaction_types').onDelete('CASCADE').onUpdate('CASCADE')
        table.integer('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE').onUpdate('CASCADE')
        // table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        table.primary(['transaction_type_id', 'category_id']);
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.hasTable('transactiontypes_categories').then(async (exists) => {
        if (exists) {
            return knex.schema.dropTable('transactiontypes_categories')
        }
    })
}
