import {Test,TestingModule} from '@nestjs/testing'
import {JWT_SERVICE} from '../../../../auth/domain/tokens'
import {
    CreateTransactionUseCase,
    GetTransactionSummaryUseCase,
    ReverseTransactionUseCase,
    SearchTransactionsUseCase,
    UpdateTransactionUseCase
} from '../../../application'
import {
    Transaction,
    TransactionSearchResult as TransactionSearchResultDomain,
    TransactionStatus,
    TransactionSummary as TransactionSummaryDomain,
    TransactionType
} from '../../../domain'
import {CreateTransactionInput,SearchTransactionsInput,UpdateTransactionInput} from '../../dtos/inputs/transaction.input'
import {
    CreateTransactionResponseModel,
    TransactionModel,
    TransactionSearchResultModel,
    TransactionStatusEnum,
    TransactionSummaryModel,
    TransactionTypeEnum
} from '../../dtos/models/transaction.model'
import {TransactionGraphQLMapper} from '../mappers/transaction-graphql.mapper'
import {TransactionResolver} from './transaction.resolver'

describe('TransactionResolver',() => {
    let resolver: TransactionResolver
    let createTransactionUseCase: jest.Mocked<CreateTransactionUseCase>
    let searchTransactionsUseCase: jest.Mocked<SearchTransactionsUseCase>
    let getTransactionSummaryUseCase: jest.Mocked<GetTransactionSummaryUseCase>
    let updateTransactionUseCase: jest.Mocked<UpdateTransactionUseCase>
    let reverseTransactionUseCase: jest.Mocked<ReverseTransactionUseCase>

    const createTransactionEntity=(overrides: Partial<{
        id: string
        description: string
        amount: number
        type: TransactionType
        status: TransactionStatus
        accountId: string
        categoryId?: string
        destinationAccountId?: string
        date: Date
        createdAt: Date
        updatedAt: Date
    }>={}): Transaction =>
        Transaction.reconstitute({
            id: overrides.id??'txn-1',
            description: overrides.description??'Test transaction',
            amount: overrides.amount??150,
            type: overrides.type??TransactionType.INCOME,
            accountId: overrides.accountId??'acc-1',
            categoryId: overrides.categoryId??'cat-1',
            destinationAccountId: overrides.destinationAccountId,
            date: overrides.date??new Date('2023-01-01T00:00:00.000Z'),
            status: overrides.status??TransactionStatus.PENDING,
            createdAt: overrides.createdAt??new Date('2023-01-01T00:00:00.000Z'),
            updatedAt: overrides.updatedAt??new Date('2023-01-02T00:00:00.000Z')
        })

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                TransactionResolver,
                {
                    provide: CreateTransactionUseCase,
                    useValue: {execute: jest.fn()}
                },
                {
                    provide: SearchTransactionsUseCase,
                    useValue: {execute: jest.fn()}
                },
                {
                    provide: GetTransactionSummaryUseCase,
                    useValue: {execute: jest.fn()}
                },
                {
                    provide: UpdateTransactionUseCase,
                    useValue: {execute: jest.fn()}
                },
                {
                    provide: ReverseTransactionUseCase,
                    useValue: {execute: jest.fn()}
                },
                {
                    provide: JWT_SERVICE,
                    useValue: {
                        verify: jest.fn().mockResolvedValue({sub: 'test-user'})
                    }
                }
            ]
        }).compile()

        resolver=module.get<TransactionResolver>(TransactionResolver)
        createTransactionUseCase=module.get(CreateTransactionUseCase)
        searchTransactionsUseCase=module.get(SearchTransactionsUseCase)
        getTransactionSummaryUseCase=module.get(GetTransactionSummaryUseCase)
        updateTransactionUseCase=module.get(UpdateTransactionUseCase)
        reverseTransactionUseCase=module.get(ReverseTransactionUseCase)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createTransaction',() => {
        it('should map created transaction to DTO',async () => {
            const input: CreateTransactionInput={
                description: 'Salary payment',
                amount: 2500,
                type: TransactionTypeEnum.INCOME,
                accountId: 'acc-1',
                categoryId: 'cat-salary',
                destinationAccountId: undefined,
                date: new Date('2023-02-01T00:00:00.000Z')
            }
            const transaction=createTransactionEntity({
                description: input.description,
                amount: input.amount,
                type: TransactionType.INCOME,
                categoryId: input.categoryId
            })
            const warnings=['Check category mapping']
            createTransactionUseCase.execute.mockResolvedValue({
                transaction,
                updatedBalances: [],
                warnings
            })

            const result=await resolver.createTransaction(input)

            const expected: CreateTransactionResponseModel=TransactionGraphQLMapper.toCreateResponseModel(transaction,warnings)
            expect(result).toEqual(expected)
            expect(createTransactionUseCase.execute).toHaveBeenCalledWith({
                description: input.description,
                amount: input.amount,
                type: input.type,
                accountId: input.accountId,
                categoryId: input.categoryId,
                destinationAccountId: input.destinationAccountId,
                date: input.date
            })
        })
    })

    describe('searchTransactions',() => {
        it('should map search result to DTO',async () => {
            const input: SearchTransactionsInput={
                limit: 5,
                page: 2,
                sortBy: 'date',
                sortOrder: 'desc',
                filters: {
                    accountId: 'acc-1',
                    categoryId: 'cat-1',
                    type: TransactionTypeEnum.EXPENSE,
                    status: TransactionStatusEnum.COMPLETED,
                    dateFrom: new Date('2023-01-01T00:00:00.000Z'),
                    dateTo: new Date('2023-01-31T23:59:59.000Z'),
                    minAmount: 10,
                    maxAmount: 1000,
                    searchTerm: 'groceries'
                }
            }
            const transactions=[createTransactionEntity({type: TransactionType.EXPENSE,status: TransactionStatus.COMPLETED})]
            const searchResult: TransactionSearchResultDomain={
                items: transactions,
                total: 1,
                currentPage: 2,
                totalPages: 3,
                hasNextPage: true,
                hasPreviousPage: true
            }
            searchTransactionsUseCase.execute.mockResolvedValue(searchResult)

            const result=await resolver.searchTransactions('user-1',input)

            const expected: TransactionSearchResultModel=TransactionGraphQLMapper.toSearchResultModel(searchResult,input.limit!)
            expect(result).toEqual(expected)
            expect(searchTransactionsUseCase.execute).toHaveBeenCalledWith({
                filters: {
                    accountId: input.filters?.accountId,
                    categoryId: input.filters?.categoryId,
                    type: input.filters?.type,
                    status: input.filters?.status,
                    dateFrom: input.filters?.dateFrom?.toISOString(),
                    dateTo: input.filters?.dateTo?.toISOString(),
                    minAmount: input.filters?.minAmount,
                    maxAmount: input.filters?.maxAmount,
                    searchTerm: input.filters?.searchTerm
                },
                page: input.page||1,
                limit: input.limit||10,
                sortBy: input.sortBy as any,
                sortOrder: input.sortOrder as any
            })
        })
    })

    describe('transactionSummary',() => {
        it('should map summary to DTO',async () => {
            const summary: TransactionSummaryDomain={
                totalIncome: 5000,
                totalExpenses: 3200,
                totalTransfers: 800,
                netAmount: 1000,
                transactionCount: 25,
                period: {
                    from: new Date('2023-01-01T00:00:00.000Z'),
                    to: new Date('2023-01-31T23:59:59.000Z')
                }
            }
            getTransactionSummaryUseCase.execute.mockResolvedValue(summary)

            const dateFrom=new Date('2023-01-01T00:00:00.000Z')
            const dateTo=new Date('2023-01-31T00:00:00.000Z')

            const result=await resolver.transactionSummary('acc-1',dateFrom,dateTo)

            const expected: TransactionSummaryModel=TransactionGraphQLMapper.toSummaryModel(summary)
            expect(result).toEqual(expected)
            expect(getTransactionSummaryUseCase.execute).toHaveBeenCalledWith({
                accountId: 'acc-1',
                dateFrom,
                dateTo
            })
        })
    })

    describe('updateTransaction',() => {
        it('should map updated transaction to DTO',async () => {
            const transaction=createTransactionEntity({status: TransactionStatus.COMPLETED})
            updateTransactionUseCase.execute.mockResolvedValue(transaction)

            const input: UpdateTransactionInput={
                description: 'Updated description',
                status: TransactionStatusEnum.COMPLETED
            }

            const result=await resolver.updateTransaction(transaction.id,input)

            const expected: TransactionModel=TransactionGraphQLMapper.toModel(transaction)
            expect(result).toEqual(expected)
            expect(updateTransactionUseCase.execute).toHaveBeenCalledWith({
                id: transaction.id,
                description: input.description,
                status: input.status
            })
        })
    })

    describe('reverseTransaction',() => {
        it('should map reversal transaction to DTO',async () => {
            const reversalTransaction=createTransactionEntity({
                id: 'txn-reversal',
                type: TransactionType.TRANSFER,
                status: TransactionStatus.COMPLETED,
                destinationAccountId: 'acc-destination'
            })
            reverseTransactionUseCase.execute.mockResolvedValue({
                originalTransaction: createTransactionEntity({id: 'txn-original'}),
                reversalTransaction,
                success: true,
                message: 'success'
            })

            const result=await resolver.reverseTransaction('txn-original','Duplicate entry','user-1')

            const expected: TransactionModel=TransactionGraphQLMapper.toModel(reversalTransaction)
            expect(result).toEqual(expected)
            expect(reverseTransactionUseCase.execute).toHaveBeenCalledWith({
                transactionId: 'txn-original',
                reason: 'Duplicate entry',
                requestedBy: 'user-1'
            })
        })
    })
})
