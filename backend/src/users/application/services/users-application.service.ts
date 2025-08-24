import {Injectable} from '@nestjs/common'
import {User,UserRole} from '../../domain/user.entity'
import {CreateUserRequest,CreateUserUseCase} from '../use-cases/create-user.use-case'
import {DeleteUserRequest,DeleteUserUseCase} from '../use-cases/delete-user.use-case'
import {FindUserByEmailRequest,FindUserByEmailUseCase} from '../use-cases/find-user-by-email.use-case'
import {FindUserByIdRequest,FindUserByIdUseCase} from '../use-cases/find-user-by-id.use-case'
import {SearchUsersRequest,SearchUsersUseCase} from '../use-cases/search-users.use-case'
import {UpdateUserRequest,UpdateUserUseCase} from '../use-cases/update-user.use-case'

export interface CreateUserDto {
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

export interface UpdateUserDto {
    name?: string
    lastname?: string
    birthdate?: string
    role?: UserRole
    password?: string
}

export interface SearchUsersDto {
    page?: number
    limit?: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

@Injectable()
export class UsersApplicationService {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly searchUsersUseCase: SearchUsersUseCase
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const request: CreateUserRequest={
            email: dto.email,
            name: dto.name,
            lastname: dto.lastname,
            birthdate: dto.birthdate,
            role: dto.role,
            genderId: dto.genderId,
            professionId: dto.professionId,
            password: dto.password,
            profileId: dto.profileId
        }

        const response=await this.createUserUseCase.execute(request)
        return response.user
    }

    async findUserById(id: string): Promise<User|null> {
        const request: FindUserByIdRequest={id}
        const response=await this.findUserByIdUseCase.execute(request)
        return response.user
    }

    async findUserByEmail(email: string): Promise<User|null> {
        const request: FindUserByEmailRequest={email}
        const response=await this.findUserByEmailUseCase.execute(request)
        return response.user
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User|null> {
        const request: UpdateUserRequest={
            id,
            name: dto.name,
            lastname: dto.lastname,
            role: dto.role as UserRole,
            password: dto.password
        }
        const response=await this.updateUserUseCase.execute(request)
        return response.success ? response.user : null
    }

    async deleteUser(id: string): Promise<boolean> {
        const request: DeleteUserRequest={id}
        const response=await this.deleteUserUseCase.execute(request)
        return response.success
    }

    async searchUsers(dto: SearchUsersDto): Promise<{
        users: User[]
        total: number
        currentPage: number
        limit: number
        totalPages: number
        lastPage: number
    }> {
        const request: SearchUsersRequest={
            page: dto.page||1,
            limit: dto.limit||10,
            filter: dto.filter,
            sort: dto.sort,
            sortDirection: dto.sortDirection
        }

        return await this.searchUsersUseCase.execute(request)
    }
}
