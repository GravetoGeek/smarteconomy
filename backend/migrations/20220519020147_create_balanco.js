
exports.up = function (knex) {
  return knex.schema.hasTable('balance').then(async (exists) => {
    if (!exists) {
      return await knex.schema.createTable('balance', (table) => {
        table.increments('id').primary();
        table.decimal('total_balance', { precision: 2 }).notNullable()
        table.decimal('total_income', { precision: 2 }).notNullable()
        table.decimal('total_expense', { precision: 2 }).notNullable()
        table.datetime('date', { precision: 6 }).defaultTo(knex.fn.now(6))
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamps(true, true)
      }
      )
    }
  })
};

exports.down = function (knex) {
  return knex.schema.hasTable('balance').then(async (exists) => {
    if (exists) {
      return await knex.schema.dropTable('balance')
    }
  }
  )
};
