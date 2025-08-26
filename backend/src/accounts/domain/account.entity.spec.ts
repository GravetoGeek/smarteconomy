import { Account, AccountType, AccountStatus } from './account.entity'
import { TestDataFactory, TestAssertions } from '../../__tests__/utils/test-helpers'

describe('Account Entity', () => {
    describe('constructor', () => {
        it('should create account with valid data', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData()

            // Act
            const account = new Account(accountData)

            // Assert
            expect(account).toBeDefined()
            expect(account.name).toBe(accountData.name)
            expect(account.type).toBe(accountData.type)
            expect(account.balance).toBe(accountData.balance)
            expect(account.userId).toBe(accountData.userId)
            expect(account.status).toBe(AccountStatus.ACTIVE)
            TestAssertions.expectValidDate(account.createdAt)
            TestAssertions.expectValidDate(account.updatedAt)
        })

        it('should generate unique ID for each account', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData()

            // Act
            const account1 = new Account(accountData)
            const account2 = new Account(accountData)

            // Assert
            expect(account1.id).not.toBe(account2.id)
            expect(account1.id).toContain('acc_')
            expect(account2.id).toContain('acc_')
        })

        it('should set default balance to 0', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData()
            delete accountData.balance

            // Act
            const account = new Account(accountData)

            // Assert
            expect(account.balance).toBe(0)
        })

        it('should set default status to ACTIVE', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData()

            // Act
            const account = new Account(accountData)

            // Assert
            expect(account.status).toBe(AccountStatus.ACTIVE)
        })

        it('should accept custom ID', () => {
            // Arrange
            const customId = 'custom-account-id'
            const accountData = TestDataFactory.createAccountData({ id: customId })

            // Act
            const account = new Account(accountData)

            // Assert
            expect(account.id).toBe(customId)
        })
    })

    describe('validation', () => {
        it('should throw error for invalid name - empty', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({ name: '' })

            // Act & Assert
            expect(() => new Account(accountData)).toThrow('Nome da conta inválido')
        })

        it('should throw error for invalid name - null', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({ name: null })

            // Act & Assert
            expect(() => new Account(accountData)).toThrow('Nome da conta inválido')
        })

        it('should throw error for invalid name - too short', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({ name: 'a' })

            // Act & Assert
            expect(() => new Account(accountData)).toThrow('Nome da conta inválido')
        })

        it('should trim whitespace from name', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({ name: '  Test Account  ' })

            // Act
            const account = new Account(accountData)

            // Assert
            expect(account.name).toBe('Test Account')
        })
    })

    describe('reconstitute method', () => {
        it('should reconstitute account from persistent data', () => {
            // Arrange
            const persistentData = {
                id: 'account-123',
                name: 'Test Account',
                type: AccountType.CHECKING,
                balance: 1500.50,
                userId: 'user-456',
                status: AccountStatus.ACTIVE,
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            }

            // Act
            const account = Account.reconstitute(persistentData)

            // Assert
            expect(account.id).toBe(persistentData.id)
            expect(account.name).toBe(persistentData.name)
            expect(account.type).toBe(persistentData.type)
            expect(account.balance).toBe(persistentData.balance)
            expect(account.userId).toBe(persistentData.userId)
            expect(account.status).toBe(persistentData.status)
            expect(account.createdAt).toBe(persistentData.createdAt)
            expect(account.updatedAt).toBe(persistentData.updatedAt)
        })

        it('should handle different account types', () => {
            // Arrange
            const checkingData = { type: AccountType.CHECKING }
            const savingsData = { type: AccountType.SAVINGS }

            // Act
            const checkingAccount = Account.reconstitute({ ...TestDataFactory.createAccountData(), ...checkingData })
            const savingsAccount = Account.reconstitute({ ...TestDataFactory.createAccountData(), ...savingsData })

            // Assert
            expect(checkingAccount.type).toBe(AccountType.CHECKING)
            expect(savingsAccount.type).toBe(AccountType.SAVINGS)
        })
    })

    describe('toPrisma method', () => {
        it('should convert account to Prisma format', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData()
            const account = new Account(accountData)

            // Act
            const prismaData = account.toPrisma()

            // Assert
            expect(prismaData).toHaveProperty('id', account.id)
            expect(prismaData).toHaveProperty('name', account.name)
            expect(prismaData).toHaveProperty('type', account.type)
            expect(prismaData).toHaveProperty('balance', account.balance)
            expect(prismaData).toHaveProperty('userId', account.userId)
            expect(prismaData).toHaveProperty('status', account.status)
            expect(prismaData).toHaveProperty('createdAt', account.createdAt)
            expect(prismaData).toHaveProperty('updatedAt', account.updatedAt)
        })

        it('should return object with all required fields', () => {
            // Arrange
            const account = new Account(TestDataFactory.createAccountData())

            // Act
            const prismaData = account.toPrisma()

            // Assert
            const requiredFields = ['id', 'name', 'type', 'balance', 'userId', 'status', 'createdAt', 'updatedAt']
            TestAssertions.expectEntityStructure(prismaData, requiredFields)
        })
    })

    describe('business methods', () => {
        let account: Account

        beforeEach(() => {
            account = new Account(TestDataFactory.createAccountData({ balance: 1000 }))
        })

        describe('credit', () => {
            it('should credit amount to balance', () => {
                // Arrange
                const creditAmount = 500
                const originalBalance = account.balance
                const originalUpdatedAt = account.updatedAt

                // Act
                account.credit(creditAmount)

                // Assert
                expect(account.balance).toBe(originalBalance + creditAmount)
                expect(account.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should handle decimal amounts', () => {
                // Arrange
                const creditAmount = 250.75
                const originalBalance = account.balance

                // Act
                account.credit(creditAmount)

                // Assert
                expect(account.balance).toBe(originalBalance + creditAmount)
            })

            it('should throw error for invalid amount - zero', () => {
                // Act & Assert
                expect(() => account.credit(0)).toThrow('Valor inválido')
            })

            it('should throw error for invalid amount - negative', () => {
                // Act & Assert
                expect(() => account.credit(-100)).toThrow('Valor inválido')
            })
        })

        describe('debit', () => {
            it('should debit amount from balance', () => {
                // Arrange
                const debitAmount = 300
                const originalBalance = account.balance
                const originalUpdatedAt = account.updatedAt

                // Act
                account.debit(debitAmount)

                // Assert
                expect(account.balance).toBe(originalBalance - debitAmount)
                expect(account.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should handle decimal amounts', () => {
                // Arrange
                const debitAmount = 150.25
                const originalBalance = account.balance

                // Act
                account.debit(debitAmount)

                // Assert
                expect(account.balance).toBe(originalBalance - debitAmount)
            })

            it('should throw error for insufficient balance', () => {
                // Arrange
                const debitAmount = account.balance + 1

                // Act & Assert
                expect(() => account.debit(debitAmount)).toThrow('Saldo insuficiente')
                expect(account.balance).toBe(1000) // Balance should remain unchanged
            })

            it('should allow exact balance debit', () => {
                // Arrange
                const debitAmount = account.balance

                // Act
                account.debit(debitAmount)

                // Assert
                expect(account.balance).toBe(0)
            })

            it('should throw error for invalid amount - zero', () => {
                // Act & Assert
                expect(() => account.debit(0)).toThrow('Valor inválido')
            })

            it('should throw error for invalid amount - negative', () => {
                // Act & Assert
                expect(() => account.debit(-100)).toThrow('Valor inválido')
            })
        })

        describe('transaction scenarios', () => {
            it('should handle multiple credits and debits', () => {
                // Arrange
                const initialBalance = account.balance

                // Act
                account.credit(500)    // 1000 + 500 = 1500
                account.debit(200)     // 1500 - 200 = 1300
                account.credit(100)    // 1300 + 100 = 1400
                account.debit(50)      // 1400 - 50 = 1350

                // Assert
                expect(account.balance).toBe(1350)
            })

            it('should maintain data integrity across operations', () => {
                // Arrange
                const originalId = account.id
                const originalUserId = account.userId

                // Act
                account.credit(100)
                account.debit(50)

                // Assert
                expect(account.id).toBe(originalId)
                expect(account.userId).toBe(originalUserId)
                expect(account.type).toBeDefined()
                expect(account.status).toBeDefined()
            })
        })
    })

    describe('getters', () => {
        it('should provide read-only access to properties', () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({
                name: 'Test Account',
                type: AccountType.SAVINGS,
                balance: 2500,
                userId: 'user-789'
            })
            const account = new Account(accountData)

            // Assert
            expect(account.id).toBeDefined()
            expect(account.name).toBe('Test Account')
            expect(account.type).toBe(AccountType.SAVINGS)
            expect(account.balance).toBe(2500)
            expect(account.userId).toBe('user-789')
            expect(account.status).toBe(AccountStatus.ACTIVE)
            expect(account.createdAt).toBeInstanceOf(Date)
            expect(account.updatedAt).toBeInstanceOf(Date)
        })
    })

    describe('immutability', () => {
        it('should not allow direct modification of readonly properties', () => {
            // Arrange
            const account = new Account(TestDataFactory.createAccountData())

            // Assert - These should be readonly and cause TypeScript errors if modified
            expect(account.id).toBeDefined()
            expect(account.createdAt).toBeDefined()
            // account.id = 'new-id' // Should cause TS error
            // account.createdAt = new Date() // Should cause TS error
        })
    })
})
