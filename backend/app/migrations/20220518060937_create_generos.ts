exports.up = async function (knex: any) {
    await knex.schema.hasTable('genders').then(async (exists: any) => {
        if (!exists) {
            await knex.schema.createTable('genders', (table: any) => {
                table.increments('id').primary()
                table.string('gender', 255).notNullable().unique()
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
            })
        }
    })
}

exports.down = async function (knex: any) {
    await knex.schema.hasTable('genders').then(async (exists: any) => {
        if (exists) {
            await knex.schema.dropTable('genders')
        }
    })
}
