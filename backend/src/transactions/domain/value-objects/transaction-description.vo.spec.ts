import {InvalidTransactionDescriptionException} from '../exceptions/transaction-domain.exception'
import {TransactionDescription} from './transaction-description.vo'

describe('TransactionDescription',() => {
    it('deve normalizar espaços em branco',() => {
        const description=new TransactionDescription('  Compra de mercado  ')
        expect(description.getValue()).toBe('Compra de mercado')
    })

    it('deve aceitar descrições com tamanho válido',() => {
        const text='Pagamento de salário'
        const description=new TransactionDescription(text)
        expect(description.toString()).toBe(text)
    })

    it('deve rejeitar descrições curtas',() => {
        expect(() => new TransactionDescription('a')).toThrow(InvalidTransactionDescriptionException)
    })

    it('deve rejeitar descrições vazias',() => {
        expect(() => new TransactionDescription('   ')).toThrow(InvalidTransactionDescriptionException)
    })

    it('deve rejeitar descrições muito longas',() => {
        const longText='x'.repeat(256)
        expect(() => new TransactionDescription(longText)).toThrow(InvalidTransactionDescriptionException)
    })
})
