import {Inject,Injectable} from '@nestjs/common'
import {Account} from '../../domain/account.entity'
import {AccountRepositoryPort} from '../../domain/ports/account-repository.port'
import {ACCOUNT_REPOSITORY} from '../../domain/tokens'

export interface FindAccountByIdRequest {
    id: string
}

export interface FindAccountByIdResponse {
    account: Account|null
}

@Injectable()
export class FindAccountByIdUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort
    ) {}

    async execute(request: FindAccountByIdRequest): Promise<FindAccountByIdResponse> {
        const account=await this.accountRepository.findById(request.id)
        return {account}
    }
}
