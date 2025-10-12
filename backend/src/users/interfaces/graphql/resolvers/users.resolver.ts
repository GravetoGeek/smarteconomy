import {LoggerService} from '@/shared/services/logger.service'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {UsersApplicationService} from '../../../application/services/users-application.service'
import {UserRole} from '../../../domain/user.entity'
import {CreateUserInput} from '../inputs/create-user.input'
import {SearchUsersInput} from '../inputs/search-users.input'
import {UpdateUserInput} from '../inputs/update-user.input'
import {DeleteUserResponse} from '../models/delete-user-response.model'
import {SearchResult} from '../models/search-result.model'
import {UpdateUserResponse} from '../models/update-user-response.model'
import {User} from '../models/User'

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersApplicationService: UsersApplicationService,
        private readonly loggerService: LoggerService
    ) {}
    // TODO: Aplicar AuthGuard e RBAC quando os guards JWT estiverem implementados no módulo auth

    @Query(() => [User])
    async users(): Promise<User[]> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_START',null,'UsersResolver')
            const result=await this.usersApplicationService.searchUsers({page: 1,limit: 100})
            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_SUCCESS',{count: result.users.length},'UsersResolver')
            return result.users
        } catch(error) {
            this.loggerService.logError('GRAPHQL_GET_ALL_USERS_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Query(() => User,{nullable: true})
    async userById(@Args('id') id: string): Promise<User|null> {
        this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_START',{id},'UsersResolver')
        const user=await this.usersApplicationService.findUserById(id)

        if(user) {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
        } else {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_NOT_FOUND',{id},'UsersResolver')
        }

        return user  // ✅ Retorna null se não encontrar (não é erro)
    }

    @Query(() => User,{nullable: true})
    async userByEmail(@Args('email') email: string): Promise<User|null> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_START',{email},'UsersResolver')
            const user=await this.usersApplicationService.findUserByEmail(email)

            if(user) {
                this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
            } else {
                this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_NOT_FOUND',{email},'UsersResolver')
            }

            return user
        } catch(error) {
            this.loggerService.logError('GRAPHQL_GET_USER_BY_EMAIL_ERROR',error,'UsersResolver')
            return null
        }
    }

    @Query(() => SearchResult)
    async searchUsers(@Args('input') input: SearchUsersInput): Promise<SearchResult> {
        try {
            this.loggerService.logOperation('GRAPHQL_SEARCH_USERS_START',input,'UsersResolver')
            const result=await this.usersApplicationService.searchUsers(input)
            this.loggerService.logOperation('GRAPHQL_SEARCH_USERS_SUCCESS',{
                total: result.total,
                currentPage: result.currentPage
            },'UsersResolver')
            return {
                items: result.users,
                total: result.total,
                currentPage: result.currentPage,
                limit: result.limit,
                totalPages: result.totalPages,
                lastPage: result.lastPage
            }
        } catch(error) {
            this.loggerService.logError('GRAPHQL_SEARCH_USERS_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Mutation(() => User)
    async createUser(@Args('input') input: CreateUserInput): Promise<User> {
        try {
            this.loggerService.logOperation('GRAPHQL_CREATE_USER_START',{email: input.email},'UsersResolver')

            const user=await this.usersApplicationService.createUser({
                email: input.email,
                name: input.name,
                lastname: input.lastname,
                birthdate: input.birthdate,
                role: input.role as UserRole,
                genderId: input.genderId,
                professionId: input.professionId,
                password: input.password
            })

            this.loggerService.logOperation('GRAPHQL_CREATE_USER_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
            return user
        } catch(error) {
            this.loggerService.logError('GRAPHQL_CREATE_USER_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Mutation(() => UpdateUserResponse)
    async updateUser(@Args('id') id: string,@Args('input') input: UpdateUserInput): Promise<UpdateUserResponse> {
        try {
            this.loggerService.logOperation('GRAPHQL_UPDATE_USER_START',{id,input},'UsersResolver')
            const user=await this.usersApplicationService.updateUser(id,input)

            if(user) {
                this.loggerService.logOperation('GRAPHQL_UPDATE_USER_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
                return {user,success: true,message: 'User updated successfully'}
            } else {
                this.loggerService.logOperation('GRAPHQL_UPDATE_USER_NOT_FOUND',{id},'UsersResolver')
                return {user: null,success: false,message: 'User not found'}
            }
        } catch(error) {
            this.loggerService.logError('GRAPHQL_UPDATE_USER_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Mutation(() => DeleteUserResponse)
    async deleteUser(@Args('id') id: string): Promise<DeleteUserResponse> {
        try {
            this.loggerService.logOperation('GRAPHQL_DELETE_USER_START',{id},'UsersResolver')
            const success=await this.usersApplicationService.deleteUser(id)

            if(success) {
                this.loggerService.logOperation('GRAPHQL_DELETE_USER_SUCCESS',{id},'UsersResolver')
            } else {
                this.loggerService.logOperation('GRAPHQL_DELETE_USER_NOT_FOUND',{id},'UsersResolver')
            }

            return {success,message: success? 'User deleted successfully':'User not found'}
        } catch(error) {
            this.loggerService.logError('GRAPHQL_DELETE_USER_ERROR',error,'UsersResolver')
            throw error
        }
    }
}
