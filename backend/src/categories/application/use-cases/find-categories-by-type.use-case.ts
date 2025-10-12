import {Inject,Injectable} from '@nestjs/common'
import {Category} from '../../domain/entities/category'
import {CategoryRepositoryPort} from '../../domain/ports/category-repository.port'
import {CATEGORY_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class FindCategoriesByTypeUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: CategoryRepositoryPort
    ) {}

    async execute(type: string): Promise<Category[]> {
        return await this.categoryRepository.findByType(type)
    }
}
