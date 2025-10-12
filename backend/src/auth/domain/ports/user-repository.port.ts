import type {AccountStatus,Role} from '@prisma/client'

export interface UserAuthData {
    id: string
    email: string
    password: string
    role: Role
    status: AccountStatus
}

export interface CreateUserData {
    email: string
    name: string
    lastname: string
    birthdate: Date
    password: string
    genderId: string
    professionId: string
    role?: Role
}

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<UserAuthData|null>
    findById(id: string): Promise<UserAuthData|null>
    updateLastLogin(userId: string): Promise<void>
    create(userData: CreateUserData): Promise<UserAuthData>
}
