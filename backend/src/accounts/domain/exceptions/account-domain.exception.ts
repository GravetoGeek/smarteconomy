/**
 * ⚠️ Account Domain Exceptions
 *
 * Exceções específicas do domínio de contas
 */

export class AccountDomainException extends Error {
    constructor(message: string) {
        super(message)
        this.name='AccountDomainException'
    }
}

export class AccountNotFoundException extends AccountDomainException {
    constructor(accountId: string) {
        super(`Conta não encontrada: ${accountId}`)
        this.name='AccountNotFoundException'
    }
}

export class InsufficientBalanceException extends AccountDomainException {
    constructor(accountId: string,balance: number,requiredAmount: number) {
        super(
            `Saldo insuficiente na conta ${accountId}. `+
            `Saldo atual: R$ ${balance.toFixed(2)}, `+
            `Valor necessário: R$ ${requiredAmount.toFixed(2)}`
        )
        this.name='InsufficientBalanceException'
    }
}

export class InvalidAmountException extends AccountDomainException {
    constructor(amount: number) {
        super(`Valor inválido: ${amount}. O valor deve ser positivo.`)
        this.name='InvalidAmountException'
    }
}

export class AccountInactiveException extends AccountDomainException {
    constructor(accountId: string) {
        super(`Conta inativa: ${accountId}. Apenas consultas são permitidas.`)
        this.name='AccountInactiveException'
    }
}
