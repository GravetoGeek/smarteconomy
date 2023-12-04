import AccountTypes from '../models/AccountTypes'
import { Request, Response } from 'express'
import * as accountTypesDAO from '../database/accountTypesDAO'


export const accountTypes_create = async (req: Request, res: Response) => {
    try {
        let { type, description} = req.body
        let accountType: AccountTypes = { type, description}
        let result = await accountTypesDAO.accountTypes_create(accountType)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const accountTypes_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await accountTypesDAO.accountTypes_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de conta não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const accountTypes_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let account: AccountTypes = req.body
        let result = await accountTypesDAO.accountTypes_update(Number(id), account)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de conta não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const accountTypes_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await accountTypesDAO.accountTypes_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Tipo de conta não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const accountTypes_list = async (req: Request, res: Response) => {
    try {
        let result = await accountTypesDAO.accountTypes_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
