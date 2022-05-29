
exports.up = async function (knex:any) {
  await knex.schema.hasTable('gender').then(async (exists:any) => {
    if (!exists) {
      await knex.schema.createTable('gender', (table:any) => {
        table.increments('id').primary();
        table.string('gender', 255).notNullable().unique()
        table.timestamps(true, true)
      })
    }
  })
};

exports.down = async function (knex:any) {
  await knex.schema.hasTable('gender').then(async (exists:any) => {
    if (exists) {
      await knex.schema.dropTable('gender')
    }
  })
};
