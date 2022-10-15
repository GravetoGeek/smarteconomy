import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("category", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }
  );
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable("category").then(async (exists) => {
    if (exists) {
      return knex.schema.dropTable("category");
    }
  });
}

