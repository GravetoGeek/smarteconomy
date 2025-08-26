import {Inject,Injectable} from '@nestjs/common'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {USER_REPOSITORY} from '../../domain/tokens'

export interface DeleteUserRequest {
    id: string
}

export interface DeleteUserResponse {
    success: boolean
}

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
        // ✅ Verificar existência com método boolean (não exceção)
        const userExists=await this.userRepository.existsById(request.id)
        if(!userExists) {
            // ✅ Retornar resultado indicando que não foi possível deletar
            return {success: false}
        }

        // Delete user
        await this.userRepository.delete(request.id)

        return {success: true}
    }
}
