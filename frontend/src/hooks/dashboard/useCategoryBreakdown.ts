import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import {SEARCH_TRANSACTIONS} from '../../graphql/queries/transactions.queries'

interface CategoryData {
    amount: number
    category: string
    id: number
}

interface CategoryBreakdown {
    expenses: CategoryData[]
    income: CategoryData[]
}

export const useCategoryBreakdown=(
    userId: string,
    dateFrom?: string,
    dateTo?: string
) => {
    const {data,loading,error,refetch}=useQuery(SEARCH_TRANSACTIONS,{
        variables: {
            userId,
            input: {
                filters: {
                    dateFrom: dateFrom? new Date(dateFrom).toISOString():undefined,
                    dateTo: dateTo? new Date(dateTo).toISOString():undefined,
                },
                page: 1,
                limit: 1000,
            },
        },
        skip: !userId,
    })

    const categoryBreakdown=useMemo(() => {
        if(!data?.searchTransactions?.transactions) {
            return {expenses: [],income: []}
        }

        const transactions=data.searchTransactions.transactions
        const expensesByCategory: {[key: string]: {amount: number; id: number}}={}
        const incomeByCategory: {[key: string]: {amount: number; id: number}}={}

        transactions.forEach((transaction: any) => {
            const categoryName=transaction.category?.category||'Sem categoria'
            const categoryId=transaction.categoryId

            if(transaction.type==='EXPENSE') {
                if(!expensesByCategory[categoryName]) {
                    expensesByCategory[categoryName]={amount: 0,id: categoryId}
                }
                expensesByCategory[categoryName].amount+=transaction.amount
            } else if(transaction.type==='INCOME') {
                if(!incomeByCategory[categoryName]) {
                    incomeByCategory[categoryName]={amount: 0,id: categoryId}
                }
                incomeByCategory[categoryName].amount+=transaction.amount
            }
        })

        const expenses=Object.entries(expensesByCategory).map(([category,data]) => ({
            category,
            amount: data.amount,
            id: data.id,
        }))

        const income=Object.entries(incomeByCategory).map(([category,data]) => ({
            category,
            amount: data.amount,
            id: data.id,
        }))

        return {expenses,income}
    },[data])

    return {
        categoryBreakdown,
        loading,
        error,
        refetch,
    }
}
