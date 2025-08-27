export interface UserAuthData {
    id: string
    email: string
    password: string
    role: string
    status: string
}

export interface CreateUserData {
    email: string
    name: string
    lastname: string
    birthdate: Date
    password: string
    genderId: string
    professionId: string
    role?: string
}

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<UserAuthData | null>
    findById(id: string): Promise<UserAuthData | null>
    updateLastLogin(userId: string): Promise<void>
    create(userData: CreateUserData): Promise<UserAuthData>
}
