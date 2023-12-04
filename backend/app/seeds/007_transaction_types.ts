import { faker } from '@faker-js/faker'
import { Knex } from 'knex'
import TransactionType from '../models/TransactionTypes'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('transaction_types').del()
    const types_name = [
        'Despesa',
        'Renda',
        'Transferência',
    ]

    const types: TransactionType[] = []

    for (const type of types_name) {
        types.push({
            type: type,
            description: faker.lorem.sentence(),
        })
    }

    // Inserts seed entries
    await knex('transaction_types').insert(types)
}
