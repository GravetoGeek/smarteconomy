import {Gender} from '../../../domain/entities/gender'
import {GenderModel} from '../../dtos/models/gender.model'

export class GenderGraphQLMapper {
    static toModel(gender: Gender): GenderModel {
        return {
            id: gender.id,
            gender: gender.gender,
            createdAt: gender.createdAt,
            updatedAt: gender.updatedAt
        }
    }

    static toModelList(genders: Gender[]): GenderModel[] {
        return genders.map(gender => this.toModel(gender))
    }
}
