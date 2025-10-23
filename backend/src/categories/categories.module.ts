import {Logger,Module} from '@nestjs/common'
import {DatabaseModule} from '../database/database.module'
import {CategoryApplicationService} from './application/services/category-application.service'
import {CreateCategoryUseCase} from './application/use-cases/create-category.use-case'
import {FindAllCategoriesUseCase} from './application/use-cases/find-all-categories.use-case'
import {FindCategoriesByTypeUseCase} from './application/use-cases/find-categories-by-type.use-case'
import {FindCategoryByIdUseCase} from './application/use-cases/find-category-by-id.use-case'
import {CATEGORY_REPOSITORY} from './domain/tokens'
import {CategoryResolver} from './infrastructure/graphql/resolvers/category.resolver'
import {CategoryPrismaRepository} from './infrastructure/repositories/category-prisma.repository'

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: CATEGORY_REPOSITORY,
            useClass: CategoryPrismaRepository
        },
        CreateCategoryUseCase,
        FindAllCategoriesUseCase,
        FindCategoryByIdUseCase,
        FindCategoriesByTypeUseCase,
        CategoryApplicationService,
        CategoryResolver
    ],
    exports: [CategoryApplicationService,CATEGORY_REPOSITORY]
})
export class CategoriesModule {
    private readonly logger=new Logger(CategoriesModule.name)

    constructor() {
        this.logger.log('CategoriesModule initialized')
    }
}
