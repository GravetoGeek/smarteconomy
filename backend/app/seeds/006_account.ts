import { faker } from '@faker-js/faker'
import { Knex } from 'knex'
import Account from '../models/Account'

export async function seed(knex: Knex): Promise<void> {

    await knex('accounts').del()

    let accounts: Account[] = []
    let max_profile = 100
    let min_profile = 1
    let account_types = 16

    faker.locale = 'pt_BR'


    for (let i = 0; i < 500; i++) {

        accounts.push({
            type_id: Math.floor(Math.random() * account_types + 1),
            description: faker.lorem.sentence(),
            name: i === 0 ? 'Outra conta' : `Conta ${i} - ${faker.finance.accountName()}`,
            profile_id: Math.round(
                Math.random() * (max_profile - min_profile) + min_profile
            ),
        })
    }

    // Inserts seed entries
    await knex('accounts').insert(accounts)
}