/**
 * 🔗 Account Integration Service
 *
 * Serviço de integração entre módulos de Transaction e Account
 * para atualização de saldos e validações
 */

import {Injectable} from '@nestjs/common'
import {AccountBalanceService} from '../../../accounts/application/services/account-balance.service'
import {AccountBalance} from '../../domain'
import {AccountServicePort} from '../../domain/ports/account-service.port'

@Injectable()
export class AccountIntegrationServiceImpl implements AccountServicePort {
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
