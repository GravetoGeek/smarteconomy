import {Inject,Injectable} from '@nestjs/common'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {User} from '../../domain/user.entity'
import {USER_REPOSITORY} from '../../domain/tokens'

export interface FindUserByEmailRequest {
    email: string
}

export interface FindUserByEmailResponse {
    user: User|null
}

@Injectable()
export class FindUserByEmailUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(request: FindUserByEmailRequest): Promise<FindUserByEmailResponse> {
        const user=await this.userRepository.findByEmail(request.email)
        return {user}
    }
}
