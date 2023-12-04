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

// Compare this snippet from backend\app\controllers\transactionController.ts: