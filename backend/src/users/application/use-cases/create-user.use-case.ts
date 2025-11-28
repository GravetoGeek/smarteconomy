import {Inject,Injectable} from '@nestjs/common'
import {UserEmailAlreadyExistsException} from '../../domain/exceptions/user-domain.exception'
import {HashServicePort} from '../../domain/ports/hash-service.port'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {HASH_SERVICE,USER_REPOSITORY} from '../../domain/tokens'
import {User,UserRole} from '../../domain/user.entity'

export interface CreateUserRequest {
    email: string
    name: string
    lastname: string
    birthdate: string
    role: UserRole
    genderId: string
    professionId: string
    password: string
    profileId?: string
}

export interface CreateUserResponse {
    user: User
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE)
        private readonly hashService: HashServicePort
    ) {}

    async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // Check if user already exists
        const emailExists=await this.userRepository.existsByEmail(request.email)
        if(emailExists) {
            throw new UserEmailAlreadyExistsException(request.email)
        }

        // Validate user data by creating entity first (this will validate password complexity)
        const user=User.create({
            email: request.email,
            name: request.name,
            lastname: request.lastname,
            birthdate: request.birthdate,
            role: request.role,
            genderId: request.genderId,
            professionId: request.professionId,
            profileId: request.profileId,
            password: request.password // Use original password for validation
        })

        // Hash password after validation
        const hashedPassword=await this.hashService.hash(request.password)

        // Update user with hashed password
        user.updatePassword(hashedPassword)

        // Save to repository
        const savedUser=await this.userRepository.create(user)

        return {user: savedUser}
    }
}
