import { Injectable, Inject } from '@nestjs/common'
import { Category } from '../../domain/entities/category'
import { CategoryRepositoryPort } from '../../domain/ports/category-repository.port'
import { CATEGORY_REPOSITORY } from '../../domain/tokens'
import { CategoryNotFoundException } from '../../domain/exceptions/category-domain.exception'

export interface FindCategoryByIdRequest {
    id: string
}

@Injectable()
export class FindCategoryByIdUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: CategoryRepositoryPort
    ) {}

    async execute(request: FindCategoryByIdRequest): Promise<Category> {
        const { id } = request

        const category = await this.categoryRepository.findById(id)
        if (!category) {
            throw new CategoryNotFoundException(id)
        }

        return category
    }
}
