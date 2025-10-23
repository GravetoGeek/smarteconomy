/**
 * 🚨 Transaction Domain Exceptions
 *
 * Define exceções específicas do domínio de transações
 * para tratamento de erros de negócio.
 */

export class TransactionDomainException extends Error {
    constructor(message: string) {
        super(message)
        this.name='TransactionDomainException'
    }
}

export class InvalidTransactionAmountException extends TransactionDomainException {
    constructor(amount: number) {
        super(`Valor da transação inválido: ${amount}. Deve ser positivo e até R$ 999.999,99`)
        this.name='InvalidTransactionAmountException'
    }
}

export class InvalidTransactionDescriptionException extends TransactionDomainException {
    constructor(description: string) {
        super(`Descrição da transação inválida: "${description}". Deve ter entre 2 e 255 caracteres`)
        this.name='InvalidTransactionDescriptionException'
    }
}

export class InvalidTransferException extends TransactionDomainException {
    constructor(reason: string) {
        super(`Transferência inválida: ${reason}`)
        this.name='InvalidTransferException'
    }
}

export class TransactionStatusException extends TransactionDomainException {
    constructor(currentStatus: string,attemptedAction: string) {
        super(`Não é possível ${attemptedAction} uma transação com status ${currentStatus}`)
        this.name='TransactionStatusException'
    }
}

export class MissingTransactionCategoryException extends TransactionDomainException {
    constructor() {
        super('Toda transação deve ter uma categoria')
        this.name='MissingTransactionCategoryException'
    }
}

export class MissingDestinationAccountException extends TransactionDomainException {
    constructor() {
        super('Conta de destino é obrigatória para transferências')
        this.name='MissingDestinationAccountException'
    }
}

export class MissingDestinationBalanceException extends TransactionDomainException {
    constructor() {
        super('Saldo da conta de destino é obrigatório para transferências')
        this.name='MissingDestinationBalanceException'
    }
}

export class DuplicateTransactionException extends TransactionDomainException {
    constructor() {
        super('Transação duplicada detectada')
        this.name='DuplicateTransactionException'
    }
}

export class TransactionNotFoundException extends TransactionDomainException {
    constructor(id: string) {
        super(`Transação não encontrada: ${id}`)
        this.name='TransactionNotFoundException'
    }
}

export class InsufficientBalanceException extends TransactionDomainException {
    constructor(currentBalance: number,requestedAmount: number) {
        super(`Saldo insuficiente. Saldo atual: R$ ${currentBalance.toFixed(2)}, Valor solicitado: R$ ${requestedAmount.toFixed(2)}`)
        this.name='InsufficientBalanceException'
    }
}

export class TransactionLimitExceededException extends TransactionDomainException {
    constructor(limit: number,attemptedAmount: number) {
        super(`Limite de transação excedido. Limite: R$ ${limit.toFixed(2)}, Tentativa: R$ ${attemptedAmount.toFixed(2)}`)
        this.name='TransactionLimitExceededException'
    }
}
