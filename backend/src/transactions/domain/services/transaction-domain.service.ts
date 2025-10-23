/**
 * 🎯 Transaction Domain Service
 *
 * Serviço de domínio que encapsula lógica de negócio complexa
 * relacionada a transações que envolve múltiplas entidades.
 */

import {
    DuplicateTransactionException,
    MissingDestinationAccountException,
    MissingDestinationBalanceException,
    MissingTransactionCategoryException,
    TransactionNotFoundException,
    TransactionStatusException
} from '../exceptions/transaction-domain.exception'
import {TransactionRepositoryPort} from '../ports/transaction-repository.port'
import {Transaction,TransactionStatus,TransactionType} from '../transaction.entity'

export interface AccountBalance {
    accountId: string
    balance: number
}

export interface TransactionDomainServicePort {
    /**
     * Processa uma transação completa, incluindo validações de negócio
     */
    processTransaction(
        transaction: Transaction,
        accountBalance: AccountBalance,
        destinationBalance?: AccountBalance
    ): Promise<{
        transaction: Transaction
        updatedBalances: AccountBalance[]
    }>

    /**
     * Valida se uma transação pode ser processada
     */
    validateTransaction(
        transaction: Transaction,
        accountBalance: AccountBalance,
        destinationBalance?: AccountBalance
    ): Promise<void>

    /**
     * Reverte uma transação concluída
     */
    reverseTransaction(
        transactionId: string,
        reason: string
    ): Promise<Transaction>

    /**
     * Detecta transações suspeitas ou duplicadas
     */
    detectSuspiciousActivity(
        accountId: string,
        transaction: Transaction
    ): Promise<{
        isDuplicate: boolean
        isSuspicious: boolean
        reasons: string[]
    }>
}

export class TransactionDomainService implements TransactionDomainServicePort {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async processTransaction(
        transaction: Transaction,
        accountBalance: AccountBalance,
        destinationBalance?: AccountBalance
    ): Promise<{
        transaction: Transaction
        updatedBalances: AccountBalance[]
    }> {
        // 1. Validar a transação
        await this.validateTransaction(transaction,accountBalance,destinationBalance)

        // 2. Detectar atividade suspeita
        const suspiciousActivity=await this.detectSuspiciousActivity(
            transaction.accountId,
            transaction
        )

        if(suspiciousActivity.isDuplicate) {
            throw new DuplicateTransactionException()
        }

        // 3. Calcular novos saldos
        const updatedBalances=this.calculateUpdatedBalances(
            transaction,
            accountBalance,
            destinationBalance
        )

        // 4. Completar a transação
        transaction.complete()

        return {
            transaction,
            updatedBalances
        }
    }

    async validateTransaction(
        transaction: Transaction,
        accountBalance: AccountBalance,
        destinationBalance?: AccountBalance
    ): Promise<void> {
        // Validar status da transação
        if(!transaction.canBeCompleted()) {
            throw new TransactionStatusException(transaction.status,'processar')
        }

        // Validar categoria obrigatória (exceto transferências)
        if(!transaction.isTransfer&&!transaction.categoryId) {
            throw new MissingTransactionCategoryException()
        }

        // Validar conta de destino para transferências
        if(transaction.isTransfer) {
            if(!destinationBalance) {
                throw new MissingDestinationBalanceException()
            }

            if(!transaction.destinationAccountId) {
                throw new MissingDestinationAccountException()
            }
        }
    }

    async reverseTransaction(
        transactionId: string,
        reason: string
    ): Promise<Transaction> {
        const transaction=await this.transactionRepository.findById(transactionId)

        if(!transaction) {
            throw new TransactionNotFoundException(transactionId)
        }

        if(!transaction.canBeReversed()) {
            throw new TransactionStatusException(transaction.status,'reverter')
        }

        // Criar transação de reversão
        const reversalTransaction=new Transaction({
            description: `REVERSÃO: ${transaction.description} - ${reason}`,
            amount: transaction.amount,
            type: transaction.isExpense? TransactionType.INCOME:TransactionType.EXPENSE,
            accountId: transaction.accountId,
            categoryId: transaction.categoryId,
            destinationAccountId: transaction.destinationAccountId
        })

        // Cancelar transação original
        transaction.cancel()

        // Salvar ambas as transações
        await this.transactionRepository.update(transaction)
        await this.transactionRepository.save(reversalTransaction)

        return reversalTransaction
    }

    async detectSuspiciousActivity(
        accountId: string,
        transaction: Transaction
    ): Promise<{
        isDuplicate: boolean
        isSuspicious: boolean
        reasons: string[]
    }> {
        const reasons: string[]=[]
        let isDuplicate=false
        let isSuspicious=false

        // Verificar duplicatas (fallback defensivo)
        let isDuplicateTransaction=false
        if(typeof this.transactionRepository.checkDuplicate==='function') {
            isDuplicateTransaction=await this.transactionRepository.checkDuplicate(
                transaction.accountId,
                transaction.amount,
                transaction.description,
                transaction.date
            )
        }
        if(isDuplicateTransaction) {
            isDuplicate=true
            reasons.push('Transação duplicada detectada')
        }

        // Verificar valores suspeitos (acima de R$ 10.000)
        if(transaction.amount>10000) {
            isSuspicious=true
            reasons.push('Valor alto da transação')
        }

        // Verificar múltiplas transações em pouco tempo
        const recentTransactions=await this.transactionRepository.getRecentTransactions(
            accountId,
            10
        )

        const transactionsLastHour=recentTransactions.filter(txn => {
            const hourAgo=new Date(Date.now()-60*60*1000)
            return txn.createdAt>hourAgo
        })

        if(transactionsLastHour.length>5) {
            isSuspicious=true
            reasons.push('Muitas transações em pouco tempo')
        }

        // Verificar padrões suspeitos de valores
        const roundAmounts=recentTransactions.filter(txn =>
            txn.amount%100===0&&txn.amount>1000
        )

        if(roundAmounts.length>3) {
            isSuspicious=true
            reasons.push('Padrão suspeito de valores redondos')
        }

        return {
            isDuplicate,
            isSuspicious,
            reasons
        }
    }

    private calculateUpdatedBalances(
        transaction: Transaction,
        accountBalance: AccountBalance,
        destinationBalance?: AccountBalance
    ): AccountBalance[] {
        const updatedBalances: AccountBalance[]=[]

        // Atualizar saldo da conta origem
        let newOriginBalance=accountBalance.balance

        if(transaction.isExpense||transaction.isTransfer) {
            newOriginBalance-=transaction.amount
        } else if(transaction.isIncome) {
            newOriginBalance+=transaction.amount
        }

        updatedBalances.push({
            accountId: accountBalance.accountId,
            balance: newOriginBalance
        })

        // Atualizar saldo da conta destino (transferências)
        if(transaction.isTransfer&&destinationBalance) {
            updatedBalances.push({
                accountId: destinationBalance.accountId,
                balance: destinationBalance.balance+transaction.amount
            })
        }

        return updatedBalances
    }
}
