import { Injectable, Inject } from '@nestjs/common'
import { Category } from '../../domain/entities/category'
import { CategoryRepositoryPort } from '../../domain/ports/category-repository.port'
import { CATEGORY_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class FindAllCategoriesUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: CategoryRepositoryPort
    ) {}

    async execute(): Promise<Category[]> {
        return await this.categoryRepository.findAll()
    }
}
