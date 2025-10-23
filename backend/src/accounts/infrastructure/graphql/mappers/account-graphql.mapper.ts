import {Account} from '../../../domain/account.entity'
import {AccountModel} from '../../dtos/models/account.model'

export class AccountGraphQLMapper {
    static toModel(account: Account): AccountModel {
        return {
            id: account.id,
            name: account.name,
            type: account.type,
            balance: account.balance,
            userId: account.userId,
            status: account.status,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        }
    }

    static toModelList(accounts: Account[]): AccountModel[] {
        return accounts.map(account => this.toModel(account))
    }
}
