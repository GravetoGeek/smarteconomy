import { Inject, Injectable } from '@nestjs/common'
import { Account, AccountType } from '../../domain/account.entity'
import { AccountRepositoryPort } from '../../domain/ports/account-repository.port'
import { ACCOUNT_REPOSITORY } from '../../domain/tokens'

export interface CreateAccountRequest {
    name: string
    type: AccountType
    balance?: number
    userId: string
}

export interface CreateAccountResponse {
    account: Account
}

@Injectable()
export class CreateAccountUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort
    ) { }

    async execute(request: CreateAccountRequest): Promise<CreateAccountResponse> {
        const account = new Account({
            name: request.name,
            type: request.type,
            balance: request.balance || 0,
            userId: request.userId
        })

        const saved = await this.accountRepository.save(account)
        return { account: saved }
    }
}
