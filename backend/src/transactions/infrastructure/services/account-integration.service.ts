/**
 * 🔗 Account Integration Service
 *
 * Serviço de integração entre módulos de Transaction e Account
 * para atualização de saldos e validações
 */

import {Injectable} from '@nestjs/common'
import {AccountBalanceService} from '../../../accounts/application/services/account-balance.service'
import {AccountBalance} from '../../domain'

export interface AccountIntegrationService {
    getAccountBalance(accountId: string): Promise<AccountBalance>
    updateAccountBalance(accountId: string,amount: number,operation: 'CREDIT'|'DEBIT'): Promise<void>
    transfer(fromAccountId: string,toAccountId: string,amount: number): Promise<void>
}

@Injectable()
export class AccountIntegrationServiceImpl implements AccountIntegrationService {
    constructor(
        private readonly accountBalanceService: AccountBalanceService
    ) {}

    async getAccountBalance(accountId: string): Promise<AccountBalance> {
        const balance=await this.accountBalanceService.getBalance(accountId)
        return {
            accountId,
            balance
        }
    }

    async updateAccountBalance(
        accountId: string,
        amount: number,
        operation: 'CREDIT'|'DEBIT'
    ): Promise<void> {
        await this.accountBalanceService.updateBalance({
            accountId,
            amount,
            operation
        })
    }

    async transfer(
        fromAccountId: string,
        toAccountId: string,
        amount: number
    ): Promise<void> {
        await this.accountBalanceService.transfer(
            fromAccountId,
            toAccountId,
            amount
        )
    }
}
