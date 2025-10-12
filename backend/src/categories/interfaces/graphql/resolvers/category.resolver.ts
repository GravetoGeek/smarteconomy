import {Logger} from '@nestjs/common'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {CategoryApplicationService} from '../../../application/services/category-application.service'
import {CreateCategoryInput} from '../inputs/create-category.input'
import {Category} from '../models/category.model'

@Resolver(() => Category)
export class CategoryResolver {
    private readonly logger=new Logger(CategoryResolver.name)

    constructor(
        private readonly categoryApplicationService: CategoryApplicationService
    ) {}

    @Query(() => [Category])
    async categories(): Promise<Category[]> {
        try {
            this.logger.log('Fetching all categories')
            const categories=await this.categoryApplicationService.findAllCategories()
            return categories
        } catch(error) {
            this.logger.error('Error fetching categories',error.stack)
            throw error
        }
    }

    @Query(() => [Category])
    async categoriesByType(
        @Args('type',{type: () => String}) type: string
    ): Promise<Category[]> {
        try {
            this.logger.log(`Fetching categories by type: ${type}`)
            const categories=await this.categoryApplicationService.findCategoriesByType(type)
            return categories
        } catch(error) {
            this.logger.error(`Error fetching categories by type: ${type}`,error.stack)
            throw error
        }
    }

    @Query(() => Category)
    async category(@Args('id',{type: () => String}) id: string): Promise<Category> {
        try {
            this.logger.log(`Fetching category with id: ${id}`)
            const category=await this.categoryApplicationService.findCategoryById({id})
            return category
        } catch(error) {
            this.logger.error(`Error fetching category with id: ${id}`,error.stack)
            throw error
        }
    }

    @Mutation(() => Category)
    async createCategory(@Args('input') input: CreateCategoryInput): Promise<Category> {
        try {
            this.logger.log(`Creating category: ${input.category}`)
            const category=await this.categoryApplicationService.createCategory({
                category: input.category
            })
            return category
        } catch(error) {
            this.logger.error(`Error creating category: ${input.category}`,error.stack)
            throw error
        }
    }
}
