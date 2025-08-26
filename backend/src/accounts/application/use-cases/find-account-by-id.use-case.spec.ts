import { Test, TestingModule } from '@nestjs/testing'
import { FindAccountByIdUseCase, FindAccountByIdRequest } from './find-account-by-id.use-case'
import { Account, AccountType } from '../../domain/account.entity'
import { AccountRepositoryPort } from '../../domain/ports/account-repository.port'
import { ACCOUNT_REPOSITORY } from '../../domain/tokens'
import { TestDataFactory, MockProviders } from '@/__tests__/utils/test-helpers'

describe('FindAccountByIdUseCase', () => {
    let useCase: FindAccountByIdUseCase
    let mockAccountRepository: jest.Mocked<AccountRepositoryPort>

    beforeEach(async () => {
        const mockRepository = MockProviders.createMockRepository<AccountRepositoryPort>()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindAccountByIdUseCase,
                {
                    provide: ACCOUNT_REPOSITORY,
                    useValue: mockRepository
                }
            ]
        }).compile()

        useCase = module.get<FindAccountByIdUseCase>(FindAccountByIdUseCase)
        mockAccountRepository = module.get(ACCOUNT_REPOSITORY)
    })

    it('should be defined', () => {
        expect(useCase).toBeDefined()
    })

    describe('execute', () => {
        it('should find account by id successfully', async () => {
            // Arrange
            const accountId = 'account-123'
            const request: FindAccountByIdRequest = { id: accountId }

            const expectedAccount = new Account({
                id: accountId,
                name: 'Test Account',
                type: AccountType.CHECKING,
                balance: 1000,
                userId: 'user-123'
            })

            mockAccountRepository.findById.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeDefined()
            expect(result.account?.id).toBe(accountId)
            expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId)
            expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1)
        })

        it('should return null when account not found', async () => {
            // Arrange
            const accountId = 'non-existent-account'
            const request: FindAccountByIdRequest = { id: accountId }

            mockAccountRepository.findById.mockResolvedValue(null)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeNull()
            expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId)
            expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1)
        })

        it('should handle repository errors', async () => {
            // Arrange
            const accountId = 'error-account'
            const request: FindAccountByIdRequest = { id: accountId }
            const repositoryError = new Error('Database connection failed')

            mockAccountRepository.findById.mockRejectedValue(repositoryError)

            // Act & Assert
            await expect(useCase.execute(request)).rejects.toThrow('Database connection failed')
            expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId)
        })

        it('should preserve all account properties when found', async () => {
            // Arrange
            const accountData = {
                id: 'complete-account',
                name: 'Complete Test Account',
                type: AccountType.SAVINGS,
                balance: 2500.75,
                userId: 'user-456'
            }
            const request: FindAccountByIdRequest = { id: accountData.id }
            const account = new Account(accountData)

            mockAccountRepository.findById.mockResolvedValue(account)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeDefined()
            expect(result.account?.id).toBe(accountData.id)
            expect(result.account?.name).toBe(accountData.name)
            expect(result.account?.type).toBe(accountData.type)
            expect(result.account?.balance).toBe(accountData.balance)
            expect(result.account?.userId).toBe(accountData.userId)
            expect(result.account?.createdAt).toBeDefined()
            expect(result.account?.updatedAt).toBeDefined()
        })

        it('should return account in correct response format when found', async () => {
            // Arrange
            const accountId = 'format-test-account'
            const request: FindAccountByIdRequest = { id: accountId }
            const account = new Account({
                id: accountId,
                name: 'Format Test Account',
                type: AccountType.CHECKING,
                userId: 'user-format'
            })

            mockAccountRepository.findById.mockResolvedValue(account)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result).toHaveProperty('account')
            expect(result.account).toBeInstanceOf(Account)
            expect(typeof result).toBe('object')
        })

        it('should return correct response format when account not found', async () => {
            // Arrange
            const accountId = 'not-found-account'
            const request: FindAccountByIdRequest = { id: accountId }

            mockAccountRepository.findById.mockResolvedValue(null)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result).toHaveProperty('account')
            expect(result.account).toBeNull()
            expect(typeof result).toBe('object')
        })

        it('should handle different account types correctly', async () => {
            // Test CHECKING account
            const checkingAccountId = 'checking-account'
            const checkingAccount = new Account({
                id: checkingAccountId,
                name: 'Checking Account',
                type: AccountType.CHECKING,
                userId: 'user-checking'
            })

            mockAccountRepository.findById.mockResolvedValue(checkingAccount)
            let result = await useCase.execute({ id: checkingAccountId })
            expect(result.account?.type).toBe(AccountType.CHECKING)

            // Test SAVINGS account
            const savingsAccountId = 'savings-account'
            const savingsAccount = new Account({
                id: savingsAccountId,
                name: 'Savings Account',
                type: AccountType.SAVINGS,
                userId: 'user-savings'
            })

            mockAccountRepository.findById.mockResolvedValue(savingsAccount)
            result = await useCase.execute({ id: savingsAccountId })
            expect(result.account?.type).toBe(AccountType.SAVINGS)
        })

        it('should handle various id formats', async () => {
            // Test UUID format
            const uuidId = '550e8400-e29b-41d4-a716-446655440000'
            const request1: FindAccountByIdRequest = { id: uuidId }
            mockAccountRepository.findById.mockResolvedValue(null)

            await useCase.execute(request1)
            expect(mockAccountRepository.findById).toHaveBeenCalledWith(uuidId)

            // Test custom format
            const customId = 'acc_123456789'
            const request2: FindAccountByIdRequest = { id: customId }

            await useCase.execute(request2)
            expect(mockAccountRepository.findById).toHaveBeenCalledWith(customId)
        })

        it('should handle empty or invalid id gracefully', async () => {
            // Empty string
            const emptyRequest: FindAccountByIdRequest = { id: '' }
            mockAccountRepository.findById.mockResolvedValue(null)

            const result = await useCase.execute(emptyRequest)
            expect(result.account).toBeNull()
            expect(mockAccountRepository.findById).toHaveBeenCalledWith('')
        })
    })

    describe('performance and reliability', () => {
        it('should make exactly one repository call', async () => {
            // Arrange
            const accountId = 'performance-test'
            const request: FindAccountByIdRequest = { id: accountId }
            mockAccountRepository.findById.mockResolvedValue(null)

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1)
        })

        it('should not modify the request object', async () => {
            // Arrange
            const originalRequest: FindAccountByIdRequest = { id: 'immutable-test' }
            const requestCopy = { ...originalRequest }
            mockAccountRepository.findById.mockResolvedValue(null)

            // Act
            await useCase.execute(originalRequest)

            // Assert
            expect(originalRequest).toEqual(requestCopy)
        })
    })
})
