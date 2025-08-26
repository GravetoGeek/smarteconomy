import {Gender} from '../entities/gender'

export interface GenderRepositoryPort {
    save(gender: Gender): Promise<Gender>
    findById(id: string): Promise<Gender|null>
    findByGender(gender: string): Promise<Gender|null>
    findAll(): Promise<Gender[]>
    delete(id: string): Promise<void>
    existsById(id: string): Promise<boolean>
    existsByGender(gender: string): Promise<boolean>
}
