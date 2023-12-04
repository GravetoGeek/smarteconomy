import { faker } from '@faker-js/faker'
import { Knex } from 'knex'
import moment from 'moment'
import Transaction from '../models/Transaction'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('transactions').del()
    let hoje = moment()
    let primeiro_dia = moment(hoje).startOf('month').date()
    let ultimo_dia = moment(hoje).endOf('month').date()



    let transactions: Transaction[] = []
    let max_category = 45
    let min_category = 1
    let max_account = 500
    let min_account = 1
    let min_type = 1
    let max_type = 3
    faker.locale = 'pt_BR'

    for (let i = 0; i < 10000; i++) {
        let account_1 = Math.round(
            Math.random() * (max_account - min_account) + min_account
        )
        let account_2 = Math.round(
            Math.random() * (max_account - min_account) + min_account
        )
        if (account_2 === account_1) {
            account_2 += 1 // evita que o segundo número seja igual ao primeiro
        }
        let category_id = Math.round(Math.random() * (max_category - min_category) + min_category)

        transactions.push({
            amount: parseFloat(
                (Math.random() * (20000 - 1200) + 1200).toFixed(2)
            ),
            destination_account: account_2,
            description: faker.lorem.sentence(),
            type_id: category_id <= 22 ? 1 : (category_id >= 23 && category_id <= 43) ? 2 : 3, // 1 = receita, 2 = despesa, 3 = transferência
            date: moment({ year: hoje.year(), month: hoje.month(), day: Math.round(Math.random() * (ultimo_dia - primeiro_dia) + primeiro_dia) }).format('YYYY-MM-DD'),
            account_id: account_1,
            category_id: category_id
        })
    }

    // Inserts seed entries
    await knex('transactions').insert(transactions)
}
