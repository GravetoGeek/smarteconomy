import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import Category from "../models/Category";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("categories").del();
    const categories_name = [
        "Alimentação",
        "Educação",
        "Lazer",
        "Moradia",
        "Saúde",
        "Transporte",
        "Outros",
    ];

    const categories: Category[] = [];

    for (const category of categories_name) {
        categories.push({
            category: category,
            description: faker.lorem.sentence(),
        });
    }

    // Inserts seed entries
    await knex("categories").insert(categories);
}
