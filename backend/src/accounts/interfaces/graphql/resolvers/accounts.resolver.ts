import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { AccountsApplicationService } from '../../../application/services/accounts-application.service'
import { CreateAccountInput } from '../inputs/create-account.input'
import { Account } from '../models/account.model'
import { LoggerService } from '@/shared/services/logger.service'

@Resolver(() => Account)
export class AccountsResolver {
    constructor(
        private readonly accountsService: AccountsApplicationService,
        private readonly logger: LoggerService
    ) { }

    @Query(() => [Account])
    async accountsByUser(@Args('userId') userId: string) {
        this.logger.logOperation('GRAPHQL_GET_ACCOUNTS_BY_USER_START', { userId }, 'AccountsResolver')
        const accounts = await this.accountsService.findAccountsByUser(userId)
        this.logger.logOperation('GRAPHQL_GET_ACCOUNTS_BY_USER_SUCCESS', { count: accounts.length }, 'AccountsResolver')
        return accounts
    }

    @Query(() => Account, { nullable: true })
    async accountById(@Args('id') id: string) {
        this.logger.logOperation('GRAPHQL_GET_ACCOUNT_BY_ID_START', { id }, 'AccountsResolver')
        const acc = await this.accountsService.findAccountById(id)
        if (acc) this.logger.logOperation('GRAPHQL_GET_ACCOUNT_BY_ID_SUCCESS', { id: acc.id }, 'AccountsResolver')
        else this.logger.logOperation('GRAPHQL_GET_ACCOUNT_BY_ID_NOT_FOUND', { id }, 'AccountsResolver')
        return acc
    }

    @Mutation(() => Account)
    async createAccount(@Args('input') input: CreateAccountInput) {
        this.logger.logOperation('GRAPHQL_CREATE_ACCOUNT_START', input, 'AccountsResolver')
        const result = await this.accountsService.createAccount({
            name: input.name,
            type: input.type as any, // Will be fixed with proper GraphQL enum
            balance: input.balance,
            userId: input.userId
        })
        this.logger.logOperation('GRAPHQL_CREATE_ACCOUNT_SUCCESS', { id: result.id }, 'AccountsResolver')
        return result
    }
}
