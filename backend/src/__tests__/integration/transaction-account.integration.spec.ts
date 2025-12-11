/**
 * 🧪 Integration Test: Transaction → Account Balance Update
 *
 * Testa o fluxo completo de criação de transação e atualização de saldo
 */

import {AccountsModule} from '@/accounts/accounts.module'
import {AccountBalanceService} from '@/accounts/application/services/account-balance.service'
import {CreateTransactionUseCase} from '@/transactions/application/use-cases/create-transaction.use-case'
import {TransactionDomainService} from '@/transactions/domain/services/transaction-domain.service'
import {AccountIntegrationServiceImpl} from '@/transactions/infrastructure/services/account-integration.service'
import {TransactionsModule} from '@/transactions/transactions.module'
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
        const moduleRef=await TestModuleBuilder.createIntegrationTestingModule(
            [], // providers
            [AccountsModule,TransactionsModule] // imports
        )
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
        // AccountIntegrationServiceImpl is not exported by TransactionsModule, so we might not be able to get it directly if it's not exported.
        // But we can try to get it if it's provided in the module scope, although usually only exported providers are available from outside.
        // However, for integration tests, we usually test the public API (Use Cases).
        // If we really need it, we should export it from TransactionsModule or use moduleRef.resolve() if it's scoped (it's not).
        // Let's try to get it, if it fails we'll see.
        // Actually, looking at TransactionsModule, AccountIntegrationServiceImpl is NOT exported.
        // So moduleRef.get(AccountIntegrationServiceImpl) will likely fail or return undefined if strict.
        // But since we are importing the module into the TestModule, the TestModule "inherits" the providers? No, only exported ones.

        // For now, I will comment out getting AccountIntegrationServiceImpl if it's not used in the test directly (it seems it is used in the setup but not in the test body shown).
        // Wait, the test body uses `createTransactionUseCase`.

        // Let's check if we really need `accountIntegrationService` and `transactionDomainService` variables in the test.
        // They are assigned but not used in the visible test code (only `createTransactionUseCase` and `accountBalanceService` are used in the commented out code).
        // The first test uses `createTransactionUseCase`.

        // I'll try to get them, but if it fails I'll remove them.
        // accountIntegrationService=moduleRef.get(AccountIntegrationServiceImpl)
        // transactionDomainService=moduleRef.get(TransactionDomainService)

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

    describe('EXPENSE Transaction',() => {
        it('should decrease account balance when expense transaction is created',async () => {
            // Arrange
            const accountId='test-account-id'
            const initialBalance=1000
            const expenseAmount=300

            // Act
            // const transaction = await createTransactionUseCase.execute({
            //     description: 'Mercado',
            //     amount: expenseAmount,
            //     type: 'EXPENSE',
            //     accountId,
            //     categoryId: 'test-category-id'
            // })

            // Assert
            // const newBalance = await accountBalanceService.getBalance(accountId)
            // expect(newBalance).toBe(initialBalance - expenseAmount)
        })

        it('should throw error when insufficient balance',async () => {
            // Arrange
            const accountId='test-account-id'
            const initialBalance=100
            const expenseAmount=500

            // Act & Assert
            // await expect(
            //     createTransactionUseCase.execute({
            //         description: 'Compra grande',
            //         amount: expenseAmount,
            //         type: 'EXPENSE',
            //         accountId,
            //         categoryId: 'test-category-id'
            //     })
            // ).rejects.toThrow('Saldo insuficiente')
        })
    })

    describe('TRANSFER Transaction',() => {
        it('should transfer balance between accounts',async () => {
            // Arrange
            const fromAccountId='account-1'
            const toAccountId='account-2'
            const transferAmount=200
            const account1InitialBalance=1000
            const account2InitialBalance=500

            // Act
            // const transaction = await createTransactionUseCase.execute({
            //     description: 'Transferência',
            //     amount: transferAmount,
            //     type: 'TRANSFER',
            //     accountId: fromAccountId,
            //     destinationAccountId: toAccountId,
            //     categoryId: 'test-category-id'
            // })

            // Assert
            // const account1Balance = await accountBalanceService.getBalance(fromAccountId)
            // const account2Balance = await accountBalanceService.getBalance(toAccountId)
            //
            // expect(account1Balance).toBe(account1InitialBalance - transferAmount)
            // expect(account2Balance).toBe(account2InitialBalance + transferAmount)
        })

        it('should rollback on transfer failure',async () => {
            // Este teste verifica se o rollback funciona corretamente
            // quando a conta destino não existe ou há algum erro

            // Arrange
            const fromAccountId='account-1'
            const invalidToAccountId='invalid-account'
            const transferAmount=200
            const initialBalance=1000

            // Act & Assert
            // await expect(
            //     createTransactionUseCase.execute({
            //         description: 'Transferência inválida',
            //         amount: transferAmount,
            //         type: 'TRANSFER',
            //         accountId: fromAccountId,
            //         destinationAccountId: invalidToAccountId,
            //         categoryId: 'test-category-id'
            //     })
            // ).rejects.toThrow()

            // Verify rollback
            // const balance = await accountBalanceService.getBalance(fromAccountId)
            // expect(balance).toBe(initialBalance) // Balance não mudou
        })
    })

    describe('Account Balance Service',() => {
        it('should credit account successfully',async () => {
            // Arrange
            const accountId='test-account'
            const initialBalance=500
            const creditAmount=300

            // Act
            // const result = await accountBalanceService.credit({
            //     accountId,
            //     amount: creditAmount,
            //     operation: 'CREDIT'
            // })

            // Assert
            // expect(result.previousBalance).toBe(initialBalance)
            // expect(result.newBalance).toBe(initialBalance + creditAmount)
        })

        it('should debit account successfully',async () => {
            // Arrange
            const accountId='test-account'
            const initialBalance=500
            const debitAmount=200

            // Act
            // const result = await accountBalanceService.debit({
            //     accountId,
            //     amount: debitAmount,
            //     operation: 'DEBIT'
            // })

            // Assert
            // expect(result.previousBalance).toBe(initialBalance)
            // expect(result.newBalance).toBe(initialBalance - debitAmount)
        })

        it('should check balance availability',async () => {
            // Arrange
            const accountId='test-account'
            const accountBalance=500

            // Act
            // const hasSufficientBalance = await accountBalanceService.hasBalance(accountId, 300)
            // const hasInsufficientBalance = await accountBalanceService.hasBalance(accountId, 600)

            // Assert
            // expect(hasSufficientBalance).toBe(true)
            // expect(hasInsufficientBalance).toBe(false)
        })
    })
})
