import {Injectable} from '@nestjs/common'
import {CreateTransactionUseCase,CreateTransactionUseCaseInput,CreateTransactionUseCaseOutput} from '../use-cases/create-transaction.use-case'
import {GetTransactionSummaryUseCase,GetTransactionSummaryUseCaseInput} from '../use-cases/get-transaction-summary.use-case'
import {ReverseTransactionUseCase,ReverseTransactionUseCaseInput,ReverseTransactionUseCaseOutput} from '../use-cases/reverse-transaction.use-case'
import {SearchTransactionsUseCase,SearchTransactionsUseCaseInput} from '../use-cases/search-transactions.use-case'
import {UpdateTransactionUseCase,UpdateTransactionUseCaseInput} from '../use-cases/update-transaction.use-case'

@Injectable()
export class TransactionsApplicationService {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly updateTransactionUseCase: UpdateTransactionUseCase,
        private readonly reverseTransactionUseCase: ReverseTransactionUseCase,
        private readonly searchTransactionsUseCase: SearchTransactionsUseCase,
        private readonly getTransactionSummaryUseCase: GetTransactionSummaryUseCase
    ) {}

    async createTransaction(input: CreateTransactionUseCaseInput): Promise<CreateTransactionUseCaseOutput> {
        // Aqui pode-se adicionar validações cross-case, logging, etc.
        return this.createTransactionUseCase.execute(input)
    }

    async updateTransaction(input: UpdateTransactionUseCaseInput) {
        return this.updateTransactionUseCase.execute(input)
    }

    async reverseTransaction(input: ReverseTransactionUseCaseInput): Promise<ReverseTransactionUseCaseOutput> {
        // Exemplo: validação de permissão, logging, etc.
        return this.reverseTransactionUseCase.execute(input)
    }

    async searchTransactions(input: SearchTransactionsUseCaseInput) {
        return this.searchTransactionsUseCase.execute(input)
    }

    async getTransactionSummary(input: GetTransactionSummaryUseCaseInput) {
        return this.getTransactionSummaryUseCase.execute(input)
    }
}
