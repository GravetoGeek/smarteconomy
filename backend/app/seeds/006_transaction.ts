import { Knex } from "knex";
import {faker} from '@faker-js/faker';
import Transaction from "../models/Transaction";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("transactions").del();
    
    let transactions:Transaction[] = [];
    let max:number = 3
    let min:number = 1


    for(let i = 0; i < 100; i++){
        transactions.push({
            amount: parseFloat((Math.random()*(20000-1200)+1200).toFixed(2)),
            destination_account: faker.finance.iban(true,'BR'),
            description: faker.lorem.sentence(),
            date: faker.date.past(),
            account_id: i+1,
            category_id: Math.round(Math.random() * (max - min) + min)
        })
    }

    // Inserts seed entries
    await knex("transactions").insert(transactions);
};
