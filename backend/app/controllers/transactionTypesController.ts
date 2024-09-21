import { Request, Response } from 'express'
import * as transactionTypesDAO from '../database/transactionTypesDAO'
import TransactionTypes from '../models/TransactionTypes'


export const transactionTypes_create = async (req: Request, res: Response) => {
    try {
        let { type, description } = req.body
        let transactionTypes: TransactionTypes = { type, description }
        let result = await transactionTypesDAO.transactionTypes_create(transactionTypes)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transactionTypes_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await transactionTypesDAO.transactionTypes_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de transação não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transactionTypes_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let transactionTypes: TransactionTypes = req.body
        let result = await transactionTypesDAO.transactionTypes_update(Number(id), transactionTypes)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de transação não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transactionTypes_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await transactionTypesDAO.transactionTypes_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de transação não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transactionTypes_list = async (req: Request, res: Response) => {
    try {
        let result = await transactionTypesDAO.transactionTypes_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
