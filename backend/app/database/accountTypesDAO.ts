import AccountTypes from '../models/AccountTypes'
import connection from './connection'

export const accountTypes_create = async (accountType: AccountTypes) => {
    const result = await connection('account_types').insert(accountType)
    return result
}

export const accountTypes_read = async (id: number) => {
    const result = await connection('account_types').where({ id })
    return result
}

export const accountTypes_list = async () => {
    const result = await connection('account_types').select()
    return result
}

export const accountTypes_update = async (id: number, accountType: AccountTypes) => {
    const result = await connection('account_types')
        .where({ id })
        .update(accountType)
    return result
}

export const accountTypes_delete = async (id: number) => {
    const result = await connection('account_types').where({ id }).del()
    return result
}
