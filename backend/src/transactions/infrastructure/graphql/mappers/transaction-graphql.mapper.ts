import {Transaction,TransactionSearchResult,TransactionSummary} from '../../../domain'
import {
    CreateTransactionResponseModel,
    TransactionModel,
    TransactionSearchResultModel,
    TransactionStatusEnum,
    TransactionSummaryModel,
    TransactionTypeEnum
} from '../../dtos/models/transaction.model'

export class TransactionGraphQLMapper {
    static toModel(transaction: Transaction): TransactionModel {
        return {
            id: transaction.id,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type as unknown as TransactionTypeEnum,
            status: transaction.status as unknown as TransactionStatusEnum,
            accountId: transaction.accountId,
            categoryId: transaction.categoryId??null,
            destinationAccountId: transaction.destinationAccountId??null,
            date: transaction.date,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
        }
    }

    static toModelList(transactions: Transaction[]): TransactionModel[] {
        return transactions.map(transaction => this.toModel(transaction))
    }

    static toCreateResponseModel(
        transaction: Transaction,
        warnings: string[]
    ): CreateTransactionResponseModel {
        return {
            transaction: this.toModel(transaction),
            warnings
        }
    }

    static toSearchResultModel(
        result: TransactionSearchResult,
        limit: number
    ): TransactionSearchResultModel {
        return {
            transactions: this.toModelList(result.items),
            total: result.total,
            page: result.currentPage,
            limit,
            totalPages: result.totalPages
        }
    }

    static toSummaryModel(summary: TransactionSummary): TransactionSummaryModel {
        return {
            totalIncome: summary.totalIncome,
            totalExpense: summary.totalExpenses,
            totalTransfer: summary.totalTransfers,
            balance: summary.netAmount,
            period: `${summary.period.from.toISOString()} - ${summary.period.to.toISOString()}`
        }
    }
}
