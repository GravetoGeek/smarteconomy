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
            throw { statusCode: 404, message: 'Transação não encontrada' }
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
        let result = await transactionDAO.transaction_update(
            Number(id),
            transaction
        )
        if (result.length === 0)
            throw { statusCode: 404, message: 'Transação não encontrada' }
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
            throw { statusCode: 404, message: 'Transação não encontrada' }
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
        let { userId, startDate, endDate, categoryId, type, accountId } = req.body
        let result: Transaction[] = []

        if (userId === undefined)
            throw { statusCode: 400, message: 'Usuário não informado' }
        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            type === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byUser(userId)
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            type === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDate(
                userId,
                startDate,
                endDate
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            type === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategory(
                userId,
                categoryId
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            type !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byType(userId, type)
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            type === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byAccount(
                userId,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            type === undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategory(
                userId,
                startDate,
                endDate,
                categoryId
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            type !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateType(
                userId,
                startDate,
                endDate,
                type
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            type === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateAccount(
                userId,
                startDate,
                endDate,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            type !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryType(
                userId,
                categoryId,
                type
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            type === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryAccount(
                userId,
                categoryId,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId === undefined &&
            type !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byTypeAccount(
                userId,
                type,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            type !== undefined &&
            accountId === undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategoryType(
                userId,
                startDate,
                endDate,
                categoryId,
                type
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            type === undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateCategoryAccount(
                userId,
                startDate,
                endDate,
                categoryId,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId === undefined &&
            type !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byDateTypeAccount(
                userId,
                startDate,
                endDate,
                type,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate === undefined &&
            endDate === undefined &&
            categoryId !== undefined &&
            type !== undefined &&
            accountId !== undefined
        ) {
            result = await transactionDAO.transaction_filter_byCategoryTypeAccount(
                userId,
                categoryId,
                type,
                accountId
            )
        }

        if (
            userId !== undefined &&
            startDate !== undefined &&
            endDate !== undefined &&
            categoryId !== undefined &&
            type !== undefined &&
            accountId !== undefined
        ) {
            result =
                await transactionDAO.transaction_filter_byDateCategoryTypeAccount(
                    userId,
                    startDate,
                    endDate,
                    categoryId,
                    type,
                    accountId
                )
        }

        if (result.length === 0) return res.status(404).json({ message: 'Nenhuma transação encontrada' })
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
