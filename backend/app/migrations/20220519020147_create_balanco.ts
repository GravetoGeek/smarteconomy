
exports.up = async function (knex:any) {
  await knex.schema.hasTable('balance').then(async (exists:any) => {
    if (!exists) {
      await knex.schema.createTable('balance', (table:any) => {
        table.increments('id').primary();
        table.decimal('total_balance', { precision: 2 }).notNullable()
        table.decimal('total_income', { precision: 2 }).notNullable()
        table.decimal('total_expense', { precision: 2 }).notNullable()
        table.datetime('date', { precision: 6 }).defaultTo(knex.fn.now(6))
        table.integer('profile_id').unsigned()
        table.foreign('profile_id').references('id').inTable('profiles').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamps(true, true)
      }
      )
    }
  })
};

exports.down = async function (knex:any) {
  await knex.schema.hasTable('balance').then(async (exists:any) => {
    if (exists) {
      await knex.schema.dropTable('balance')
    }
  }
  )
};
