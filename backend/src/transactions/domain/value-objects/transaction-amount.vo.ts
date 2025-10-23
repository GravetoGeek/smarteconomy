import {InvalidTransactionAmountException} from '../exceptions/transaction-domain.exception'

const MAX_TRANSACTION_AMOUNT=999999.99

export class TransactionAmount {
    private readonly value: number

    constructor(amount: number) {
        if(typeof amount!=='number'||!Number.isFinite(amount)) {
            throw new InvalidTransactionAmountException(amount)
        }

        if(amount<=0||amount>MAX_TRANSACTION_AMOUNT) {
            throw new InvalidTransactionAmountException(amount)
        }

        this.value=Math.round(amount*100)/100
    }

    getValue(): number {
        return this.value
    }

    equals(other: TransactionAmount): boolean {
        return this.value===other.value
    }

    toNumber(): number {
        return this.value
    }
}
