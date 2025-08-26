/**
 * 💾 Prisma Transaction Repository
 * 
 * Implementação do repositório de transações usando Prisma ORM
 * seguindo os princípios da arquitetura hexagonal.
 */

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma/prisma.service'
import {
    TransactionRepositoryPort,
    Transaction,
    TransactionSearchParams,
    TransactionSearchResult,
    TransactionSummary,
    TransactionFilters
} from '../../domain'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(transaction: Transaction): Promise<Transaction> {
        const data = transaction.toPrisma()

        const saved = await this.prisma.transaction.create({
            data
        })

        return Transaction.reconstitute(saved)
    }

    async update(transaction: Transaction): Promise<Transaction> {
        const data = transaction.toPrisma()

        const updated = await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                description: data.description,
                status: data.status,
                updatedAt: data.updatedAt
            }
        })

        return Transaction.reconstitute(updated)
    }

    async findById(id: string): Promise<Transaction | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id }
        })

        return transaction ? Transaction.reconstitute(transaction) : null
    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: { accountId },
            orderBy: { date: 'desc' }
        })

        return transactions.map((t: any) => Transaction.reconstitute(t))
    }

    async findByCategoryId(categoryId: string): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: { categoryId },
            orderBy: { date: 'desc' }
        })

        return transactions.map((t: any) => Transaction.reconstitute(t))
    }

    async search(params: TransactionSearchParams): Promise<TransactionSearchResult> {
        const { filters, page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = params

        // Construir filtros Prisma
        const where = this.buildWhereClause(filters)

        // Construir ordenação
        const orderBy = this.buildOrderBy(sortBy, sortOrder)

        // Calcular offset
        const skip = (page - 1) * limit

        // Executar consulta com contagem
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            this.prisma.transaction.count({ where })
        ])

        // Calcular metadados de paginação
        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPreviousPage = page > 1

        return {
            items: transactions.map((t: any) => Transaction.reconstitute(t)),
            total,
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    }

    async getSummary(accountId: string, dateFrom: Date, dateTo: Date): Promise<TransactionSummary> {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                accountId,
                date: {
                    gte: dateFrom,
                    lte: dateTo
                },
                status: 'COMPLETED'
            }
        })

        let totalIncome = 0
        let totalExpenses = 0
        let totalTransfers = 0

        transactions.forEach((transaction: any) => {
            switch (transaction.type) {
                case 'INCOME':
                    totalIncome += transaction.amount
                    break
                case 'EXPENSE':
                    totalExpenses += transaction.amount
                    break
                case 'TRANSFER':
                    totalTransfers += transaction.amount
                    break
            }
        })

        const netAmount = totalIncome - totalExpenses

        return {
            totalIncome,
            totalExpenses,
            totalTransfers,
            netAmount,
            transactionCount: transactions.length,
            period: {
                from: dateFrom,
                to: dateTo
            }
        }
    }

    async getRecentTransactions(accountId: string, limit = 10): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        return transactions.map((t: any) => Transaction.reconstitute(t))
    }

    async getPendingTransactions(accountId: string): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                accountId,
                status: 'PENDING'
            },
            orderBy: { createdAt: 'asc' }
        })

        return transactions.map((t: any) => Transaction.reconstitute(t))
    }

    async checkDuplicate(
        accountId: string,
        amount: number,
        description: string,
        date: Date
    ): Promise<boolean> {
        // Verificar duplicatas nas últimas 24 horas
        const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000)
        const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000)

        const duplicate = await this.prisma.transaction.findFirst({
            where: {
                accountId,
                amount,
                description,
                date: {
                    gte: yesterday,
                    lte: tomorrow
                }
            }
        })

        return !!duplicate
    }

    async remove(id: string): Promise<void> {
        await this.prisma.transaction.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                updatedAt: new Date()
            }
        })
    }

    async count(filters?: TransactionFilters): Promise<number> {
        const where = this.buildWhereClause(filters)
        return await this.prisma.transaction.count({ where })
    }

    async getStatistics(
        accountId: string,
        period: 'week' | 'month' | 'quarter' | 'year'
    ): Promise<{
        totalTransactions: number
        totalIncome: number
        totalExpenses: number
        averageTransaction: number
        largestTransaction: number
        smallestTransaction: number
    }> {
        const dateFrom = this.calculatePeriodStart(period)
        const dateTo = new Date()

        const transactions = await this.prisma.transaction.findMany({
            where: {
                accountId,
                date: {
                    gte: dateFrom,
                    lte: dateTo
                },
                status: 'COMPLETED'
            }
        })

        if (transactions.length === 0) {
            return {
                totalTransactions: 0,
                totalIncome: 0,
                totalExpenses: 0,
                averageTransaction: 0,
                largestTransaction: 0,
                smallestTransaction: 0
            }
        }

        let totalIncome = 0
        let totalExpenses = 0
        const amounts = transactions.map(t => t.amount)

        transactions.forEach(transaction => {
            if (transaction.type === 'INCOME') {
                totalIncome += transaction.amount
            } else if (transaction.type === 'EXPENSE') {
                totalExpenses += transaction.amount
            }
        })

        return {
            totalTransactions: transactions.length,
            totalIncome,
            totalExpenses,
            averageTransaction: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length,
            largestTransaction: Math.max(...amounts),
            smallestTransaction: Math.min(...amounts)
        }
    }

    private buildWhereClause(filters?: TransactionFilters): any {
        if (!filters) return {}

        const where: any = {}

        if (filters.accountId) where.accountId = filters.accountId
        if (filters.categoryId) where.categoryId = filters.categoryId
        if (filters.type) where.type = filters.type
        if (filters.status) where.status = filters.status

        if (filters.dateFrom || filters.dateTo) {
            where.date = {}
            if (filters.dateFrom) where.date.gte = filters.dateFrom
            if (filters.dateTo) where.date.lte = filters.dateTo
        }

        if (filters.minAmount || filters.maxAmount) {
            where.amount = {}
            if (filters.minAmount) where.amount.gte = filters.minAmount
            if (filters.maxAmount) where.amount.lte = filters.maxAmount
        }

        if (filters.searchTerm) {
            where.description = {
                contains: filters.searchTerm,
                mode: 'insensitive'
            }
        }

        return where
    }

    private buildOrderBy(sortBy: string, sortOrder: string): any {
        return { [sortBy]: sortOrder }
    }

    private calculatePeriodStart(period: 'week' | 'month' | 'quarter' | 'year'): Date {
        const now = new Date()

        switch (period) {
            case 'week': {
                const weekStart = new Date(now)
                weekStart.setDate(now.getDate() - 7)
                return weekStart
            }
            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), 1)
            case 'quarter': {
                const quarterStart = Math.floor(now.getMonth() / 3) * 3
                return new Date(now.getFullYear(), quarterStart, 1)
            }
            case 'year':
                return new Date(now.getFullYear(), 0, 1)
            default:
                return new Date(now.getFullYear(), now.getMonth(), 1)
        }
    }
}
