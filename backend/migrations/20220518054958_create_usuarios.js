
exports.up = function (knex) {
  return knex.schema.hasTable('users').then(async (exists) => {
    if (!exists) {
      return await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email', 255).notNullable().unique()
        table.string('password', 255).notNullable()
        table.timestamps(true, true)
      })
    }
  })

};

exports.down = function (knex) {
  return knex.schema.hasTable('users').then(async (exists) => {
    if (exists) {
      return await knex.schema.dropTable('users')
    }
  })
};
