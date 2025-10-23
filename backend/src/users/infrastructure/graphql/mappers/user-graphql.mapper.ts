import {User as DomainUser} from '../../../domain/user.entity'
import {UserModel} from '../../dtos/models/user.model'

export class UserGraphQLMapper {
    static toModel(user: DomainUser): UserModel {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            birthdate: user.birthdate,
            role: user.role,
            genderId: user.genderId,
            professionId: user.professionId,
            profileId: user.profileId??null,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    static toModelList(users: DomainUser[]): UserModel[] {
        return users.map(user => this.toModel(user))
    }
}
