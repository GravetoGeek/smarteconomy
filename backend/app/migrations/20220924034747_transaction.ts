import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transaction", (table) => {
    table.increments("id").primary();
    table.decimal("amount", 2).notNullable();
    table.decimal("destination_account", 2).notNullable();
    table.string("description").notNullable();
    table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
    table.integer('account_id').unsigned().notNullable().unique()
    table.foreign('account_id').references('id').inTable('account').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('category_id').unsigned().notNullable().unique()
    table.foreign('category_id').references('id').inTable('category').onDelete('CASCADE').onUpdate('CASCADE') 
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable("transaction").then(async (exists) => {
    if (exists) {
      return knex.schema.dropTable("transaction");
    }
  });
}
