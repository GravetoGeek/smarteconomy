export interface UserAuthData {
    id: string
    email: string
    password: string
    role: string
    status: string
}

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<UserAuthData | null>
    findById(id: string): Promise<UserAuthData | null>
    updateLastLogin(userId: string): Promise<void>
}
