import {InvalidTransactionDescriptionException} from '../exceptions/transaction-domain.exception'

export class TransactionDescription {
    private readonly value: string

    constructor(description: string) {
        const raw=typeof description==='string'? description:''
        const trimmed=raw.trim()

        if(trimmed.length<2||trimmed.length>255) {
            throw new InvalidTransactionDescriptionException(raw)
        }

        this.value=trimmed
    }

    getValue(): string {
        return this.value
    }

    equals(other: TransactionDescription): boolean {
        return this.value===other.value
    }

    toString(): string {
        return this.value
    }
}
