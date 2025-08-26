import { Category } from '../entities/category'

export interface CategoryRepositoryPort {
    save(category: Category): Promise<Category>
    findById(id: string): Promise<Category | null>
    findByCategory(category: string): Promise<Category | null>
    findAll(): Promise<Category[]>
    delete(id: string): Promise<void>
    existsById(id: string): Promise<boolean>
    existsByCategory(category: string): Promise<boolean>
}
