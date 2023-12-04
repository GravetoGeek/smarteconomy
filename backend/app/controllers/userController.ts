import User from '../models/User'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import * as userDAO from '../database/userDAO'

export const user_create = async (req: Request, res: Response) => {
    try {
        let secret: string = process.env.JWT_SECRET || 'jabulani'
        if (!req?.body?.email || !req?.body?.password)
            throw {
                statusCode: 400,
                message: 'Email e/ou senha não informados',
            }
        const user: User = req.body
        user.password = bcrypt.hashSync(user.password, 10)

        let result = await userDAO.user_create(user)
        console.log(result)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const user_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await userDAO.user_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Usuário não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const user_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let user: User = req.body
        if (user?.password) user.password = bcrypt.hashSync(user.password, 10)
        let result = await userDAO.user_update(Number(id), user)
        if (result === 0)
            throw { statusCode: 404, message: 'Usuário não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const user_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await userDAO.user_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Usuário não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const user_list = async (req: Request, res: Response) => {
    try {
        let result = await userDAO.user_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
