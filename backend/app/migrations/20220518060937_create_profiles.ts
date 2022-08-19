
exports.up = async function (knex:any) {
  await knex.schema.hasTable('profiles').then(async (exists:any) => {
    if (!exists) {
      await await knex.schema.createTable('profiles', (table:any) => {
        table.increments('id').primary();
        table.string('name', 255)
        table.string('lastname', 255)
        table.date('birthday', 255)
        table.string('monthly_income', 255)
        table.string('profession', 255)
        table.string('gender')
        table.string('email', 255).notNullable().unique()
        table.integer('user_id').notNullable().unique().unsigned()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamps(true, true)
      })
    }
  })
}
exports.down = async function (knex:any) {
  await knex.schema.hasTable('profiles').then(async (exists:any) => {
    if (exists) {
      await knex.schema.dropTable('profiles')
    }
  }
  )
}