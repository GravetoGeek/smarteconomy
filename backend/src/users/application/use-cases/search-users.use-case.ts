import {Inject,Injectable} from '@nestjs/common'
import {SearchParams,SearchResult,UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {User} from '../../domain/user.entity'
import {USER_REPOSITORY} from '../../domain/tokens'

export interface SearchUsersRequest {
    page: number
    limit: number
    filter?: string
    sort?: string
    sortDirection?: 'asc'|'desc'
}

export interface SearchUsersResponse {
    users: User[]
    total: number
    currentPage: number
    limit: number
    totalPages: number
    lastPage: number
}

@Injectable()
export class SearchUsersUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(request: SearchUsersRequest): Promise<SearchUsersResponse> {
        const searchParams: SearchParams={
            page: request.page,
            limit: request.limit,
            filter: request.filter,
            sort: request.sort,
            sortDirection: request.sortDirection
        }

        const result=await this.userRepository.search(searchParams)

        return {
            users: result.items,
            total: result.total,
            currentPage: result.currentPage,
            limit: result.limit,
            totalPages: result.totalPages,
            lastPage: result.lastPage
        }
    }
}
