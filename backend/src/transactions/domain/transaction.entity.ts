/**
 * 💰 Transaction Entity
 *
 * Representa uma transação financeira no sistema SmartEconomy.
 * Implementa os padrões DDD com regras de negócio específicas
 * para movimentação financeira entre contas.
 */

import {
    InvalidTransferException,
    TransactionStatusException
} from './exceptions/transaction-domain.exception'
import {TransactionAmount} from './value-objects/transaction-amount.vo'
import {TransactionDescription} from './value-objects/transaction-description.vo'

export enum TransactionType {
    INCOME='INCOME',       // Receita
    EXPENSE='EXPENSE',     // Despesa
    TRANSFER='TRANSFER'    // Transferência entre contas
}

export enum TransactionStatus {
    PENDING='PENDING',     // Pendente
    COMPLETED='COMPLETED', // Concluída
    CANCELLED='CANCELLED', // Cancelada
    FAILED='FAILED'        // Falhou
}

export class Transaction {
    private readonly _id: string
    private _description: TransactionDescription
    private readonly _amount: TransactionAmount
    private readonly _type: TransactionType
    private _status: TransactionStatus
    private readonly _accountId: string
    private readonly _categoryId?: string
    private readonly _destinationAccountId?: string // Para transferências
    private readonly _date: Date
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: {
        id?: string
        description: string
        amount: number
        type: TransactionType
        accountId: string
        categoryId?: string
        destinationAccountId?: string
        date?: Date
        status?: TransactionStatus
        createdAt?: Date
        updatedAt?: Date
    }) {
        this._id=props.id||this.generateId()
        this._description=new TransactionDescription(props.description)
        this._amount=new TransactionAmount(props.amount)
        this._type=props.type
        this._accountId=props.accountId
        this._categoryId=props.categoryId
        this._destinationAccountId=props.destinationAccountId?.trim()||undefined
        this._date=props.date||new Date()
        this._status=props.status||TransactionStatus.PENDING
        this._createdAt=props.createdAt||new Date()
        this._updatedAt=props.updatedAt||new Date()

        this.validateTransfer()
    }

    private validateTransfer(): void {
        if(this._type===TransactionType.TRANSFER) {
            const destinationId=this._destinationAccountId?.trim()

            if(!destinationId) {
                throw new InvalidTransferException('Transferência deve ter conta de destino especificada')
            }

            if(this._accountId===destinationId) {
                throw new InvalidTransferException('Conta de origem e destino não podem ser iguais')
            }

            return
        }

        if(this._destinationAccountId) {
            throw new InvalidTransferException('Apenas transferências podem ter conta de destino')
        }
    }

    private generateId(): string {
        return 'txn_'+Date.now()+'_'+Math.random().toString(36).slice(2,11)
    }

    // Getters
    get id(): string {return this._id}
    get description(): string {return this._description.getValue()}
    get amount(): number {return this._amount.getValue()}
    get type(): TransactionType {return this._type}
    get status(): TransactionStatus {return this._status}
    get accountId(): string {return this._accountId}
    get categoryId(): string|undefined {return this._categoryId}
    get destinationAccountId(): string|undefined {return this._destinationAccountId}
    get date(): Date {return this._date}
    get createdAt(): Date {return this._createdAt}
    get updatedAt(): Date {return this._updatedAt}

    // Computed properties
    get isExpense(): boolean {
        return this._type===TransactionType.EXPENSE
    }

    get isIncome(): boolean {
        return this._type===TransactionType.INCOME
    }

    get isTransfer(): boolean {
        return this._type===TransactionType.TRANSFER
    }

    get isPending(): boolean {
        return this._status===TransactionStatus.PENDING
    }

    get isCompleted(): boolean {
        return this._status===TransactionStatus.COMPLETED
    }

    get isCancelled(): boolean {
        return this._status===TransactionStatus.CANCELLED
    }

    get isFailed(): boolean {
        return this._status===TransactionStatus.FAILED
    }

    // Business logic methods
    canBeCompleted(): boolean {
        return this._status===TransactionStatus.PENDING
    }

    canBeCancelled(): boolean {
        return this._status===TransactionStatus.PENDING||this._status===TransactionStatus.FAILED
    }

    canBeReversed(): boolean {
        return this._status===TransactionStatus.COMPLETED&&
            this.daysSinceCreation()<=30 // Permitir reversão até 30 dias
    }

    private daysSinceCreation(): number {
        const now=new Date()
        const diffTime=Math.abs(now.getTime()-this._createdAt.getTime())
        return Math.ceil(diffTime/(1000*60*60*24))
    }

    private ensureStatus(allowedStatuses: TransactionStatus[],action: string): void {
        if(!allowedStatuses.includes(this._status)) {
            throw new TransactionStatusException(this._status,action)
        }
    }

    private touch(): void {
        this._updatedAt=new Date()
    }

    // Domain methods
    complete(): void {
        this.ensureStatus([TransactionStatus.PENDING],'concluir')
        this._status=TransactionStatus.COMPLETED
        this.touch()
    }

    cancel(): void {
        this.ensureStatus([TransactionStatus.PENDING,TransactionStatus.FAILED],'cancelar')
        this._status=TransactionStatus.CANCELLED
        this.touch()
    }

    fail(_reason?: string): void {
        this.ensureStatus([TransactionStatus.PENDING],'marcar como falha')
        this._status=TransactionStatus.FAILED
        this.touch()
    }

    updateDescription(newDescription: string): void {
        this.ensureStatus([TransactionStatus.PENDING],'alterar a descrição')
        this._description=new TransactionDescription(newDescription)
        this.touch()
    }

    // Factory methods
    static createIncome(props: {
        description: string
        amount: number
        accountId: string
        categoryId: string
        date?: Date
    }): Transaction {
        return new Transaction({
            ...props,
            type: TransactionType.INCOME
        })
    }

    static createExpense(props: {
        description: string
        amount: number
        accountId: string
        categoryId: string
        date?: Date
    }): Transaction {
        return new Transaction({
            ...props,
            type: TransactionType.EXPENSE
        })
    }

    static createTransfer(props: {
        description: string
        amount: number
        accountId: string
        destinationAccountId: string
        categoryId: string
        date?: Date
    }): Transaction {
        return new Transaction({
            ...props,
            type: TransactionType.TRANSFER
        })
    }

    // Reconstitute from persistence
    static reconstitute(data: any): Transaction {
        return new Transaction({
            id: data.id,
            description: data.description,
            amount: data.amount,
            type: data.type as TransactionType,
            accountId: data.accountId,
            categoryId: data.categoryId,
            destinationAccountId: data.destinationAccountId,
            date: data.date,
            status: data.status as TransactionStatus,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        })
    }

    // Convert to persistence format
    toPrisma() {
        return {
            id: this.id,
            description: this.description,
            amount: this.amount,
            type: this.type,
            accountId: this.accountId,
            categoryId: this.categoryId,
            destinationAccountId: this.destinationAccountId,
            date: this.date,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}
