import Transaction from "../models/Transaction";
import {Request, Response} from 'express';
import * as transactionDAO from "../database/transactionDAO";

export const transaction_create = async (req:Request, res:Response) => {
    try{
        let {description, amount, date,type, destination_account, category_id, account_id} = req.body;
        let transaction:Transaction = {amount, description, date, type, destination_account, category_id, account_id}
        let result = await transactionDAO.transaction_create(transaction)
        console.log(result);
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const transaction_read = async(req:Request, res:Response) => {
    try{
        let {id} = req.params;
        let result = await transactionDAO.transaction_read(Number(id));
        if(result.length === 0) throw {statusCode:404,message: 'Transação não encontrada'}
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const transaction_update = async(req:Request, res:Response) => {
    try{
        let {id} = req.params;
        let transaction:Transaction = req.body;
        let result = await transactionDAO.transaction_update(Number(id), transaction);
        if(result.length === 0) throw {statusCode:404,message: 'Transação não encontrada'}
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const transaction_delete = async(req:Request, res:Response) => {
    try{
        let {id} = req.params;
        let result = await transactionDAO.transaction_delete(Number(id));
        if(result.length === 0) throw {statusCode:404,message: 'Transação não encontrada'}
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const transaction_list = async(req:Request, res:Response) => {
    try{
        let result = await transactionDAO.transaction_list();
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

