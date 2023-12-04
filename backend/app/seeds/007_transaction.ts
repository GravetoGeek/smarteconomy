import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import Transaction from "../models/Transaction";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("transactions").del();

    let transactions: Transaction[] = [];
    let max_category = 7;
    let min_category = 1;
    let max_account = 100;
    let min_account = 1;
    faker.locale = "pt_BR";

    for (let i = 0; i < 15; i++) {
        let account_1 = Math.round(
            Math.random() * (max_account - min_account) + min_account
        );
        let account_2 = Math.round(
            Math.random() * (max_account - min_account) + min_account
        );
        if (account_2 === account_1) {
            account_2 += 1; // evita que o segundo número seja igual ao primeiro
        }
        transactions.push({
            amount: parseFloat(
                (Math.random() * (20000 - 1200) + 1200).toFixed(2)
            ),
            destination_account: account_2,
            description: faker.lorem.sentence(),
            type: faker.finance.transactionType(),
            date: faker.date.past().getTime(),
            account_id: account_1,
            category_id: Math.round(
                Math.random() * (max_category - min_category) + min_category
            ),
        });
    }

    // Inserts seed entries
    await knex("transactions").insert(transactions);
}
