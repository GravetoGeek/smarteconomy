import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import Account from "../models/Account";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("accounts").del();

    let accounts:Account[] = [];
    let max_profile = 100;
    let min_profile = 1;

    for(let i = 0; i < 100; i++){
        accounts.push({
            name: faker.finance.accountName(),
            description: faker.lorem.sentence(),
            type: faker.finance.account(),
            profile_id: Math.round(Math.random() * (max_profile - min_profile) + min_profile),
        })
    }
    

    // Inserts seed entries
    await knex("accounts").insert(accounts);
};
