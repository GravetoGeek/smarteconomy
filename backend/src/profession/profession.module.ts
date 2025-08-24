import {DatabaseModule} from '@/database/database.module'
import {Logger,Module} from '@nestjs/common'
import {ProfessionApplicationService} from './application/services/profession-application.service'
import {CreateProfessionUseCase} from './application/use-cases/create-profession.use-case'
import {FindAllProfessionsUseCase} from './application/use-cases/find-all-professions.use-case'
import {FindProfessionByIdUseCase} from './application/use-cases/find-profession-by-id.use-case'
import {PROFESSION_REPOSITORY} from './domain/tokens'
import {ProfessionResolver} from './graphql/resolvers/profession.resolver'
import {ProfessionPrismaRepository} from './infrastructure/repositories/profession-prisma.repository'

@Module({
    imports: [DatabaseModule],
    providers: [
        // Infrastructure adapters
        {
            provide: PROFESSION_REPOSITORY,
            useClass: ProfessionPrismaRepository
        },

        // Use cases
        CreateProfessionUseCase,
        FindAllProfessionsUseCase,
        FindProfessionByIdUseCase,

        // Application services
        ProfessionApplicationService,

        // GraphQL interface
        ProfessionResolver,

        // Logger for debugging
        Logger
    ],
    exports: [ProfessionApplicationService]
})
export class ProfessionModule {}
