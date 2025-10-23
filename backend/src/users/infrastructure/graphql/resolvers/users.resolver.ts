import {LoggerService} from '@/shared/services/logger.service'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {UsersApplicationService} from '../../../application/services/users-application.service'
import {UserRole} from '../../../domain/user.entity'
import {CreateUserInput} from '../../dtos/inputs/create-user.input'
import {SearchUsersInput} from '../../dtos/inputs/search-users.input'
import {UpdateUserInput} from '../../dtos/inputs/update-user.input'
import {DeleteUserResponseModel} from '../../dtos/models/delete-user-response.model'
import {UpdateUserResponseModel} from '../../dtos/models/update-user-response.model'
import {UserSearchResultModel} from '../../dtos/models/user-search-result.model'
import {UserModel} from '../../dtos/models/user.model'
import {UserGraphQLMapper} from '../mappers/user-graphql.mapper'

@Resolver(() => UserModel)
export class UsersResolver {
    constructor(
        private readonly usersApplicationService: UsersApplicationService,
        private readonly loggerService: LoggerService
    ) {}
    // TODO: Aplicar AuthGuard e RBAC quando os guards JWT estiverem implementados no módulo auth

    @Query(() => [UserModel])
    async users(): Promise<UserModel[]> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_START',null,'UsersResolver')
            const result=await this.usersApplicationService.searchUsers({page: 1,limit: 100})
            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_SUCCESS',{count: result.users.length},'UsersResolver')
            return UserGraphQLMapper.toModelList(result.users)
        } catch(error) {
            this.loggerService.logError('GRAPHQL_GET_ALL_USERS_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Query(() => UserModel,{nullable: true})
    async userById(@Args('id') id: string): Promise<UserModel|null> {
        this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_START',{id},'UsersResolver')
        const user=await this.usersApplicationService.findUserById(id)

        if(user) {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
            return UserGraphQLMapper.toModel(user)
        } else {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_NOT_FOUND',{id},'UsersResolver')
            return null
        }
    }

    @Query(() => UserModel,{nullable: true})
    async userByEmail(@Args('email') email: string): Promise<UserModel|null> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_START',{email},'UsersResolver')
            const user=await this.usersApplicationService.findUserByEmail(email)

            if(user) {
                this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
                return UserGraphQLMapper.toModel(user)
            } else {
                this.loggerService.logOperation('GRAPHQL_GET_USER_BY_EMAIL_NOT_FOUND',{email},'UsersResolver')
                return null
            }
        } catch(error) {
            this.loggerService.logError('GRAPHQL_GET_USER_BY_EMAIL_ERROR',error,'UsersResolver')
            return null
        }
    }

    @Query(() => UserSearchResultModel)
    async searchUsers(@Args('input') input: SearchUsersInput): Promise<UserSearchResultModel> {
        try {
            this.loggerService.logOperation('GRAPHQL_SEARCH_USERS_START',input,'UsersResolver')
            const result=await this.usersApplicationService.searchUsers(input)
            this.loggerService.logOperation('GRAPHQL_SEARCH_USERS_SUCCESS',{
                total: result.total,
                currentPage: result.currentPage
            },'UsersResolver')
            return {
                items: UserGraphQLMapper.toModelList(result.users),
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

    @Mutation(() => UserModel)
    async createUser(@Args('input') input: CreateUserInput): Promise<UserModel> {
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
            return UserGraphQLMapper.toModel(user)
        } catch(error) {
            this.loggerService.logError('GRAPHQL_CREATE_USER_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Mutation(() => UpdateUserResponseModel)
    async updateUser(@Args('id') id: string,@Args('input') input: UpdateUserInput): Promise<UpdateUserResponseModel> {
        try {
            this.loggerService.logOperation('GRAPHQL_UPDATE_USER_START',{id,input},'UsersResolver')
            const user=await this.usersApplicationService.updateUser(id,input)

            if(user) {
                this.loggerService.logOperation('GRAPHQL_UPDATE_USER_SUCCESS',{id: user.id,email: user.email},'UsersResolver')
                return {user: UserGraphQLMapper.toModel(user),success: true,message: 'User updated successfully'}
            } else {
                this.loggerService.logOperation('GRAPHQL_UPDATE_USER_NOT_FOUND',{id},'UsersResolver')
                return {user: null,success: false,message: 'User not found'}
            }
        } catch(error) {
            this.loggerService.logError('GRAPHQL_UPDATE_USER_ERROR',error,'UsersResolver')
            throw error
        }
    }

    @Mutation(() => DeleteUserResponseModel)
    async deleteUser(@Args('id') id: string): Promise<DeleteUserResponseModel> {
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
