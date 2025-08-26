/**
 * 🔄 Update Transaction Use Case
 * 
 * Caso de uso para atualização de transações
 * com validações de negócio.
 */

import { Injectable } from '@nestjs/common'
import {
    TransactionRepositoryPort,
    Transaction,
    TransactionNotFoundException,
    TransactionStatusException
} from '../../domain'

export interface UpdateTransactionUseCaseInput {
    id: string
    description?: string
    status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
}

@Injectable()
export class UpdateTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepositoryPort
    ) { }

    async execute(input: UpdateTransactionUseCaseInput): Promise<Transaction> {
        // 1. Buscar transação existente
        const transaction = await this.transactionRepository.findById(input.id)
        if (!transaction) {
            throw new TransactionNotFoundException(input.id)
        }

        // 2. Aplicar atualizações permitidas
        if (input.description !== undefined) {
            this.updateDescription(transaction, input.description)
        }

        if (input.status !== undefined) {
            this.updateStatus(transaction, input.status)
        }

        // 3. Salvar atualizações
        return await this.transactionRepository.update(transaction)
    }

    private updateDescription(transaction: Transaction, newDescription: string): void {
        try {
            transaction.updateDescription(newDescription)
        } catch (error) {
            throw new Error(`Erro ao atualizar descrição: ${error.message}`)
        }
    }

    private updateStatus(transaction: Transaction, newStatus: string): void {
        try {
            switch (newStatus) {
                case 'COMPLETED':
                    transaction.complete()
                    break
                case 'CANCELLED':
                    transaction.cancel()
                    break
                case 'FAILED':
                    transaction.fail()
                    break
                default:
                    throw new Error(`Status inválido: ${newStatus}`)
            }
        } catch (error) {
            throw new TransactionStatusException(transaction.status, `alterar para ${newStatus}`)
        }
    }
}
