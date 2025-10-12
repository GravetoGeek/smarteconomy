/**
 * 💰 Account Balance Service
 *
 * Serviço responsável por gerenciar operações de saldo das contas,
 * incluindo crédito, débito e validações de saldo.
 */

import {Inject,Injectable} from '@nestjs/common'
import {Account} from '../../domain/account.entity'
import {AccountDomainException} from '../../domain/exceptions/account-domain.exception'
import {AccountRepositoryPort} from '../../domain/ports/account-repository.port'
import {ACCOUNT_REPOSITORY} from '../../domain/tokens'

export interface UpdateBalanceRequest {
    accountId: string
    amount: number
    operation: 'CREDIT'|'DEBIT'
    description?: string
}

export interface UpdateBalanceResponse {
    account: Account
    previousBalance: number
    newBalance: number
}

@Injectable()
export class AccountBalanceService {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort
    ) {}

    /**
     * Atualiza o saldo de uma conta com operação de crédito
     */
    async credit(request: UpdateBalanceRequest): Promise<UpdateBalanceResponse> {
        // 1. Buscar conta
        const account=await this.accountRepository.findById(request.accountId)
        if(!account) {
            throw new AccountDomainException(`Conta não encontrada: ${request.accountId}`)
        }

        // 2. Validar operação
        if(request.amount<=0) {
            throw new AccountDomainException('Valor de crédito deve ser positivo')
        }

        // 3. Executar crédito usando método do domínio
        const previousBalance=account.balance
        account.credit(request.amount)

        // 4. Persistir alteração
        await this.accountRepository.save(account)

        return {
            account,
            previousBalance,
            newBalance: account.balance
        }
    }

    /**
     * Atualiza o saldo de uma conta com operação de débito
     */
    async debit(request: UpdateBalanceRequest): Promise<UpdateBalanceResponse> {
        // 1. Buscar conta
        const account=await this.accountRepository.findById(request.accountId)
        if(!account) {
            throw new AccountDomainException(`Conta não encontrada: ${request.accountId}`)
        }

        // 2. Validar operação
        if(request.amount<=0) {
            throw new AccountDomainException('Valor de débito deve ser positivo')
        }

        // 3. Executar débito usando método do domínio
        const previousBalance=account.balance
        account.debit(request.amount)

        // 4. Persistir alteração
        await this.accountRepository.save(account)

        return {
            account,
            previousBalance,
            newBalance: account.balance
        }
    }

    /**
     * Atualiza saldo com base no tipo de operação
     */
    async updateBalance(request: UpdateBalanceRequest): Promise<UpdateBalanceResponse> {
        if(request.operation==='CREDIT') {
            return this.credit(request)
        } else if(request.operation==='DEBIT') {
            return this.debit(request)
        } else {
            throw new AccountDomainException(`Operação inválida: ${request.operation}`)
        }
    }

    /**
     * Verifica se uma conta tem saldo suficiente
     */
    async hasBalance(accountId: string,amount: number): Promise<boolean> {
        const account=await this.accountRepository.findById(accountId)
        if(!account) {
            throw new AccountDomainException(`Conta não encontrada: ${accountId}`)
        }

        return account.balance>=amount
    }

    /**
     * Obtém o saldo atual de uma conta
     */
    async getBalance(accountId: string): Promise<number> {
        const account=await this.accountRepository.findById(accountId)
        if(!account) {
            throw new AccountDomainException(`Conta não encontrada: ${accountId}`)
        }

        return account.balance
    }

    /**
     * Transfere valor entre contas
     */
    async transfer(
        fromAccountId: string,
        toAccountId: string,
        amount: number
    ): Promise<{
        fromAccount: UpdateBalanceResponse
        toAccount: UpdateBalanceResponse
    }> {
        // 1. Débito da conta origem
        const fromResult=await this.debit({
            accountId: fromAccountId,
            amount,
            operation: 'DEBIT',
            description: `Transferência para ${toAccountId}`
        })

        // 2. Crédito na conta destino
        try {
            const toResult=await this.credit({
                accountId: toAccountId,
                amount,
                operation: 'CREDIT',
                description: `Transferência de ${fromAccountId}`
            })

            return {
                fromAccount: fromResult,
                toAccount: toResult
            }
        } catch(error) {
            // Reverter débito em caso de erro
            await this.credit({
                accountId: fromAccountId,
                amount,
                operation: 'CREDIT',
                description: 'Reversão de transferência falhada'
            })
            throw error
        }
    }
}
