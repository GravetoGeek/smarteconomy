import {Inject,Injectable} from '@nestjs/common'
import {UserEmailAlreadyExistsException} from '../../domain/exceptions/user-domain.exception'
import {HashServicePort} from '../../domain/ports/hash-service.port'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {User,UserRole} from '../../domain/user.entity'
import {HASH_SERVICE,USER_REPOSITORY} from '../../domain/tokens'

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

        // Hash password
        const hashedPassword=await this.hashService.hash(request.password)

        // Create user entity
        const user=User.create({
            email: request.email,
            name: request.name,
            lastname: request.lastname,
            birthdate: request.birthdate,
            role: request.role,
            genderId: request.genderId,
            professionId: request.professionId,
            profileId: request.profileId,
            password: hashedPassword
        })

        // Save to repository
        const savedUser=await this.userRepository.save(user)

        return {user: savedUser}
    }
}
