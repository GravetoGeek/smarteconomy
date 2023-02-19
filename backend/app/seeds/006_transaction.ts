import { Knex } from "knex";
import {faker} from '@faker-js/faker';
import Transaction from "../models/Transaction";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("transactions").del();
    
    let transactions:Transaction[] = [];
    let max_category:number = 3
    let min_category:number = 1
    let max_account:number = 100
    let min_account:number = 1


    for(let i = 0; i < 100; i++){
        transactions.push({
            amount: parseFloat((Math.random()*(20000-1200)+1200).toFixed(2)),
            destination_account: faker.finance.iban(true,'BR'),
            description: faker.lorem.sentence(),
            type: faker.finance.transactionType(),
            date: faker.date.past(),
            account_id: Math.round(Math.random() * (max_account - min_account) + min_account),
            category_id: Math.round(Math.random() * (max_category - min_category) + min_category)
        })
    }

    // Inserts seed entries
    await knex("transactions").insert(transactions);
};
