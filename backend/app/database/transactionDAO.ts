import Transaction from "../models/Transaction";
import connection from "./connection";

export const transaction_create = async (transaction:Transaction)=>{
    const result = await connection('transactions').insert(transaction)
    return result
}

export const transaction_read = async (id:number) => {
    const result = await connection('transactions').where({id})
    return result
}

export const transaction_list = async () =>{
    const result = await connection('transactions').select()
    return result
}

export const transaction_update = async (id:number,transaction:Transaction)=>{
    const result = await connection('transactions').where({id}).update(transaction)
    return result
}

export const transaction_delete = async(id:number)=>{
    const result = await connection('transactions').where({id}).del()
    return result
}

export const transaction_filter_byUser = async (userId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId)
    return result
}

export const transaction_filter_byDate = async (userId:number,startDate:string,endDate:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byCategory = async (userId:number,categoryId:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId)
    return result
}

export const transaction_filter_byType = async (userId:number,type:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.type',type)
    return result
}

export const transaction_filter_byAccount = async (userId:number,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.account_id',accountId)
    return result
}

export const transaction_filter_byDateCategory = async (userId:number,startDate:string,endDate:string,categoryId:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byDateType = async (userId:number,startDate:string,endDate:string,type:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.type',type).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byDateAccount = async (userId:number,startDate:string,endDate:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.account_id',accountId).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byCategoryType = async (userId:number,categoryId:string,type:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.type',type)
    return result
}

export const transaction_filter_byCategoryAccount = async (userId:number,categoryId:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.account_id',accountId)
    return result
}

export const transaction_filter_byTypeAccount = async (userId:number,type:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.type',type).where('transactions.account_id',accountId)
    return result
}

export const transaction_filter_byDateCategoryType = async (userId:number,startDate:string,endDate:string,categoryId:string,type:string) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.type',type).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byDateCategoryAccount = async (userId:number,startDate:string,endDate:string,categoryId:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.account_id',accountId).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byDateTypeAccount = async (userId:number,startDate:string,endDate:string,type:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.type',type).where('transactions.account_id',accountId).whereBetween('transactions.date',[startDate,endDate])
    return result
}

export const transaction_filter_byCategoryTypeAccount = async (userId:number,categoryId:string,type:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.type',type).where('transactions.account_id',accountId)
    return result
}

export const transaction_filter_byDateCategoryTypeAccount = async (userId:number,startDate:string,endDate:string,categoryId:string,type:string,accountId:number) => {
    const result = await connection('transactions')
    .join('accounts','accounts.id','transactions.account_id')
    .join('profiles','profiles.id','accounts.profile_id').select('*').where('profiles.user_id',userId).where('transactions.category_id',categoryId).where('transactions.type',type).where('transactions.account_id',accountId).whereBetween('transactions.date',[startDate,endDate])
    return result
}



// Compare this snippet from backend\app\controllers\transactionController.ts: