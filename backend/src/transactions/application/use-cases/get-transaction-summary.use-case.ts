/**
 * 📊 Get Transaction Summary Use Case
 *
 * Caso de uso para obter resumo financeiro
 * de transações por período.
 */

import { Injectable } from '@nestjs/common'
import {
    TransactionRepositoryPort,
    TransactionSummary
} from '../../domain'

export interface GetTransactionSummaryUseCaseInput {
    accountId: string
    dateFrom: Date
    dateTo: Date
}

@Injectable()
export class GetTransactionSummaryUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepositoryPort
    ) { }

    async execute(input: GetTransactionSummaryUseCaseInput): Promise<TransactionSummary> {
        // Validar parâmetros
        this.validateInput(input)

        // Obter resumo do repositório
        return await this.transactionRepository.getSummary(
            input.accountId,
            input.dateFrom,
            input.dateTo
        )
    }

    private validateInput(input: GetTransactionSummaryUseCaseInput): void {
        if (!input.accountId) {
            throw new Error('ID da conta é obrigatório')
        }

        if (!input.dateFrom || !input.dateTo) {
            throw new Error('Período (data inicial e final) é obrigatório')
        }

        if (input.dateFrom > input.dateTo) {
            throw new Error('Data inicial deve ser anterior à data final')
        }

        // Validar período máximo (1 ano)
        const oneYear = 365 * 24 * 60 * 60 * 1000
        if (input.dateTo.getTime() - input.dateFrom.getTime() > oneYear) {
            throw new Error('Período máximo permitido é de 1 ano')
        }
    }
}
