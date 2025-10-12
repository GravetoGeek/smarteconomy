import { Inject, Injectable } from '@nestjs/common'
import { Account } from '../../domain/account.entity'
import { AccountRepositoryPort } from '../../domain/ports/account-repository.port'
import { ACCOUNT_REPOSITORY } from '../../domain/tokens'

export interface FindAccountsByUserRequest {
    userId: string
}

export interface FindAccountsByUserResponse {
    accounts: Account[]
}

@Injectable()
export class FindAccountsByUserUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort
    ) { }

    async execute(request: FindAccountsByUserRequest): Promise<FindAccountsByUserResponse> {
        const accounts = await this.accountRepository.findAllByUser(request.userId)
        return { accounts }
    }
}
