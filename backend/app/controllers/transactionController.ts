import { Request, Response } from 'express'
import * as transactionDAO from '../database/transactionDAO'
import Transaction from '../models/Transaction'

export const transaction_create = async (req: Request, res: Response) => {
    try {
        let {
            description,
            amount,
            date,
            type_id: type_id,
            destination_account,
            category_id,
            account_id,
        } = req.body

        let transaction: Transaction = {
            amount,
            description,
            date,
            type_id: type_id,
            destination_account,
            category_id,
            account_id,
        }

        let result = await transactionDAO.transaction_create(transaction)
        return res.status(200).json(result)
    } catch (error: any) {
        console.log('Erro', error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transaction_read = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await transactionDAO.transaction_read(Number(id))
        if (result.length === 0)
            return res.status(404).json([])
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transaction_update = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let transaction: Transaction = req.body
        console.log('transaction', transaction)
        let result = await transactionDAO.transaction_update(
            Number(id),
            transaction
        )
        console.log('result', result)
        if (result.length === 0) {
            return res.status(404).json([])
        }
        else {
            return res.status(200).json(result)
        }
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transaction_delete = async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let result = await transactionDAO.transaction_delete(Number(id))
        if (result.length === 0)
            return res.status(404).json([])
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transaction_list = async (req: Request, res: Response) => {
    try {
        let result = await transactionDAO.transaction_list()
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message || 'Erro no servidor' })
    }
}

export const transaction_filter = async (req: Request, res: Response) => {
    try {
        let { profileId, startDate, endDate, categoryId, typeId, accountId } = req.body
        let result: Transaction[] = []

        if (profileId === undefined)
            throw { statusCode: 400, message: 'profileId não informado' }
        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            typeId === undefined &&
            accountId === undefined
        ) {
            console.log("entrou")
            result = await transactionDAO.transaction_filter_byProfile(profileId)
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            typeId === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDate(
                profileId,
                startDate,
                endDate
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            typeId === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategory(
                profileId,
                categoryId
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            typeId !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byType(profileId, typeId)
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            typeId === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byAccount(
                profileId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            typeId === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategory(
                profileId,
                startDate,
                endDate,
                categoryId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            typeId !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateType(
                profileId,
                startDate,
                endDate,
                typeId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            typeId === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateAccount(
                profileId,
                startDate,
                endDate,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            typeId !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryType(
                profileId,
                categoryId,
                typeId
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            typeId === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryAccount(
                profileId,
                categoryId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            typeId !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byTypeAccount(
                profileId,
                typeId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            typeId !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategoryType(
                profileId,
                startDate,
                endDate,
                categoryId,
                typeId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            typeId === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategoryAccount(
                profileId,
                startDate,
                endDate,
                categoryId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            typeId !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateTypeAccount(
                profileId,
                startDate,
                endDate,
                typeId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            typeId !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryTypeAccount(
                profileId,
                categoryId,
                typeId,
                accountId
            )
        }

        if (
            profileId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            typeId !== undefined &&
            accountId !== undefined
        ) {
            result =
                await transactionDAO.transaction_filter_byDateCategoryTypeAccount(
                    profileId,
                    startDate,
                    endDate,
                    categoryId,
                    typeId,
                    accountId
                )
        }

        if (result.length === 0) return res.status(404).json([])
        return res.status(200).json(result)
    } catch (error: any) {
        console.log(error)
        if (error?.statusCode)
            return res
                .status(error.statusCode || 500)
                .json({ message: error.message || 'Erro no servidor' })
        return error
    }
}
