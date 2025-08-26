import { Injectable } from '@nestjs/common'
import { Category } from '../../domain/entities/category'
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case'
import { FindAllCategoriesUseCase } from '../use-cases/find-all-categories.use-case'
import { FindCategoryByIdUseCase } from '../use-cases/find-category-by-id.use-case'

export interface CreateCategoryRequest {
    category: string
}

export interface FindCategoryByIdRequest {
    id: string
}

@Injectable()
export class CategoryApplicationService {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase,
        private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase
    ) {}

    async createCategory(request: CreateCategoryRequest): Promise<Category> {
        return await this.createCategoryUseCase.execute(request)
    }

    async findAllCategories(): Promise<Category[]> {
        return await this.findAllCategoriesUseCase.execute()
    }

    async findCategoryById(request: FindCategoryByIdRequest): Promise<Category> {
        return await this.findCategoryByIdUseCase.execute(request)
    }
}
