import { Injectable, Inject } from '@nestjs/common'
import { Category } from '../../domain/entities/category'
import { CategoryRepositoryPort } from '../../domain/ports/category-repository.port'
import { CATEGORY_REPOSITORY } from '../../domain/tokens'
import { CategoryAlreadyExistsException, InvalidCategoryNameException } from '../../domain/exceptions/category-domain.exception'

export interface CreateCategoryRequest {
    category: string
}

@Injectable()
export class CreateCategoryUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: CategoryRepositoryPort
    ) {}

    async execute(request: CreateCategoryRequest): Promise<Category> {
        const { category } = request

        // Validate category name
        this.validateCategoryName(category)

        // Check if category already exists
        const existingCategory = await this.categoryRepository.findByCategory(category)
        if (existingCategory) {
            throw new CategoryAlreadyExistsException(category)
        }

        // Create new category
        const newCategory = Category.create({ category })

        // Save and return
        return await this.categoryRepository.save(newCategory)
    }

    private validateCategoryName(category: string): void {
        if (!category || category.trim().length === 0) {
            throw new InvalidCategoryNameException(category)
        }

        if (category.trim().length < 2) {
            throw new InvalidCategoryNameException(category)
        }

        if (category.trim().length > 100) {
            throw new InvalidCategoryNameException(category)
        }
    }
}
