import Profile from '../models/Profile'
import { Request, Response } from 'express'
import * as profileDAO from '../database/profileDAO'

export const profile_create = async (req: Request, res: Response) => {
    try {
        let profile: Profile = req.body
        let result = await profileDAO.profileDAO_create(profile)
        console.log(result)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profile_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await profileDAO.profileDAO_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Perfil não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profile_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let profile: Profile = req.body
        let result = await profileDAO.profileDAO_update(Number(id), profile)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Perfil não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profile_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await profileDAO.profileDAO_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Perfil não encontrado' }
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profile_list = async (req: Request, res: Response) => {
    try {
        let result = await profileDAO.profileDAO_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}
