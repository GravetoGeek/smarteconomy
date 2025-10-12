import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../../database/prisma/prisma.service'
import { AccountsPrismaRepository } from './accounts-prisma.repository'
import { Account, AccountType, AccountStatus } from '../../domain/account.entity'
import { LoggerService } from '../../../shared/services/logger.service'
import { TestDatabaseUtils, TestDataFactory } from '../../../__tests__/utils/test-helpers'

describe('AccountsPrismaRepository Integration', () => {
    let repository: AccountsPrismaRepository
    let prisma: PrismaService
    let loggerService: LoggerService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountsPrismaRepository,
                PrismaService,
                LoggerService
            ]
        }).compile()

        repository = module.get<AccountsPrismaRepository>(AccountsPrismaRepository)
        prisma = module.get<PrismaService>(PrismaService)
        loggerService = module.get<LoggerService>(LoggerService)

        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        await TestDatabaseUtils.clearDatabase(prisma)
        await TestDatabaseUtils.seedTestData(prisma)
    })

    describe('save', () => {
        it('should save new account successfully', async () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({
                userId: 'test-user-123'
            })
            const account = new Account(accountData)

            // Act
            const savedAccount = await repository.save(account)

            // Assert
            expect(savedAccount).toBeDefined()
            expect(savedAccount.id).toBe(account.id)
            expect(savedAccount.name).toBe(account.name)
            expect(savedAccount.type).toBe(account.type)
            expect(savedAccount.balance).toBe(account.balance)
            expect(savedAccount.userId).toBe(account.userId)
            expect(savedAccount.status).toBe(AccountStatus.ACTIVE)
        })

        it('should update existing account', async () => {
            // Arrange
            const accountData = TestDataFactory.createAccountData({
                userId: 'test-user-456'
            })
            const account = new Account(accountData)
            await repository.save(account)

            // Modify account
            account.credit(500)

            // Act
            const updatedAccount = await repository.save(account)

            // Assert
            expect(updatedAccount.id).toBe(account.id)
            expect(updatedAccount.balance).toBe(account.balance)
            expect(updatedAccount.updatedAt.getTime()).toBeGreaterThan(account.createdAt.getTime())
        })

        it('should handle different account types', async () => {
            // Arrange
            const checkingAccount = new Account({
                ...TestDataFactory.createAccountData(),
                type: AccountType.CHECKING,
                userId: 'test-user-checking'
            })
            const savingsAccount = new Account({
                ...TestDataFactory.createAccountData(),
                type: AccountType.SAVINGS,
                userId: 'test-user-savings'
            })

            // Act
            const savedChecking = await repository.save(checkingAccount)
            const savedSavings = await repository.save(savingsAccount)

            // Assert
            expect(savedChecking.type).toBe(AccountType.CHECKING)
            expect(savedSavings.type).toBe(AccountType.SAVINGS)
        })
    })

    describe('findById', () => {
        it('should find account by id', async () => {
            // Arrange
            const account = new Account({
                ...TestDataFactory.createAccountData(),
                userId: 'test-user-find'
            })
            const savedAccount = await repository.save(account)

            // Act
            const foundAccount = await repository.findById(savedAccount.id)

            // Assert
            expect(foundAccount).toBeDefined()
            expect(foundAccount?.id).toBe(savedAccount.id)
            expect(foundAccount?.name).toBe(savedAccount.name)
            expect(foundAccount?.type).toBe(savedAccount.type)
            expect(foundAccount?.balance).toBe(savedAccount.balance)
        })

        it('should return null for non-existent account', async () => {
            // Act
            const result = await repository.findById('non-existent-id')

            // Assert
            expect(result).toBeNull()
        })

        it('should reconstitute account correctly', async () => {
            // Arrange
            const originalAccount = new Account({
                name: 'Integration Test Account',
                type: AccountType.SAVINGS,
                balance: 1500.75,
                userId: 'test-user-reconstitute'
            })
            await repository.save(originalAccount)

            // Act
            const foundAccount = await repository.findById(originalAccount.id)

            // Assert
            expect(foundAccount).toBeInstanceOf(Account)
            expect(foundAccount?.name).toBe(originalAccount.name)
            expect(foundAccount?.type).toBe(originalAccount.type)
            expect(foundAccount?.balance).toBe(originalAccount.balance)
            expect(foundAccount?.userId).toBe(originalAccount.userId)
        })
    })

    describe('findAllByUser', () => {
        it('should find all accounts for a user', async () => {
            // Arrange
            const userId = 'test-user-multiple'
            const account1 = new Account({
                name: 'Checking Account',
                type: AccountType.CHECKING,
                balance: 1000,
                userId
            })
            const account2 = new Account({
                name: 'Savings Account',
                type: AccountType.SAVINGS,
                balance: 5000,
                userId
            })

            await repository.save(account1)
            await repository.save(account2)

            // Act
            const userAccounts = await repository.findAllByUser(userId)

            // Assert
            expect(userAccounts).toHaveLength(2)
            expect(userAccounts.every(acc => acc.userId === userId)).toBe(true)
        })

        it('should return empty array for user with no accounts', async () => {
            // Act
            const result = await repository.findAllByUser('user-with-no-accounts')

            // Assert
            expect(result).toEqual([])
        })

        it('should not return accounts from other users', async () => {
            // Arrange
            const user1 = 'user-1'
            const user2 = 'user-2'

            await repository.save(new Account({
                ...TestDataFactory.createAccountData(),
                userId: user1
            }))
            await repository.save(new Account({
                ...TestDataFactory.createAccountData(),
                userId: user2
            }))

            // Act
            const user1Accounts = await repository.findAllByUser(user1)

            // Assert
            expect(user1Accounts).toHaveLength(1)
            expect(user1Accounts[0].userId).toBe(user1)
        })
    })

    describe('delete', () => {
        it('should delete account successfully', async () => {
            // Arrange
            const account = new Account({
                ...TestDataFactory.createAccountData(),
                userId: 'test-user-delete'
            })
            const savedAccount = await repository.save(account)

            // Act
            await repository.delete(savedAccount.id)

            // Assert
            const deletedAccount = await repository.findById(savedAccount.id)
            expect(deletedAccount).toBeNull()
        })

        it('should handle deletion of non-existent account', async () => {
            // Act & Assert
            await expect(repository.delete('non-existent-id')).rejects.toThrow()
        })
    })

    describe('existsById', () => {
        it('should return true for existing account', async () => {
            // Arrange
            const account = new Account({
                ...TestDataFactory.createAccountData(),
                userId: 'test-user-exists'
            })
            const savedAccount = await repository.save(account)

            // Act
            const exists = await repository.existsById(savedAccount.id)

            // Assert
            expect(exists).toBe(true)
        })

        it('should return false for non-existent account', async () => {
            // Act
            const exists = await repository.existsById('non-existent-id')

            // Assert
            expect(exists).toBe(false)
        })
    })

    describe('search', () => {
        beforeEach(async () => {
            // Setup test data for search
            const accounts = [
                new Account({
                    name: 'Primary Checking',
                    type: AccountType.CHECKING,
                    balance: 1000,
                    userId: 'search-user-1'
                }),
                new Account({
                    name: 'Emergency Savings',
                    type: AccountType.SAVINGS,
                    balance: 5000,
                    userId: 'search-user-1'
                }),
                new Account({
                    name: 'Secondary Checking',
                    type: AccountType.CHECKING,
                    balance: 2000,
                    userId: 'search-user-2'
                })
            ]

            for (const account of accounts) {
                await repository.save(account)
            }
        })

        it('should search accounts with pagination', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 2
            })

            // Assert
            expect(result.items).toHaveLength(2)
            expect(result.total).toBe(3)
            expect(result.currentPage).toBe(1)
            expect(result.limit).toBe(2)
            expect(result.totalPages).toBe(2)
        })

        it('should filter accounts by name', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'Primary'
            })

            // Assert
            expect(result.items).toHaveLength(1)
            expect(result.items[0].name).toContain('Primary')
        })

        it('should sort accounts by specified field', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                sort: 'balance',
                sortDirection: 'asc'
            })

            // Assert
            expect(result.items[0].balance).toBeLessThanOrEqual(result.items[1].balance)
        })

        it('should handle case insensitive search', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'primary'
            })

            // Assert
            expect(result.items).toHaveLength(1)
            expect(result.items[0].name).toContain('Primary')
        })

        it('should return empty result for non-matching filter', async () => {
            // Act
            const result = await repository.search({
                page: 1,
                limit: 10,
                filter: 'NonExistentAccount'
            })

            // Assert
            expect(result.items).toHaveLength(0)
            expect(result.total).toBe(0)
        })

        it('should handle pagination beyond available data', async () => {
            // Act
            const result = await repository.search({
                page: 10,
                limit: 10
            })

            // Assert
            expect(result.items).toHaveLength(0)
            expect(result.currentPage).toBe(10)
            expect(result.total).toBe(3)
        })
    })

    describe('error handling', () => {
        it('should handle database connection errors gracefully', async () => {
            // Arrange
            const disconnectedPrisma = new PrismaService()
            const disconnectedRepository = new AccountsPrismaRepository(disconnectedPrisma, loggerService)
            const account = new Account({
                ...TestDataFactory.createAccountData(),
                userId: 'test-user-error'
            })

            // Act & Assert
            await expect(disconnectedRepository.save(account)).rejects.toThrow()
        })

        it('should log errors appropriately', async () => {
            // Arrange
            const mockLogger = {
                logError: jest.fn(),
                logInfo: jest.fn(),
                logWarning: jest.fn(),
                logDebug: jest.fn(),
                log: jest.fn(),
                error: jest.fn(),
                warn: jest.fn(),
                debug: jest.fn(),
                verbose: jest.fn()
            }

            const repositoryWithMockLogger = new AccountsPrismaRepository(prisma, mockLogger as any)

            // Act
            try {
                await repositoryWithMockLogger.delete('non-existent-id')
            } catch (error) {
                // Expected to throw
            }

            // Assert
            expect(mockLogger.logError).toHaveBeenCalled()
        })
    })

    describe('data integrity', () => {
        it('should maintain data consistency across operations', async () => {
            // Arrange
            const account = new Account({
                name: 'Consistency Test Account',
                type: AccountType.CHECKING,
                balance: 1000,
                userId: 'consistency-user'
            })

            // Act
            const saved = await repository.save(account)
            const found = await repository.findById(saved.id)
            const exists = await repository.existsById(saved.id)

            // Assert
            expect(found?.id).toBe(saved.id)
            expect(found?.name).toBe(saved.name)
            expect(found?.type).toBe(saved.type)
            expect(found?.balance).toBe(saved.balance)
            expect(exists).toBe(true)
        })

        it('should handle concurrent operations safely', async () => {
            // Arrange
            const account = new Account({
                ...TestDataFactory.createAccountData(),
                userId: 'concurrent-user'
            })
            await repository.save(account)

            // Act - Simulate concurrent reads
            const promises = Array(5).fill(null).map(() => repository.findById(account.id))
            const results = await Promise.all(promises)

            // Assert
            results.forEach(result => {
                expect(result?.id).toBe(account.id)
            })
        })
    })
})
