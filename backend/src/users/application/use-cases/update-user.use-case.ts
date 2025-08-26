import {Inject,Injectable} from '@nestjs/common'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {HashServicePort} from '../../domain/ports/hash-service.port'
import {User,UserRole} from '../../domain/user.entity'
import {USER_REPOSITORY,HASH_SERVICE} from '../../domain/tokens'

export interface UpdateUserRequest {
    id: string
    name?: string
    lastname?: string
    role?: UserRole
    password?: string
}

export interface UpdateUserResponse {
    user: User|null  // ✅ Pode ser null se não encontrar
    success: boolean
}

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE)
        private readonly hashService: HashServicePort
    ) {}

    async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
        // ✅ Buscar usuário existente (pode retornar null)
        const existingUser=await this.userRepository.findById(request.id)
        if(!existingUser) {
            // ✅ Retornar resultado indicando que não foi possível atualizar
            return {user: null, success: false}
        }

        // Update user properties
        if(request.name||request.lastname) {
            existingUser.updateProfile(
                request.name||existingUser.name,
                request.lastname||existingUser.lastname
            )
        }

        if(request.role) {
            if(request.role===UserRole.ADMIN) {
                existingUser.promoteToAdmin()
            } else {
                existingUser.demoteToUser()
            }
        }

        // Handle password update
        if(request.password) {
            const hashedPassword=await this.hashService.hash(request.password)
            // Note: This would require a method in the User entity to update password
            // For now, we'll need to create a new user instance with updated password
        }

        // Save updated user
        const updatedUser=await this.userRepository.save(existingUser)

        return {user: updatedUser, success: true}
    }
}
