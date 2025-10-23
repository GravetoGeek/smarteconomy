import {Logger} from '@nestjs/common'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {CategoryApplicationService} from '../../../application/services/category-application.service'
import {CreateCategoryInput} from '../../dtos/inputs/create-category.input'
import {CategoryModel} from '../../dtos/models/category.model'
import {CategoryGraphQLMapper} from '../mappers/category-graphql.mapper'

@Resolver(() => CategoryModel)
export class CategoryResolver {
    private readonly logger=new Logger(CategoryResolver.name)

    constructor(
        private readonly categoryApplicationService: CategoryApplicationService
    ) {}

    @Query(() => [CategoryModel])
    async categories(): Promise<CategoryModel[]> {
        try {
            this.logger.log('Fetching all categories')
            const categories=await this.categoryApplicationService.findAllCategories()
            return CategoryGraphQLMapper.toModelList(categories)
        } catch(error) {
            this.logger.error('Error fetching categories',error.stack)
            throw error
        }
    }

    @Query(() => [CategoryModel])
    async categoriesByType(
        @Args('type',{type: () => String}) type: string
    ): Promise<CategoryModel[]> {
        try {
            this.logger.log(`Fetching categories by type: ${type}`)
            const categories=await this.categoryApplicationService.findCategoriesByType(type)
            return CategoryGraphQLMapper.toModelList(categories)
        } catch(error) {
            this.logger.error(`Error fetching categories by type: ${type}`,error.stack)
            throw error
        }
    }

    @Query(() => CategoryModel)
    async category(@Args('id',{type: () => String}) id: string): Promise<CategoryModel> {
        try {
            this.logger.log(`Fetching category with id: ${id}`)
            const category=await this.categoryApplicationService.findCategoryById({id})
            return CategoryGraphQLMapper.toModel(category)
        } catch(error) {
            this.logger.error(`Error fetching category with id: ${id}`,error.stack)
            throw error
        }
    }

    @Mutation(() => CategoryModel)
    async createCategory(@Args('input') input: CreateCategoryInput): Promise<CategoryModel> {
        try {
            this.logger.log(`Creating category: ${input.category}`)
            const category=await this.categoryApplicationService.createCategory({
                category: input.category
            })
            return CategoryGraphQLMapper.toModel(category)
        } catch(error) {
            this.logger.error(`Error creating category: ${input.category}`,error.stack)
            throw error
        }
    }
}
