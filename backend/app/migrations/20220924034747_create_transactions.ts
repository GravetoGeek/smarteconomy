import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.float("amount",8,2).notNullable();
    table.string("destination_account").notNullable();
    table.string("description").notNullable();
    table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
    table.integer('account_id').unsigned().notNullable();
    table.foreign('account_id').references('id').inTable('accounts').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('category_id').unsigned().notNullable()
    table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE').onUpdate('CASCADE') 
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable("transactions").then(async (exists) => {
    if (exists) {
      return knex.schema.dropTable("transactions");
    }
  });
}
