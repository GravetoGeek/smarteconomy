import {Inject,Injectable} from '@nestjs/common'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {User} from '../../domain/user.entity'
import {USER_REPOSITORY} from '../../domain/tokens'

export interface FindUserByIdRequest {
    id: string
}

export interface FindUserByIdResponse {
    user: User|null
}

@Injectable()
export class FindUserByIdUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(request: FindUserByIdRequest): Promise<FindUserByIdResponse> {
        const user=await this.userRepository.findById(request.id)
        return {user}
    }
}
