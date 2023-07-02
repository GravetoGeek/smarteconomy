import { Request, Response } from 'express';
import * as professionDAO from '../database/professionDAO';
import Profession from "../models/Profession";

export const profession_create = async (req: Request, res: Response) => {
    try {
        if (!req?.body?.profession)
            throw { statusCode: 400, message: 'Profissão não informada' }
        const profession: Profession = req.body

        let result = await professionDAO.profession_create(profession)
        console.log(result)
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await professionDAO.profession_read(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_list = async (req: Request, res: Response) => {
    try {
        let result = await professionDAO.profession_list()
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissões não encontradas' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let profession: Profession = req.body
        let result = await professionDAO.profession_update(Number(id), profession)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await professionDAO.profession_delete(Number(id))
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_byCbo = async (req: Request, res: Response) => {
    try {
        let { cbo } = req.body
        let result = await professionDAO.profession_byCbo(cbo)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}


export const profession_byTitle = async (req: Request, res: Response) => {
    try {
        let { title } = req.body
        let result = await professionDAO.profession_byTitle(title)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_byType = async (req: Request, res: Response) => {
    try {
        let { type } = req.body
        let result = await professionDAO.profession_byType(type)
        if (result.length === 0)
            throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const profession_search = async (req: Request, res: Response) => {
    try {
        let { title } = req.body
        let result = await professionDAO.profession_search(title)
        // if (result.length === 0)
        //     throw { statusCode: 404, message: 'Profissão não encontrada' }
        return res.status(200).json(result)
    }
    catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}