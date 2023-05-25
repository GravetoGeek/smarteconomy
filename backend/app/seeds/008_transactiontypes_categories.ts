import { faker } from '@faker-js/faker'
import { Knex } from 'knex'
import TransactionType from '../models/TransactionTypes'
interface TransactionTypeCategory {
    transaction_type_id: number
    category_id: number
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('transactiontypes_categories').del()
    const type_category: TransactionTypeCategory[] = [
        { transaction_type_id: 1, category_id: 1 },
        { transaction_type_id: 1, category_id: 2 },
        { transaction_type_id: 1, category_id: 3 },
        { transaction_type_id: 1, category_id: 4 },
        { transaction_type_id: 1, category_id: 5 },
        { transaction_type_id: 1, category_id: 6 },
        { transaction_type_id: 1, category_id: 7 },
        { transaction_type_id: 1, category_id: 8 },
        { transaction_type_id: 1, category_id: 9 },
        { transaction_type_id: 1, category_id: 10 },
        { transaction_type_id: 1, category_id: 11 },
        { transaction_type_id: 1, category_id: 12 },
        { transaction_type_id: 1, category_id: 13 },
        { transaction_type_id: 1, category_id: 14 },
        { transaction_type_id: 1, category_id: 15 },
        { transaction_type_id: 1, category_id: 16 },
        { transaction_type_id: 1, category_id: 17 },
        { transaction_type_id: 1, category_id: 18 },
        { transaction_type_id: 1, category_id: 19 },
        { transaction_type_id: 1, category_id: 20 },
        { transaction_type_id: 1, category_id: 21 },
        { transaction_type_id: 1, category_id: 22 },
        { transaction_type_id: 2, category_id: 23 },
        { transaction_type_id: 2, category_id: 24 },
        { transaction_type_id: 2, category_id: 25 },
        { transaction_type_id: 2, category_id: 26 },
        { transaction_type_id: 2, category_id: 27 },
        { transaction_type_id: 2, category_id: 28 },
        { transaction_type_id: 2, category_id: 29 },
        { transaction_type_id: 2, category_id: 30 },
        { transaction_type_id: 2, category_id: 31 },
        { transaction_type_id: 2, category_id: 32 },
        { transaction_type_id: 2, category_id: 33 },
        { transaction_type_id: 2, category_id: 34 },
        { transaction_type_id: 2, category_id: 35 },
        { transaction_type_id: 2, category_id: 36 },
        { transaction_type_id: 2, category_id: 37 },
        { transaction_type_id: 2, category_id: 38 },
        { transaction_type_id: 2, category_id: 39 },
        { transaction_type_id: 2, category_id: 40 },
        { transaction_type_id: 2, category_id: 41 },
        { transaction_type_id: 2, category_id: 42 },
        { transaction_type_id: 2, category_id: 43 },
        { transaction_type_id: 3, category_id: 44 },
        { transaction_type_id: 3, category_id: 45 },
    ]

    // const types_categories_association: TransactionTypeCategory[] = []

    // for (const association of type_category) {
    //     types_categories_association.push({
    //         transaction_type_id: association.transaction_type_id,
    //         category_id: association.category_id,
    //     })
    // }

    // Inserts seed entries
    await knex('transactiontypes_categories').insert(type_category)
}
