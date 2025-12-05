/**
 * 🎯 Create Transaction Use Case
 *
 * Caso de uso para criação de transações seguindo
 * os princípios da Clean Architecture.
 */

import {Inject,Injectable} from '@nestjs/common'
import {
    AccountBalance,
    Transaction,
    TransactionDomainService,
    TransactionRepositoryPort
} from '../../domain'
import {AccountServicePort} from '../../domain/ports/account-service.port'

export interface CreateTransactionUseCaseInput {
    description: string
    amount: number
    type: 'INCOME'|'EXPENSE'|'TRANSFER'
    accountId: string
    categoryId?: string
    destinationAccountId?: string
    date?: Date
}

export interface CreateTransactionUseCaseOutput {
    transaction: Transaction
    updatedBalances: AccountBalance[]
    warnings: string[]
}

@Injectable()
export class CreateTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepositoryPort,
        private readonly transactionDomainService: TransactionDomainService,
        @Inject('AccountServicePort') private readonly accountService: AccountServicePort
    ) {}

    async execute(input: CreateTransactionUseCaseInput): Promise<CreateTransactionUseCaseOutput> {
        // 1. Criar a entidade de transação
        const transaction=new Transaction({
            description: input.description,
            amount: input.amount,
            type: input.type as any,
            accountId: input.accountId,
            categoryId: input.categoryId,
            destinationAccountId: input.destinationAccountId,
            date: input.date
        })

        // 2. Obter saldos das contas
        const accountBalance=await this.getAccountBalance(input.accountId)
        let destinationBalance: AccountBalance|undefined

        if(input.destinationAccountId) {
            destinationBalance=await this.getAccountBalance(input.destinationAccountId)
        }

        // 3. Processar a transação através do domain service
        const result=await this.transactionDomainService.processTransaction(
            transaction,
            accountBalance,
            destinationBalance
        )

        // 4. Salvar a transação
        const savedTransaction=await this.transactionRepository.save(result.transaction)

        // 5. Atualizar saldos das contas
        await this.applyBalanceUpdates(savedTransaction)

        // 6. Detectar atividade suspeita
        const suspiciousActivity=await this.transactionDomainService.detectSuspiciousActivity(
            input.accountId,
            savedTransaction
        )

        return {
            transaction: savedTransaction,
            updatedBalances: result.updatedBalances,
            warnings: suspiciousActivity.isSuspicious? suspiciousActivity.reasons:[]
        }
    }

    private async getAccountBalance(accountId: string): Promise<AccountBalance> {
        // Implementação delegada para o serviço de integração
        return await this.accountService.getAccountBalance(accountId)
    }

    private async applyBalanceUpdates(transaction: Transaction): Promise<void> {
        if(transaction.type==='INCOME') {
            await this.accountService.updateAccountBalance(transaction.accountId,transaction.amount,'CREDIT')
        } else if(transaction.type==='EXPENSE') {
            await this.accountService.updateAccountBalance(transaction.accountId,transaction.amount,'DEBIT')
        } else if(transaction.type==='TRANSFER') {
            if(transaction.destinationAccountId) {
                await this.accountService.transfer(transaction.accountId,transaction.destinationAccountId,transaction.amount)
            }
        }
    }
}
