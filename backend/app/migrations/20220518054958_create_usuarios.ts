
exports.up = async function (knex:any) {
  await knex.schema.hasTable('users').then(async (exists:boolean) => {
    if (!exists) {
      await knex.schema.createTable('users', (table:any) => {
        table.increments('id').primary();
        table.string('email', 255).notNullable().unique()
        table.string('password', 255).notNullable()
        table.timestamps(true, true)
      })
    }
  })

};

exports.down = async function (knex:any) {
  await knex.schema.hasTable('users').then(async (exists:boolean) => {
    if (exists) {
      await knex.schema.dropTable('users')
    }
  })
};
