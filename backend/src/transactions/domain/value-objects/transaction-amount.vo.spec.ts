import {InvalidTransactionAmountException} from '../exceptions/transaction-domain.exception'
import {TransactionAmount} from './transaction-amount.vo'

describe('TransactionAmount',() => {
    it('deve arredondar para duas casas decimais',() => {
        const amount=new TransactionAmount(123.456)
        expect(amount.getValue()).toBe(123.46)
    })

    it('deve aceitar valores positivos dentro do limite',() => {
        const amount=new TransactionAmount(999999.99)
        expect(amount.getValue()).toBe(999999.99)
    })

    it('deve rejeitar valores negativos',() => {
        expect(() => new TransactionAmount(-10)).toThrow(InvalidTransactionAmountException)
    })

    it('deve rejeitar zero',() => {
        expect(() => new TransactionAmount(0)).toThrow(InvalidTransactionAmountException)
    })

    it('deve rejeitar valores acima do limite',() => {
        expect(() => new TransactionAmount(1000000)).toThrow(InvalidTransactionAmountException)
    })

    it('deve rejeitar valores não numéricos',() => {
        expect(() => new TransactionAmount(Number.NaN)).toThrow(InvalidTransactionAmountException)
    })
})
