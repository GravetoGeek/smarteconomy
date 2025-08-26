import {Injectable} from '@nestjs/common'
import {Account,AccountType} from '../../domain/account.entity'
import {CreateAccountRequest,CreateAccountUseCase} from '../use-cases/create-account.use-case'
import {FindAccountByIdRequest,FindAccountByIdUseCase} from '../use-cases/find-account-by-id.use-case'
import {FindAccountsByUserRequest,FindAccountsByUserUseCase} from '../use-cases/find-accounts-by-user.use-case'
import {SearchAccountsRequest,SearchAccountsUseCase} from '../use-cases/search-accounts.use-case'

export interface CreateAccountDto {
    name: string
    type: AccountType
    balance?: number
    userId: string
}

export interface SearchAccountsDto {
    page?: number
    limit?: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

@Injectable()
export class AccountsApplicationService {
    constructor(
        private readonly createAccountUseCase: CreateAccountUseCase,
        private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
        private readonly findAccountsByUserUseCase: FindAccountsByUserUseCase,
        private readonly searchAccountsUseCase: SearchAccountsUseCase
    ) {}

    async createAccount(dto: CreateAccountDto): Promise<Account> {
        const request: CreateAccountRequest={
            name: dto.name,
            type: dto.type,
            balance: dto.balance,
            userId: dto.userId
        }
        const result=await this.createAccountUseCase.execute(request)
        return result.account
    }

    async findAccountById(id: string): Promise<Account|null> {
        const request: FindAccountByIdRequest={id}
        const result=await this.findAccountByIdUseCase.execute(request)
        return result.account
    }

    async findAccountsByUser(userId: string): Promise<Account[]> {
        const request: FindAccountsByUserRequest={userId}
        const result=await this.findAccountsByUserUseCase.execute(request)
        return result.accounts
    }

    async searchAccounts(dto: SearchAccountsDto) {
        const request: SearchAccountsRequest={
            page: dto.page||1,
            limit: dto.limit||10,
            filter: dto.filter,
            sort: dto.sort,
            sortDirection: dto.sortDirection
        }
        const result=await this.searchAccountsUseCase.execute(request)
        return result.accounts
    }
}
