exports.up = async function (knex:any) {
  await knex.schema.hasTable('profiles').then(async (exists:any) => {
    if (!exists) {
      await await knex.schema.createTable('profiles', (table:any) => {
        table.increments('id').primary();
        table.string('name', 255);
        table.string('lastname', 255);
        table.string('birthday', 255);
        table.string('monthly_income', 255);
        table.string('profession', 255);
        table.string('email', 255).notNullable().unique()
        table.integer('gender_id').unsigned();
        table.foreign('gender_id').references('id').inTable('genders').onDelete('CASCADE').onUpdate('CASCADE')
        table.integer('user_id').unsigned().notNullable().unique()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
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