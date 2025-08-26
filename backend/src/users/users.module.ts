import {DatabaseModule} from '@/database/database.module'
import {Module} from '@nestjs/common'
import {SharedModule} from '../shared/shared.module'

// Domain
import {HashServicePort} from './domain/ports/hash-service.port'
import {UserRepositoryPort} from './domain/ports/user-repository.port'

// Application
import {UsersApplicationService} from './application/services/users-application.service'
import {CreateUserUseCase} from './application/use-cases/create-user.use-case'
import {DeleteUserUseCase} from './application/use-cases/delete-user.use-case'
import {FindUserByEmailUseCase} from './application/use-cases/find-user-by-email.use-case'
import {FindUserByIdUseCase} from './application/use-cases/find-user-by-id.use-case'
import {SearchUsersUseCase} from './application/use-cases/search-users.use-case'
import {UpdateUserUseCase} from './application/use-cases/update-user.use-case'

// Infrastructure
import {UsersPrismaRepository} from './infrastructure/repositories/users-prisma.repository'
import {HashPrismaService} from './infrastructure/services/hash-prisma.service'

// Interfaces
import {UsersResolver} from './interfaces/graphql/resolvers/users.resolver'

// Tokens para injeção de dependência
import {USER_REPOSITORY, HASH_SERVICE} from './domain/tokens'

@Module({
    imports: [SharedModule,DatabaseModule],
    providers: [
        // Infrastructure Adapters (primeiro para garantir que estão disponíveis)
        {
            provide: USER_REPOSITORY,
            useClass: UsersPrismaRepository
        },
        {
            provide: HASH_SERVICE,
            useClass: HashPrismaService
        },

        // Use Cases (dependem dos adapters)
        CreateUserUseCase,
        FindUserByIdUseCase,
        FindUserByEmailUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        SearchUsersUseCase,

        // Application Services (dependem dos use cases)
        UsersApplicationService,

        // Interface Adapters (dependem dos services)
        UsersResolver
    ],
    exports: [
        UsersApplicationService,
        USER_REPOSITORY,
        HASH_SERVICE
    ]
})
export class UsersModule {}
