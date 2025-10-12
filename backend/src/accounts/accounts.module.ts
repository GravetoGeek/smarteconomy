import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/database/database.module'
import { SharedModule } from '../shared/shared.module'

// Domain
import { AccountRepositoryPort } from './domain/ports/account-repository.port'

// Application
import { AccountsApplicationService } from './application/services/accounts-application.service'
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case'
import { FindAccountByIdUseCase } from './application/use-cases/find-account-by-id.use-case'
import { FindAccountsByUserUseCase } from './application/use-cases/find-accounts-by-user.use-case'
import { SearchAccountsUseCase } from './application/use-cases/search-accounts.use-case'

// Infrastructure
import { AccountsPrismaRepository } from './infrastructure/repositories/accounts-prisma.repository'

// Interfaces
import { AccountsResolver } from './interfaces/graphql/resolvers/accounts.resolver'

// Tokens para injeção de dependência
import { ACCOUNT_REPOSITORY } from './domain/tokens'

@Module({
    imports: [SharedModule, DatabaseModule],
    providers: [
        // Infrastructure Adapters (primeiro para garantir que estão disponíveis)
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: AccountsPrismaRepository
        },

        // Use Cases (dependem dos adapters)
        CreateAccountUseCase,
        FindAccountByIdUseCase,
        FindAccountsByUserUseCase,
        SearchAccountsUseCase,

        // Application Services (dependem dos use cases)
        AccountsApplicationService,

        // Interface Adapters (dependem dos services)
        AccountsResolver
    ],
    exports: [
        AccountsApplicationService,
        ACCOUNT_REPOSITORY
    ]
})
export class AccountsModule { }
