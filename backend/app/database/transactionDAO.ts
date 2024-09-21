import Transaction from '../models/Transaction'
import connection from './connection'

export const transaction_create = async (transaction: Transaction) => {
    const result = await connection('transactions').insert(transaction)
    return result
}

export const transaction_read = async (id: number) => {
    const result = await connection('transactions').where({ id })
    return result
}

export const transaction_list = async () => {
    const result = await connection('transactions').select()
    return result
}

export const transaction_update = async (
    id: number,
    transaction: Transaction
) => {
    const result = await connection('transactions')
        .where({ id })
        .update(transaction)
    return result
}

export const transaction_delete = async (id: number) => {
    const result = await connection('transactions').where({ id }).del()
    return result
}

export const transaction_filter_byProfile = async (profileId: number) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
    return result
}

export const transaction_filter_byDate = async (
    profileId: number,
    startDate: string,
    endDate: string
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byCategory = async (
    profileId: number,
    categoryId: string
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
    return result
}

export const transaction_filter_byType = async (
    profileId: number,
    type_id: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.type_id', type_id)
    return result
}

export const transaction_filter_byAccount = async (
    profileId: number,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.account_id', accountId)
    return result
}

export const transaction_filter_byDateCategory = async (
    profileId: number,
    startDate: string,
    endDate: string,
    categoryId: string
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byDateType = async (
    profileId: number,
    startDate: string,
    endDate: string,
    type_id: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.type_id', type_id)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byDateAccount = async (
    profileId: number,
    startDate: string,
    endDate: string,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.account_id', accountId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byCategoryType = async (
    profileId: number,
    categoryId: string,
    type_id: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.type_id', type_id)
    return result
}

export const transaction_filter_byCategoryAccount = async (
    profileId: number,
    categoryId: string,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.account_id', accountId)
    return result
}

export const transaction_filter_byTypeAccount = async (
    profileId: number,
    type_id: number,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.type_id', type_id)
        .where('transactions.account_id', accountId)
    return result
}

export const transaction_filter_byDateCategoryType = async (
    profileId: number,
    startDate: string,
    endDate: string,
    categoryId: string,
    type_id: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.type_id', type_id)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byDateCategoryAccount = async (
    profileId: number,
    startDate: string,
    endDate: string,
    categoryId: string,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.account_id', accountId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byDateTypeAccount = async (
    profileId: number,
    startDate: string,
    endDate: string,
    type_id: number,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.type_id', type_id)
        .where('transactions.account_id', accountId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

export const transaction_filter_byCategoryTypeAccount = async (
    profileId: number,
    categoryId: string,
    type_id: number,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.type_id', type_id)
        .where('transactions.account_id', accountId)
    return result
}

export const transaction_filter_byDateCategoryTypeAccount = async (
    profileId: number,
    startDate: string,
    endDate: string,
    categoryId: string,
    type_id: number,
    accountId: number
) => {
    const result = await connection('transactions')
        .join('accounts', 'accounts.id', 'transactions.account_id')
        .join('profiles', 'profiles.id', 'accounts.profile_id')
        .select(
            'amount',
            'destination_account',
            'transactions.description',
            'transactions.type_id',
            'date',
            'account_id',
            'category_id',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.id'
        )
        .where('profiles.id', profileId)
        .where('transactions.category_id', categoryId)
        .where('transactions.type_id', type_id)
        .where('transactions.account_id', accountId)
        .whereBetween('transactions.date', [startDate, endDate])
    return result
}

// Compare this snippet from backend\app\controllers\transactionController.ts:
