exports.up = function (knex:any) {
  return knex.schema.hasTable('accounts').then(async (exists:any) => {
    if (!exists) {
      return knex.schema.createTable('accounts', (table:any) => {
        table.increments('id').primary()
        // table.decimal('partial_balance', { precision: 2 }).defaultTo(0);
        // table.decimal('partial_income', { precision: 2 }).defaultTo(0);
        // table.decimal('partial_expense', { precision: 2 }).defaultTo(0);
        // table.decimal('partial_transfer_in', { precision: 2 }).defaultTo(0);
        // table.decimal('partial_transfer_out', { precision: 2 }).defaultTo(0);
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.string('type').notNullable()
        table.integer('profile_id').unsigned().notNullable().unique()
        table.foreign('profile_id').references('id').inTable('profiles').onDelete('CASCADE').onUpdate('CASCADE')
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })
    }
  })
}

exports.down = function (knex:any) {
  return knex.schema.hasTable('accounts').then(async (exists:any) => {
    if (exists) {
      return knex.schema.dropTable('accounts')
    }
  }
  ) 
};
