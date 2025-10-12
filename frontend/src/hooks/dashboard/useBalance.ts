import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import {SEARCH_TRANSACTIONS} from '../../graphql/queries/transactions.queries'

interface BalanceData {
    totalExpenses: number
    totalIncome: number
    balance: number
    transactions: any[]
}

interface BalanceVariables {
    userId: string
    dateFrom?: string
    dateTo?: string
}

export const useBalance=(userId: string,dateFrom?: string,dateTo?: string) => {
    const {data,loading,error,refetch}=useQuery(SEARCH_TRANSACTIONS,{
        variables: {
            userId,
            input: {
                filters: {
                    dateFrom: dateFrom? new Date(dateFrom).toISOString():undefined,
                    dateTo: dateTo? new Date(dateTo).toISOString():undefined,
                },
                page: 1,
                limit: 1000, // Get all transactions for the period
            },
        },
        skip: !userId,
    })

    const balanceData=useMemo(() => {
        if(!data?.searchTransactions?.transactions) {
            return {
                totalExpenses: 0,
                totalIncome: 0,
                balance: 0,
                transactions: [],
            }
        }

        const transactions=data.searchTransactions.transactions
        let totalExpenses=0
        let totalIncome=0

        transactions.forEach((transaction: any) => {
            if(transaction.type==='EXPENSE') {
                totalExpenses+=transaction.amount
            } else if(transaction.type==='INCOME') {
                totalIncome+=transaction.amount
            }
        })

        return {
            totalExpenses,
            totalIncome,
            balance: totalIncome-totalExpenses,
            transactions,
        }
    },[data])

    return {
        balanceData,
        loading,
        error,
        refetch,
    }
}
