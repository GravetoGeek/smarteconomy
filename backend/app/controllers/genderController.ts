import Gender from '../models/Gender'
import { Request, Response } from 'express'
import * as genderDAO from '../database/genderDAO'

export const gender_create = async (req: Request, res: Response) => {
    try {
        if (!req?.body?.gender)
            throw { statusCode: 400, message: 'Gênero não informado' }
        const gender: Gender = req.body

        let result = await genderDAO.gender_create(gender)
        console.log(result)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const gender_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await genderDAO.gender_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Gênero não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const gender_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let gender: Gender = req.body
        let result = await genderDAO.gender_update(Number(id), gender)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Gênero não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const gender_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await genderDAO.gender_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Gênero não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const gender_list = async (req: Request, res: Response) => {
    try {
        let result = await genderDAO.gender_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
