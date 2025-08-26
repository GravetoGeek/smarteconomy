import { Test, TestingModule } from '@nestjs/testing'
import { AccountsResolver } from './accounts.resolver'
import { AccountsApplicationService } from '../../../application/services/accounts-application.service'
import { LoggerService } from '@/shared/services/logger.service'
import { CreateAccountInput } from '../inputs/create-account.input'
import { AccountType } from '../../../domain/account.entity'

describe('AccountsResolver', () => {
    let resolver: AccountsResolver
    let accountsService: jest.Mocked<AccountsApplicationService>
    let loggerService: jest.Mocked<LoggerService>

    const createMockAccount = (overrides: any = {}) => ({
        id: `account-${Math.random().toString(36).substring(7)}`,
        name: 'Test Account',
        type: 'CHECKING',
        balance: 1000,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    } as any)

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountsResolver,
                {
                    provide: AccountsApplicationService,
                    useValue: {
                        findAccountsByUser: jest.fn(),
                        findAccountById: jest.fn(),
                        createAccount: jest.fn(),
                        updateAccount: jest.fn(),
                        deleteAccount: jest.fn()
                    }
                },
                {
                    provide: LoggerService,
                    useValue: {
                        logOperation: jest.fn(),
                        logError: jest.fn(),
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn()
                    }
                }
            ]
        }).compile()

        resolver = module.get<AccountsResolver>(AccountsResolver)
        accountsService = module.get(AccountsApplicationService)
        loggerService = module.get(LoggerService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('accountsByUser', () => {
        it('should return accounts for a user', async () => {
            // Arrange
            const userId = 'user-123'
            const mockAccounts = [
                createMockAccount({ userId, name: 'Checking Account' }),
                createMockAccount({ userId, name: 'Savings Account', type: 'SAVINGS' })
            ]
            accountsService.findAccountsByUser.mockResolvedValue(mockAccounts as any)

            // Act
            const result = await resolver.accountsByUser(userId)

            // Assert
            expect(result).toEqual(mockAccounts)
            expect(accountsService.findAccountsByUser).toHaveBeenCalledWith(userId)
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNTS_BY_USER_START',
                { userId },
                'AccountsResolver'
            )
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNTS_BY_USER_SUCCESS',
                { count: 2 },
                'AccountsResolver'
            )
        })

        it('should return empty array when user has no accounts', async () => {
            // Arrange
            const userId = 'user-without-accounts'
            accountsService.findAccountsByUser.mockResolvedValue([])

            // Act
            const result = await resolver.accountsByUser(userId)

            // Assert
            expect(result).toEqual([])
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNTS_BY_USER_SUCCESS',
                { count: 0 },
                'AccountsResolver'
            )
        })

        it('should handle errors when finding accounts by user', async () => {
            // Arrange
            const userId = 'user-123'
            const error = new Error('Database error')
            accountsService.findAccountsByUser.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.accountsByUser(userId)).rejects.toThrow('Database error')
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNTS_BY_USER_START',
                { userId },
                'AccountsResolver'
            )
        })
    })

    describe('accountById', () => {
        it('should return account when found', async () => {
            // Arrange
            const accountId = 'account-123'
            const mockAccount = createMockAccount({ id: accountId })
            accountsService.findAccountById.mockResolvedValue(mockAccount as any)

            // Act
            const result = await resolver.accountById(accountId)

            // Assert
            expect(result).toEqual(mockAccount)
            expect(accountsService.findAccountById).toHaveBeenCalledWith(accountId)
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNT_BY_ID_START',
                { id: accountId },
                'AccountsResolver'
            )
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNT_BY_ID_SUCCESS',
                { id: mockAccount.id },
                'AccountsResolver'
            )
        })

        it('should return null when account not found', async () => {
            // Arrange
            const accountId = 'non-existent-account'
            accountsService.findAccountById.mockResolvedValue(null)

            // Act
            const result = await resolver.accountById(accountId)

            // Assert
            expect(result).toBeNull()
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNT_BY_ID_NOT_FOUND',
                { id: accountId },
                'AccountsResolver'
            )
        })

        it('should handle errors when finding account by id', async () => {
            // Arrange
            const accountId = 'account-123'
            const error = new Error('Database connection failed')
            accountsService.findAccountById.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.accountById(accountId)).rejects.toThrow('Database connection failed')
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNT_BY_ID_START',
                { id: accountId },
                'AccountsResolver'
            )
        })
    })

    describe('createAccount', () => {
        it('should create account successfully', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'New Checking Account',
                type: AccountType.CHECKING,
                balance: 500,
                userId: 'user-123'
            }
            const mockCreatedAccount = createMockAccount({
                name: createInput.name,
                type: createInput.type,
                balance: createInput.balance,
                userId: createInput.userId
            })
            accountsService.createAccount.mockResolvedValue(mockCreatedAccount as any)

            // Act
            const result = await resolver.createAccount(createInput)

            // Assert
            expect(result).toEqual(mockCreatedAccount)
            expect(accountsService.createAccount).toHaveBeenCalledWith({
                name: createInput.name,
                type: createInput.type,
                balance: createInput.balance,
                userId: createInput.userId
            })
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_CREATE_ACCOUNT_START',
                createInput,
                'AccountsResolver'
            )
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_CREATE_ACCOUNT_SUCCESS',
                { id: mockCreatedAccount.id },
                'AccountsResolver'
            )
        })

        it('should handle different account types', async () => {
            // Arrange
            const savingsInput: CreateAccountInput = {
                name: 'Savings Account',
                type: AccountType.SAVINGS,
                balance: 2000,
                userId: 'user-123'
            }
            const mockSavingsAccount = createMockAccount({
                name: savingsInput.name,
                type: savingsInput.type,
                balance: savingsInput.balance
            })
            accountsService.createAccount.mockResolvedValue(mockSavingsAccount as any)

            // Act
            const result = await resolver.createAccount(savingsInput)

            // Assert
            expect(result.type).toBe(AccountType.SAVINGS)
            expect(result.balance).toBe(2000)
            expect(accountsService.createAccount).toHaveBeenCalledWith({
                name: savingsInput.name,
                type: savingsInput.type,
                balance: savingsInput.balance,
                userId: savingsInput.userId
            })
        })

        it('should handle account creation with zero balance', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'New Account',
                type: AccountType.CHECKING,
                balance: 0,
                userId: 'user-123'
            }
            const mockAccount = createMockAccount({
                balance: 0
            })
            accountsService.createAccount.mockResolvedValue(mockAccount as any)

            // Act
            const result = await resolver.createAccount(createInput)

            // Assert
            expect(result.balance).toBe(0)
            expect(accountsService.createAccount).toHaveBeenCalledWith({
                name: createInput.name,
                type: createInput.type,
                balance: 0,
                userId: createInput.userId
            })
        })

        it('should handle validation errors during account creation', async () => {
            // Arrange
            const invalidInput: CreateAccountInput = {
                name: '', // Invalid empty name
                type: AccountType.CHECKING,
                balance: -100, // Invalid negative balance
                userId: 'user-123'
            }
            const error = new Error('Validation failed: Account name cannot be empty')
            accountsService.createAccount.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.createAccount(invalidInput)).rejects.toThrow('Validation failed')
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_CREATE_ACCOUNT_START',
                invalidInput,
                'AccountsResolver'
            )
        })

        it('should handle user not found error during account creation', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'Test Account',
                type: AccountType.CHECKING,
                balance: 100,
                userId: 'non-existent-user'
            }
            const error = new Error('User not found')
            accountsService.createAccount.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.createAccount(createInput)).rejects.toThrow('User not found')
        })

        it('should handle business rule violations', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'Duplicate Account',
                type: AccountType.CHECKING,
                balance: 100,
                userId: 'user-123'
            }
            const error = new Error('Account with this name already exists for user')
            accountsService.createAccount.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.createAccount(createInput)).rejects.toThrow('Account with this name already exists')
        })
    })

    describe('logging behavior', () => {
        it('should log all operations correctly', async () => {
            // Arrange
            const userId = 'user-123'
            const mockAccounts = [createMockAccount()]
            accountsService.findAccountsByUser.mockResolvedValue(mockAccounts as any)

            // Act
            await resolver.accountsByUser(userId)

            // Assert
            expect(loggerService.logOperation).toHaveBeenCalledTimes(2)
            expect(loggerService.logOperation).toHaveBeenNthCalledWith(
                1,
                'GRAPHQL_GET_ACCOUNTS_BY_USER_START',
                { userId },
                'AccountsResolver'
            )
            expect(loggerService.logOperation).toHaveBeenNthCalledWith(
                2,
                'GRAPHQL_GET_ACCOUNTS_BY_USER_SUCCESS',
                { count: 1 },
                'AccountsResolver'
            )
        })

        it('should log start operation even when error occurs', async () => {
            // Arrange
            const accountId = 'account-123'
            const error = new Error('Test error')
            accountsService.findAccountById.mockRejectedValue(error)

            // Act & Assert
            await expect(resolver.accountById(accountId)).rejects.toThrow()
            expect(loggerService.logOperation).toHaveBeenCalledWith(
                'GRAPHQL_GET_ACCOUNT_BY_ID_START',
                { id: accountId },
                'AccountsResolver'
            )
            // Should not log success when error occurs
            expect(loggerService.logOperation).not.toHaveBeenCalledWith(
                expect.stringContaining('SUCCESS'),
                expect.anything(),
                'AccountsResolver'
            )
        })
    })

    describe('input handling', () => {
        it('should handle special characters in account names', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'My Account #1 (Primary)',
                type: AccountType.CHECKING,
                balance: 100,
                userId: 'user-123'
            }
            const mockAccount = createMockAccount({
                name: createInput.name
            })
            accountsService.createAccount.mockResolvedValue(mockAccount as any)

            // Act
            const result = await resolver.createAccount(createInput)

            // Assert
            expect(result.name).toBe('My Account #1 (Primary)')
        })

        it('should handle large balance amounts', async () => {
            // Arrange
            const createInput: CreateAccountInput = {
                name: 'High Balance Account',
                type: AccountType.SAVINGS,
                balance: 9999999.99,
                userId: 'user-123'
            }
            const mockAccount = createMockAccount({
                balance: createInput.balance
            })
            accountsService.createAccount.mockResolvedValue(mockAccount as any)

            // Act
            const result = await resolver.createAccount(createInput)

            // Assert
            expect(result.balance).toBe(9999999.99)
        })
    })

    describe('error handling patterns', () => {
        it('should propagate service errors to GraphQL layer', async () => {
            // Arrange
            const userId = 'user-123'
            const serviceError = new Error('Service temporarily unavailable')
            accountsService.findAccountsByUser.mockRejectedValue(serviceError)

            // Act & Assert
            await expect(resolver.accountsByUser(userId)).rejects.toThrow('Service temporarily unavailable')
        })

        it('should not catch and suppress errors', async () => {
            // This test ensures that the resolver doesn't accidentally catch errors
            // that should be propagated to the GraphQL error handling layer

            // Arrange
            const createInput: CreateAccountInput = {
                name: 'Test Account',
                type: AccountType.CHECKING,
                balance: 100,
                userId: 'user-123'
            }
            const criticalError = new Error('Critical system error')
            accountsService.createAccount.mockRejectedValue(criticalError)

            // Act & Assert
            await expect(resolver.createAccount(createInput)).rejects.toThrow('Critical system error')
        })
    })
})
