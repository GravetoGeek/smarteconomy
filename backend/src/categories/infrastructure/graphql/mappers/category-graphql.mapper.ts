import {Category as CategoryEntity} from '../../../domain/entities/category'
import {CategoryModel} from '../../dtos/models/category.model'

export class CategoryGraphQLMapper {
    static toModel(category: CategoryEntity): CategoryModel {
        return {
            id: category.id,
            category: category.category,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }
    }

    static toModelList(categories: CategoryEntity[]): CategoryModel[] {
        return categories.map(category => this.toModel(category))
    }
}
