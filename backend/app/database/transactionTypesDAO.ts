import TransactionType from '../models/TransactionTypes'
import connection from './connection'

export const transactionTypes_create = async (transactionType: TransactionType) => {
    const result = await connection('transaction_types').insert(transactionType)
    return result
}

export const transactionTypes_read = async (id: number) => {
    const result = await connection('transaction_types').where({ id })
    return result
}

export const transactionTypes_list = async () => {
    const result = await connection('transaction_types').select()
    return result
}

export const transactionTypes_update = async (id: number, transactionType: TransactionType) => {
    const result = await connection('transaction_types')
        .where({ id })
        .update(transactionType)
    return result
}

export const transactionTypes_delete = async (id: number) => {
    const result = await connection('transaction_types').where({ id }).del()
    return result
}
