import Account from '../models/Account'
import { Request, Response } from 'express'
import * as accountDAO from '../database/accountDAO'

export const account_create = async (req: Request, res: Response) => {
    try {
        let { name, description, type_id, profile_id } = req.body
        let account: Account = { name, description, type_id, profile_id }
        let result = await accountDAO.account_create(account)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const account_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await accountDAO.account_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Conta não encontrada' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const account_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let account: Account = req.body
        let result = await accountDAO.account_update(Number(id), account)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Conta não encontrada' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const account_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await accountDAO.account_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Conta não encontrada' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const account_list = async (req: Request, res: Response) => {
    try {
        let result = await accountDAO.account_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
