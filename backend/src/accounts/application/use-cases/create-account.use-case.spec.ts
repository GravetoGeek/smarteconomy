import { Test, TestingModule } from '@nestjs/testing'
import { CreateAccountUseCase, CreateAccountRequest } from './create-account.use-case'
import { Account, AccountType } from '../../domain/account.entity'
import { AccountRepositoryPort } from '../../domain/ports/account-repository.port'
import { ACCOUNT_REPOSITORY } from '../../domain/tokens'
import { TestDataFactory, MockProviders } from '../../../__tests__/utils/test-helpers'

describe('CreateAccountUseCase', () => {
    let useCase: CreateAccountUseCase
    let mockAccountRepository: jest.Mocked<AccountRepositoryPort>

    beforeEach(async () => {
        const mockRepository = MockProviders.createMockRepository<AccountRepositoryPort>()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateAccountUseCase,
                {
                    provide: ACCOUNT_REPOSITORY,
                    useValue: mockRepository
                }
            ]
        }).compile()

        useCase = module.get<CreateAccountUseCase>(CreateAccountUseCase)
        mockAccountRepository = module.get(ACCOUNT_REPOSITORY)
    })

    it('should be defined', () => {
        expect(useCase).toBeDefined()
    })

    describe('execute', () => {
        it('should create account successfully', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Test Account',
                type: AccountType.CHECKING,
                balance: 1000,
                userId: 'user-123'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeDefined()
            expect(mockAccountRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: request.name,
                    type: request.type,
                    balance: request.balance,
                    userId: request.userId
                })
            )
        })

        it('should create account with default balance when not provided', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Test Account',
                type: AccountType.SAVINGS,
                userId: 'user-456'
            }

            const expectedAccount = new Account({ ...request, balance: 0 })
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeDefined()
            expect(mockAccountRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: request.name,
                    type: request.type,
                    balance: 0,
                    userId: request.userId
                })
            )
        })

        it('should create account with checking type', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Checking Account',
                type: AccountType.CHECKING,
                balance: 500,
                userId: 'user-789'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account.type).toBe(AccountType.CHECKING)
            expect(mockAccountRepository.save).toHaveBeenCalled()
        })

        it('should create account with savings type', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Savings Account',
                type: AccountType.SAVINGS,
                balance: 2000,
                userId: 'user-101'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account.type).toBe(AccountType.SAVINGS)
            expect(mockAccountRepository.save).toHaveBeenCalled()
        })

        it('should handle repository errors', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Test Account',
                type: AccountType.CHECKING,
                userId: 'user-123'
            }

            const repositoryError = new Error('Database connection failed')
            mockAccountRepository.save.mockRejectedValue(repositoryError)

            // Act & Assert
            await expect(useCase.execute(request)).rejects.toThrow('Database connection failed')
            expect(mockAccountRepository.save).toHaveBeenCalled()
        })

        it('should preserve all account properties', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Complete Account',
                type: AccountType.CHECKING,
                balance: 1500.75,
                userId: 'user-complete'
            }

            const savedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(savedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account.name).toBe(request.name)
            expect(result.account.type).toBe(request.type)
            expect(result.account.balance).toBe(request.balance)
            expect(result.account.userId).toBe(request.userId)
            expect(result.account.id).toBeDefined()
            expect(result.account.createdAt).toBeDefined()
            expect(result.account.updatedAt).toBeDefined()
        })

        it('should call repository save exactly once', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Single Call Account',
                type: AccountType.SAVINGS,
                userId: 'user-single'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            await useCase.execute(request)

            // Assert
            expect(mockAccountRepository.save).toHaveBeenCalledTimes(1)
        })

        it('should return account in correct response format', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Response Format Account',
                type: AccountType.CHECKING,
                userId: 'user-response'
            }

            const savedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(savedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result).toHaveProperty('account')
            expect(result.account).toBeInstanceOf(Account)
            expect(typeof result).toBe('object')
        })
    })

    describe('validation scenarios', () => {
        it('should handle account creation with minimum required fields', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Min Fields Account',
                type: AccountType.CHECKING,
                userId: 'user-min'
            }

            const expectedAccount = new Account({ ...request, balance: 0 })
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account).toBeDefined()
            expect(result.account.balance).toBe(0)
        })

        it('should handle decimal balance values', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Decimal Balance Account',
                type: AccountType.SAVINGS,
                balance: 1234.56,
                userId: 'user-decimal'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account.balance).toBe(1234.56)
        })

        it('should handle zero balance', async () => {
            // Arrange
            const request: CreateAccountRequest = {
                name: 'Zero Balance Account',
                type: AccountType.CHECKING,
                balance: 0,
                userId: 'user-zero'
            }

            const expectedAccount = new Account(request)
            mockAccountRepository.save.mockResolvedValue(expectedAccount)

            // Act
            const result = await useCase.execute(request)

            // Assert
            expect(result.account.balance).toBe(0)
        })
    })
})
