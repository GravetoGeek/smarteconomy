import {Injectable} from '@nestjs/common'
import {PrismaService} from '../../../database/prisma/prisma.service'
import {Category} from '../../domain/entities/category'
import {CategoryRepositoryPort} from '../../domain/ports/category-repository.port'

@Injectable()
export class CategoryPrismaRepository implements CategoryRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async save(category: Category): Promise<Category> {
        try {
            const categoryData={
                category: category.category,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            }

            const savedCategory=await this.prisma.postCategory.upsert({
                where: {id: category.id},
                update: categoryData,
                create: {id: category.id,...categoryData}
            })

            return Category.reconstitute(savedCategory)
        } catch(error) {
            throw error
        }
    }

    async findById(id: string): Promise<Category|null> {
        try {
            const category=await this.prisma.postCategory.findUnique({
                where: {id}
            })

            if(!category) {
                return null
            }

            return Category.reconstitute(category)
        } catch(error) {
            throw error
        }
    }

    async findByCategory(category: string): Promise<Category|null> {
        try {
            const foundCategory=await this.prisma.postCategory.findFirst({
                where: {category}
            })

            if(!foundCategory) {
                return null
            }

            return Category.reconstitute(foundCategory)
        } catch(error) {
            throw error
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            const categories=await this.prisma.postCategory.findMany({
                orderBy: {category: 'asc'}
            })

            return categories.map(category => Category.reconstitute(category))
        } catch(error) {
            throw error
        }
    }

    async findByType(type: string): Promise<Category[]> {
        try {
            const categories=await this.prisma.category.findMany({
                where: {
                    defaultType: type as any
                },
                orderBy: {name: 'asc'}
            })

            return categories.map(cat => Category.reconstitute({
                id: cat.id,
                category: cat.name,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt
            }))
        } catch(error) {
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.postCategory.delete({
                where: {id}
            })
        } catch(error) {
            throw error
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            const count=await this.prisma.postCategory.count({
                where: {id}
            })

            return count>0
        } catch(error) {
            throw error
        }
    }

    async existsByCategory(category: string): Promise<boolean> {
        try {
            const count=await this.prisma.postCategory.count({
                where: {category}
            })

            return count>0
        } catch(error) {
            throw error
        }
    }
}
