
exports.up = function (knex) {
  return knex.schema.hasTable('account').then(async (exists) => {
    if (!exists) {
      return knex.schema.createTable('account', (table) => {
        table.increments('id').primary()
        table.decimal('partial_balance', { precision: 2 }).notNullable()
        table.decimal('partial_income', { precision: 2 }).notNullable()
        table.decimal('partial_expense', { precision: 2 }).notNullable()
        table.datetime('date', { precision: 6 }).defaultTo(knex.fn.now(6))
      })
    }
  })
}

exports.down = function (knex) {

};
