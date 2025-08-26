import {Profession} from '../entities/profession'

export interface ProfessionRepositoryPort {
    save(profession: Profession): Promise<Profession>
    findById(id: string): Promise<Profession|null>
    findByProfession(profession: string): Promise<Profession|null>
    findAll(): Promise<Profession[]>
    delete(id: string): Promise<void>
    existsById(id: string): Promise<boolean>
    existsByProfession(profession: string): Promise<boolean>
}
