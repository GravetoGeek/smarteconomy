import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("category").del();

    // Inserts seed entries
    await knex("category").insert([
        { id: 1, name: "rowValue1" ,description: "rowValue1"},
        { id: 2, name: "rowValue2" ,description: "rowValue2"},
        { id: 3, name: "rowValue3",description: "rowValue3"}
    ]);
};
