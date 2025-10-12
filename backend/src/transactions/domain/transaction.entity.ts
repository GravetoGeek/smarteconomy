/**
 * 💰 Transaction Entity
 *
 * Representa uma transação financeira no sistema SmartEconomy.
 * Implementa os padrões DDD com regras de negócio específicas
 * para movimentação financeira entre contas.
 */

export enum TransactionType {
    INCOME = 'INCOME',       // Receita
    EXPENSE = 'EXPENSE',     // Despesa
    TRANSFER = 'TRANSFER'    // Transferência entre contas
}

export enum TransactionStatus {
    PENDING = 'PENDING',     // Pendente
    COMPLETED = 'COMPLETED', // Concluída
    CANCELLED = 'CANCELLED', // Cancelada
    FAILED = 'FAILED'        // Falhou
}

export class Transaction {
    private readonly _id: string
    private _description: string
    private readonly _amount: number
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
        this._id = props.id || this.generateId()
        this._description = this.validateDescription(props.description)
        this._amount = this.validateAmount(props.amount)
        this._type = props.type
        this._accountId = props.accountId
        this._categoryId = props.categoryId
        this._destinationAccountId = props.destinationAccountId
        this._date = props.date || new Date()
        this._status = props.status || TransactionStatus.PENDING
        this._createdAt = props.createdAt || new Date()
        this._updatedAt = props.updatedAt || new Date()

        this.validateTransfer()
    }

    private validateDescription(description: string): string {
        if (!description || description.trim().length < 2) {
            throw new Error('Descrição da transação deve ter pelo menos 2 caracteres')
        }
        if (description.trim().length > 255) {
            throw new Error('Descrição da transação não pode exceder 255 caracteres')
        }
        return description.trim()
    }

    private validateAmount(amount: number): number {
        if (amount <= 0) {
            throw new Error('Valor da transação deve ser positivo')
        }
        if (amount > 999999.99) {
            throw new Error('Valor da transação excede o limite máximo')
        }
        return Math.round(amount * 100) / 100 // Garantir 2 casas decimais
    }

    private validateTransfer(): void {
        if (this._type === TransactionType.TRANSFER && !this._destinationAccountId) {
            throw new Error('Transferência deve ter conta de destino especificada')
        }
        if (this._type !== TransactionType.TRANSFER && this._destinationAccountId) {
            throw new Error('Apenas transferências podem ter conta de destino')
        }
        if (this._type === TransactionType.TRANSFER && this._accountId === this._destinationAccountId) {
            throw new Error('Conta de origem e destino não podem ser iguais')
        }
    }

    private generateId(): string {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11)
    }

    // Getters
    get id(): string { return this._id }
    get description(): string { return this._description }
    get amount(): number { return this._amount }
    get type(): TransactionType { return this._type }
    get status(): TransactionStatus { return this._status }
    get accountId(): string { return this._accountId }
    get categoryId(): string | undefined { return this._categoryId }
    get destinationAccountId(): string | undefined { return this._destinationAccountId }
    get date(): Date { return this._date }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }

    // Computed properties
    get isExpense(): boolean {
        return this._type === TransactionType.EXPENSE
    }

    get isIncome(): boolean {
        return this._type === TransactionType.INCOME
    }

    get isTransfer(): boolean {
        return this._type === TransactionType.TRANSFER
    }

    get isPending(): boolean {
        return this._status === TransactionStatus.PENDING
    }

    get isCompleted(): boolean {
        return this._status === TransactionStatus.COMPLETED
    }

    get isCancelled(): boolean {
        return this._status === TransactionStatus.CANCELLED
    }

    get isFailed(): boolean {
        return this._status === TransactionStatus.FAILED
    }

    // Business logic methods
    canBeCompleted(): boolean {
        return this._status === TransactionStatus.PENDING
    }

    canBeCancelled(): boolean {
        return this._status === TransactionStatus.PENDING || this._status === TransactionStatus.FAILED
    }

    canBeReversed(): boolean {
        return this._status === TransactionStatus.COMPLETED &&
            this.daysSinceCreation() <= 30 // Permitir reversão até 30 dias
    }

    private daysSinceCreation(): number {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - this._createdAt.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Domain methods
    complete(): void {
        if (!this.canBeCompleted()) {
            throw new Error('Transação não pode ser concluída no estado atual')
        }
        this._status = TransactionStatus.COMPLETED
        this._updatedAt = new Date()
    }

    cancel(): void {
        if (!this.canBeCancelled()) {
            throw new Error('Transação não pode ser cancelada no estado atual')
        }
        this._status = TransactionStatus.CANCELLED
        this._updatedAt = new Date()
    }

    fail(reason?: string): void {
        if (this._status !== TransactionStatus.PENDING) {
            throw new Error('Apenas transações pendentes podem falhar')
        }
        this._status = TransactionStatus.FAILED
        this._updatedAt = new Date()
        // Aqui poderia ser adicionado um campo para armazenar o motivo da falha
    }

    updateDescription(newDescription: string): void {
        if (this._status !== TransactionStatus.PENDING) {
            throw new Error('Apenas transações pendentes podem ter descrição alterada')
        }
        this._description = this.validateDescription(newDescription)
        this._updatedAt = new Date()
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
