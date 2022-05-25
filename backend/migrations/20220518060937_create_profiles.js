
exports.up = function (knex) {
  return knex.schema.hasTable('profiles').then(async (exists) => {
    if (!exists) {
      return await knex.schema.createTable('profiles', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable()
        table.string('lastname', 255).notNullable()
        table.string('birth', 255).notNullable().unique()
        table.string('monthly_income', 255).notNullable()
        table.string('profession', 255).notNullable()
        table.string('gender').notNullable()
        table.integer('user_id').unique().unsigned()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamps(true, true)
      })
    }
  })
}
exports.down = function (knex) {
  return knex.schema.hasTable('profiles').then(async (exists) => {
    if (exists) {
      return await knex.schema.dropTable('profiles')
    }
  }
  )
}