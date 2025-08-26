import {DatabaseModule} from '@/database/database.module'
import {Logger,Module} from '@nestjs/common'
import {SharedModule} from '../shared/shared.module'

// Domain
import {GenderRepositoryPort} from './domain/ports/gender-repository.port'

// Application
import {GenderApplicationService} from './application/services/gender-application.service'
import {CreateGenderUseCase} from './application/use-cases/create-gender.use-case'
import {FindAllGendersUseCase} from './application/use-cases/find-all-genders.use-case'
import {FindGenderByIdUseCase} from './application/use-cases/find-gender-by-id.use-case'

// Infrastructure
import {GenderPrismaRepository} from './infrastructure/repositories/gender-prisma.repository'

// Interfaces
import {GenderResolver} from './interfaces/graphql/resolvers/gender.resolver'

// Tokens para injeção de dependência
import {GENDER_REPOSITORY} from './domain/tokens'

@Module({
    imports: [SharedModule,DatabaseModule],
    providers: [
        // Infrastructure Adapters (primeiro para garantir que estão disponíveis)
        {
            provide: GENDER_REPOSITORY,
            useClass: GenderPrismaRepository
        },

        // Use Cases (dependem dos adapters)
        CreateGenderUseCase,
        FindAllGendersUseCase,
        FindGenderByIdUseCase,

        // Application Services (dependem dos use cases)
        GenderApplicationService,

        // Interface Adapters (dependem dos services)
        GenderResolver
    ],
    exports: [
        GenderApplicationService,
        GENDER_REPOSITORY
    ]
})
export class GenderModule {
    private readonly logger=new Logger(GenderModule.name)

    constructor() {
        this.logger.log('GenderModule initialized')
    }
}
