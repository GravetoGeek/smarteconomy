import Account from "../models/Account";
import connection from "./connection";

export const account_create = async (account:Account)=>{
    const result = await connection('accounts').insert(account)
    return result
}

export const account_read = async (id:number) => {
    const result = await connection('accounts').where({id})
    return result
}

export const account_list = async () =>{
    const result = await connection('accounts').select()
    return result
}

export const account_update = async (id:number,account:Account)=>{
    const result = await connection('accounts').where({id}).update(account)
    return result
}

export const account_delete = async(id:number)=>{
    const result = await connection('accounts').where({id}).del()
    return result
}
