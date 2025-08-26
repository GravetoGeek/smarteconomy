import {Account} from '../account.entity'

export interface SearchParams {
    page: number
    limit: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

export interface SearchResult {
    items: Account[]
    total: number
    currentPage: number
    limit: number
    totalPages: number
    lastPage: number
}

export interface AccountRepositoryPort {
    readonly sortableFields: string[]

    save(account: Account): Promise<Account>
    findById(id: string): Promise<Account|null>
    findAllByUser(userId: string): Promise<Account[]>
    delete(id: string): Promise<void>

    search(search: SearchParams): Promise<SearchResult>

    existsById(id: string): Promise<boolean>
}
