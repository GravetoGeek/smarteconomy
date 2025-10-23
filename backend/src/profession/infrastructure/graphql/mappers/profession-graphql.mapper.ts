import {Profession} from '../../../domain/entities/profession'
import {ProfessionModel} from '../../dtos/models/profession.model'

export class ProfessionGraphQLMapper {
    static toModel(profession: Profession): ProfessionModel {
        return {
            id: profession.id,
            profession: profession.profession,
            createdAt: profession.createdAt,
            updatedAt: profession.updatedAt
        }
    }

    static toModelList(professions: Profession[]): ProfessionModel[] {
        return professions.map(profession => this.toModel(profession))
    }
}
