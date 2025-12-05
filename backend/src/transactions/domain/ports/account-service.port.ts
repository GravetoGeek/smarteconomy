import {AccountBalance} from '../index'

export interface AccountServicePort {
    getAccountBalance(accountId: string): Promise<AccountBalance>
    updateAccountBalance(accountId: string,amount: number,operation: 'CREDIT'|'DEBIT'): Promise<void>
    transfer(fromAccountId: string,toAccountId: string,amount: number): Promise<void>
}
