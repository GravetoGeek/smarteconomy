import {Inject,Injectable} from '@nestjs/common'
import {Account} from '../../domain/account.entity'
import {AccountRepositoryPort,SearchParams,SearchResult} from '../../domain/ports/account-repository.port'
import {ACCOUNT_REPOSITORY} from '../../domain/tokens'

export interface SearchAccountsRequest {
    page: number
    limit: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

export interface SearchAccountsResponse {
    accounts: SearchResult
}

@Injectable()
export class SearchAccountsUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort
    ) {}

    async execute(request: SearchAccountsRequest): Promise<SearchAccountsResponse> {
        const searchParams: SearchParams={
            page: request.page,
            limit: request.limit,
            filter: request.filter,
            sort: request.sort,
            sortDirection: request.sortDirection
        }
        
        const accounts=await this.accountRepository.search(searchParams)
        return {accounts}
    }
}
