/**
 * ↩️ Reverse Transaction Use Case
 *
 * Caso de uso para reversão de transações
 * com validações e auditoria.
 */

import { Injectable } from '@nestjs/common'
import {
    TransactionRepositoryPort,
    TransactionDomainService,
    Transaction,
    TransactionNotFoundException
} from '../../domain'

export interface ReverseTransactionUseCaseInput {
    transactionId: string
    reason: string
    requestedBy: string // ID do usuário que solicitou a reversão
}

export interface ReverseTransactionUseCaseOutput {
    originalTransaction: Transaction
    reversalTransaction: Transaction
    success: boolean
    message: string
}

@Injectable()
export class ReverseTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepositoryPort,
        private readonly transactionDomainService: TransactionDomainService,
        private readonly auditService: any // Será injetado para auditoria
    ) { }

    async execute(input: ReverseTransactionUseCaseInput): Promise<ReverseTransactionUseCaseOutput> {
        // 1. Validar entrada
        this.validateInput(input)

        // 2. Buscar transação original
        const originalTransaction = await this.transactionRepository.findById(input.transactionId)
        if (!originalTransaction) {
            throw new TransactionNotFoundException(input.transactionId)
        }

        // 3. Validar se pode ser revertida
        if (!originalTransaction.canBeReversed()) {
            throw new Error('Transação não pode ser revertida')
        }

        // 4. Executar reversão através do domain service
        const reversalTransaction = await this.transactionDomainService.reverseTransaction(
            input.transactionId,
            input.reason
        )

        // 5. Registrar auditoria
        await this.registerAuditLog(originalTransaction, reversalTransaction, input)

        return {
            originalTransaction,
            reversalTransaction,
            success: true,
            message: 'Transação revertida com sucesso'
        }
    }

    private validateInput(input: ReverseTransactionUseCaseInput): void {
        if (!input.transactionId) {
            throw new Error('ID da transação é obrigatório')
        }

        if (!input.reason || input.reason.trim().length < 10) {
            throw new Error('Motivo da reversão deve ter pelo menos 10 caracteres')
        }

        if (!input.requestedBy) {
            throw new Error('Usuário responsável pela reversão é obrigatório')
        }
    }

    private async registerAuditLog(
        original: Transaction,
        reversal: Transaction,
        input: ReverseTransactionUseCaseInput
    ): Promise<void> {
        const auditData = {
            action: 'TRANSACTION_REVERSAL',
            entityId: original.id,
            entityType: 'TRANSACTION',
            details: {
                originalTransactionId: original.id,
                reversalTransactionId: reversal.id,
                reason: input.reason,
                originalAmount: original.amount,
                originalDescription: original.description
            },
            performedBy: input.requestedBy,
            timestamp: new Date()
        }

        // Implementar chamada para serviço de auditoria
        // await this.auditService.log(auditData)
    }
}
