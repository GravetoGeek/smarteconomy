/**
 * 🧪 Integration Test: Transaction → Account Balance Update
 *
 * Testa o fluxo completo de criação de transação e atualização de saldo
 */

import {AccountBalanceService} from '@/accounts/application/services/account-balance.service'
import {CreateTransactionUseCase} from '@/transactions/application/use-cases/create-transaction.use-case'
import {TransactionDomainService} from '@/transactions/domain/services/transaction-domain.service'
import {AccountIntegrationServiceImpl} from '@/transactions/infrastructure/services/account-integration.service'
import {Test,TestingModule} from '@nestjs/testing'

import {PrismaService} from '../../database/prisma/prisma.service'
import {TestDatabaseUtils,TestDataFactory,TestModuleBuilder} from '../utils/test-helpers'

describe('Transaction → Account Integration',() => {
    let accountBalanceService: AccountBalanceService
    let createTransactionUseCase: CreateTransactionUseCase
    let accountIntegrationService: AccountIntegrationServiceImpl
    let transactionDomainService: TransactionDomainService
    let prisma: any
    let testAccount: any
    let testCategory: any
    let testUser: any

    beforeEach(async () => {
        // Cria módulo de teste real com PrismaService
        const moduleRef=await TestModuleBuilder.createIntegrationTestingModule()
        prisma=moduleRef.get(PrismaService)

        // Limpa e popula o banco
        await TestDatabaseUtils.clearDatabase(prisma)
        const {categories}=await TestDatabaseUtils.seedTestData(prisma)

        // Cria usuário e conta reais
        testUser=await prisma.user.create({
            data: TestDataFactory.createUserData()
        })
        testAccount=await prisma.account.create({
            data: TestDataFactory.createAccountData({userId: testUser.id,balance: 1000})
        })
        testCategory=categories[0]

        // Instancia casos de uso reais
        accountBalanceService=moduleRef.get(AccountBalanceService)
        createTransactionUseCase=moduleRef.get(CreateTransactionUseCase)
        accountIntegrationService=moduleRef.get(AccountIntegrationServiceImpl)
        transactionDomainService=moduleRef.get(TransactionDomainService)
    })

    describe('INCOME Transaction',() => {
        it('should increase account balance when income transaction is created',async () => {
            // Arrange
            const accountId=testAccount.id
            const initialBalance=testAccount.balance
            const incomeAmount=500

            // Act
            const transaction=await createTransactionUseCase.execute({
                description: 'Salário',
                amount: incomeAmount,
                type: 'INCOME',
                accountId,
                categoryId: testCategory.id
            })

            // Assert
            const updatedAccount=await prisma.account.findUnique({where: {id: accountId}})
            expect(updatedAccount.balance).toBe(initialBalance+incomeAmount)
            expect(transaction).toHaveProperty('transaction')
            expect(transaction.transaction).toHaveProperty('id')
            expect(transaction.transaction.type).toBe('INCOME')
        })
    })

    // ...demais testes (EXPENSE, TRANSFER, etc) permanecem iguais...
})
