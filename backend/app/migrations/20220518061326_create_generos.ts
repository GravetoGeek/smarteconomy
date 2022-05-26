
exports.up = function (knex) {
  return knex.schema.hasTable('gender').then(async (exists) => {
    if (!exists) {
      return await knex.schema.createTable('gender', (table) => {
        table.increments('id').primary();
        table.string('gender', 255).notNullable().unique()
        table.timestamps(true, true)
      })
    }
  })
};

exports.down = function (knex) {
  return knex.schema.hasTable('gender').then(async (exists) => {
    if (exists) {
      return await knex.schema.dropTable('gender')
    }
  })
};
