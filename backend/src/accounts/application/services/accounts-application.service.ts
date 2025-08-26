import {Injectable} from '@nestjs/common'
import {CreateAccountUseCase} from '../use-cases/create-account.use-case'
import {AccountRepositoryPort} from '../../domain/ports/account-repository.port'
import {ACCOUNT_REPOSITORY} from '../../domain/tokens'
import {Inject} from '@nestjs/common'
import {Account} from '../../domain/account.entity'

@Injectable()
export class AccountsApplicationService {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: AccountRepositoryPort,
        private readonly createAccountUseCase: CreateAccountUseCase
    ) {}

    async createAccount(input: any): Promise<{account: Account}> {
        const result=await this.createAccountUseCase.execute(input)
        return result
    }

    async findAllByUser(userId: string): Promise<Account[]> {
        return this.accountRepository.findAllByUser(userId)
    }

    async findById(id: string): Promise<Account|null> {
        return this.accountRepository.findById(id)
    }
}
