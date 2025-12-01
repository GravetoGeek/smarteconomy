import {User} from '../user.entity'

export interface SearchParams {
    page: number
    limit: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

export interface SearchResult {
    items: User[]
    total: number
    currentPage: number
    limit: number
    totalPages: number
    lastPage: number
}

export interface UserRepositoryPort {
    readonly sortableFields: string[]

    // Core CRUD operations
    create(user: User): Promise<User>
    update(user: User): Promise<User>
    findById(id: string): Promise<User|null>
    findByIdOrFail(id: string): Promise<User>
    findByEmail(email: string): Promise<User|null>
    findAll(): Promise<User[]>
    delete(id: string): Promise<void>

    // Search operations
    search(search: SearchParams): Promise<SearchResult>
    findConnection(params: {first?: number; after?: string; last?: number; before?: string; filter?: string}): Promise<{
        items: User[]
        total: number
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor?: string
        endCursor?: string
    }>

    // Business operations
    existsByEmail(email: string): Promise<boolean>
    existsById(id: string): Promise<boolean>
    updatePassword(userId: string,hashedPassword: string): Promise<void>
}
