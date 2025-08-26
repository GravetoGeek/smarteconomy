/**
 * 📊 Dashboard Domain Service
 * 
 * Serviço de domínio para agregação de dados financeiros
 * e geração de métricas para dashboards.
 */

export interface FinancialMetrics {
    totalBalance: number
    totalIncome: number
    totalExpenses: number
    netWorth: number
    monthlyGrowth: number
    expensesByCategory: CategoryExpense[]
    recentTransactions: any[]
    accountSummary: AccountSummary[]
}

export interface CategoryExpense {
    categoryId: string
    categoryName: string
    totalAmount: number
    percentage: number
    transactionCount: number
}

export interface AccountSummary {
    accountId: string
    accountName: string
    accountType: string
    balance: number
    lastTransaction: Date | null
}

export interface PeriodComparison {
    currentPeriod: {
        income: number
        expenses: number
        net: number
        transactionCount: number
    }
    previousPeriod: {
        income: number
        expenses: number
        net: number
        transactionCount: number
    }
    growth: {
        incomeGrowth: number
        expenseGrowth: number
        netGrowth: number
        transactionGrowth: number
    }
}

export interface DashboardFilters {
    userId: string
    period: 'week' | 'month' | 'quarter' | 'year'
    dateFrom?: Date
    dateTo?: Date
    accountIds?: string[]
    categoryIds?: string[]
}

export interface DashboardDomainServicePort {
    /**
     * Obtém métricas financeiras completas para o dashboard
     */
    getFinancialMetrics(filters: DashboardFilters): Promise<FinancialMetrics>

    /**
     * Compara métricas entre períodos
     */
    getPeriodComparison(filters: DashboardFilters): Promise<PeriodComparison>

    /**
     * Obtém gastos por categoria com análise
     */
    getCategoryAnalysis(filters: DashboardFilters): Promise<CategoryExpense[]>

    /**
     * Obtém resumo de contas
     */
    getAccountsSummary(userId: string): Promise<AccountSummary[]>

    /**
     * Calcula tendências financeiras
     */
    getFinancialTrends(
        userId: string,
        months: number
    ): Promise<{
        month: string
        income: number
        expenses: number
        net: number
    }[]>

    /**
     * Obtém alertas e notificações financeiras
     */
    getFinancialAlerts(userId: string): Promise<{
        type: 'warning' | 'info' | 'success' | 'danger'
        title: string
        message: string
        actionRequired: boolean
    }[]>
}

export class DashboardDomainService implements DashboardDomainServicePort {
    constructor(
        private readonly transactionRepository: any, // TransactionRepositoryPort
        private readonly accountRepository: any, // AccountRepositoryPort
        private readonly categoryRepository: any // CategoryRepositoryPort
    ) { }

    async getFinancialMetrics(filters: DashboardFilters): Promise<FinancialMetrics> {
        const { dateFrom, dateTo } = this.calculatePeriod(filters.period)

        // Buscar todas as contas do usuário
        const accounts = await this.accountRepository.findByUserId(filters.userId)
        const totalBalance = accounts.reduce((sum: number, account: any) => sum + account.balance, 0)

        // Buscar transações do período
        const transactions = await this.transactionRepository.search({
            filters: {
                accountId: filters.accountIds ? undefined : accounts.map((a: any) => a.id).join(','),
                dateFrom,
                dateTo
            }
        })

        // Calcular métricas
        let totalIncome = 0
        let totalExpenses = 0
        const categoryExpenses = new Map<string, { amount: number; count: number; name: string }>()

        for (const transaction of transactions.items) {
            if (transaction.type === 'INCOME') {
                totalIncome += transaction.amount
            } else if (transaction.type === 'EXPENSE') {
                totalExpenses += transaction.amount

                // Agrupar por categoria
                const existing = categoryExpenses.get(transaction.categoryId) ||
                    { amount: 0, count: 0, name: '' }
                categoryExpenses.set(transaction.categoryId, {
                    amount: existing.amount + transaction.amount,
                    count: existing.count + 1,
                    name: existing.name || await this.getCategoryName(transaction.categoryId)
                })
            }
        }

        // Converter gastos por categoria
        const expensesByCategory: CategoryExpense[] = Array.from(categoryExpenses.entries())
            .map(([categoryId, data]) => ({
                categoryId,
                categoryName: data.name,
                totalAmount: data.amount,
                percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
                transactionCount: data.count
            }))
            .sort((a, b) => b.totalAmount - a.totalAmount)

        // Calcular crescimento mensal (simplificado)
        const monthlyGrowth = await this.calculateMonthlyGrowth(filters.userId)

        // Transações recentes
        const recentTransactions = await this.transactionRepository.getRecentTransactions(
            accounts.map((a: any) => a.id)[0], // Primeira conta por simplicidade
            5
        )

        return {
            totalBalance,
            totalIncome,
            totalExpenses,
            netWorth: totalIncome - totalExpenses,
            monthlyGrowth,
            expensesByCategory,
            recentTransactions,
            accountSummary: accounts.map((account: any) => ({
                accountId: account.id,
                accountName: account.name,
                accountType: account.type,
                balance: account.balance,
                lastTransaction: account.updatedAt
            }))
        }
    }

    async getPeriodComparison(filters: DashboardFilters): Promise<PeriodComparison> {
        const currentPeriod = await this.getPeriodMetrics(filters)

        // Calcular período anterior
        const previousFilters = this.getPreviousPeriodFilters(filters)
        const previousPeriod = await this.getPeriodMetrics(previousFilters)

        return {
            currentPeriod,
            previousPeriod,
            growth: {
                incomeGrowth: this.calculateGrowthPercentage(
                    previousPeriod.income,
                    currentPeriod.income
                ),
                expenseGrowth: this.calculateGrowthPercentage(
                    previousPeriod.expenses,
                    currentPeriod.expenses
                ),
                netGrowth: this.calculateGrowthPercentage(
                    previousPeriod.net,
                    currentPeriod.net
                ),
                transactionGrowth: this.calculateGrowthPercentage(
                    previousPeriod.transactionCount,
                    currentPeriod.transactionCount
                )
            }
        }
    }

    async getCategoryAnalysis(filters: DashboardFilters): Promise<CategoryExpense[]> {
        const metrics = await this.getFinancialMetrics(filters)
        return metrics.expensesByCategory
    }

    async getAccountsSummary(userId: string): Promise<AccountSummary[]> {
        const accounts = await this.accountRepository.findByUserId(userId)

        return Promise.all(accounts.map(async (account: any) => {
            const recentTransactions = await this.transactionRepository.getRecentTransactions(
                account.id,
                1
            )

            return {
                accountId: account.id,
                accountName: account.name,
                accountType: account.type,
                balance: account.balance,
                lastTransaction: recentTransactions.length > 0
                    ? recentTransactions[0].date
                    : null
            }
        }))
    }

    async getFinancialTrends(userId: string, months: number): Promise<any[]> {
        const trends = []
        const now = new Date()

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

            const metrics = await this.getPeriodMetrics({
                userId,
                period: 'month',
                dateFrom: date,
                dateTo: nextDate
            })

            trends.push({
                month: date.toISOString().slice(0, 7), // YYYY-MM
                income: metrics.income,
                expenses: metrics.expenses,
                net: metrics.net
            })
        }

        return trends
    }

    async getFinancialAlerts(userId: string): Promise<any[]> {
        const alerts = []

        // Verificar contas com saldo baixo
        const accounts = await this.accountRepository.findByUserId(userId)
        const lowBalanceAccounts = accounts.filter((account: any) =>
            account.balance < 100 && account.type !== 'CREDIT_CARD'
        )

        if (lowBalanceAccounts.length > 0) {
            alerts.push({
                type: 'warning',
                title: 'Saldo Baixo',
                message: `${lowBalanceAccounts.length} conta(s) com saldo baixo`,
                actionRequired: true
            })
        }

        // Verificar gastos altos no mês
        const currentMonth = await this.getPeriodMetrics({
            userId,
            period: 'month'
        })

        const previousMonth = await this.getPeriodMetrics(
            this.getPreviousPeriodFilters({ userId, period: 'month' })
        )

        if (currentMonth.expenses > previousMonth.expenses * 1.3) {
            alerts.push({
                type: 'danger',
                title: 'Gastos Elevados',
                message: 'Gastos 30% acima do mês anterior',
                actionRequired: true
            })
        }

        return alerts
    }

    private calculatePeriod(period: string): { dateFrom: Date; dateTo: Date } {
        const now = new Date()
        const dateTo = new Date(now)
        let dateFrom = new Date(now)

        switch (period) {
            case 'week':
                dateFrom.setDate(now.getDate() - 7)
                break
            case 'month':
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
                break
            case 'quarter': {
                const quarterStart = Math.floor(now.getMonth() / 3) * 3
                dateFrom = new Date(now.getFullYear(), quarterStart, 1)
                break
            }
            case 'year':
                dateFrom = new Date(now.getFullYear(), 0, 1)
                break
        }

        return { dateFrom, dateTo }
    }

    private async getPeriodMetrics(filters: any): Promise<any> {
        const { dateFrom, dateTo } = filters.dateFrom && filters.dateTo
            ? { dateFrom: filters.dateFrom, dateTo: filters.dateTo }
            : this.calculatePeriod(filters.period)

        const transactions = await this.transactionRepository.search({
            filters: { dateFrom, dateTo }
        })

        let income = 0
        let expenses = 0

        transactions.items.forEach((transaction: any) => {
            if (transaction.type === 'INCOME') {
                income += transaction.amount
            } else if (transaction.type === 'EXPENSE') {
                expenses += transaction.amount
            }
        })

        return {
            income,
            expenses,
            net: income - expenses,
            transactionCount: transactions.items.length
        }
    }

    private getPreviousPeriodFilters(filters: DashboardFilters): DashboardFilters {
        const { dateFrom, dateTo } = this.calculatePeriod(filters.period)
        const diffTime = dateTo.getTime() - dateFrom.getTime()

        return {
            ...filters,
            dateFrom: new Date(dateFrom.getTime() - diffTime),
            dateTo: new Date(dateTo.getTime() - diffTime)
        }
    }

    private calculateGrowthPercentage(previous: number, current: number): number {
        if (previous === 0) return current > 0 ? 100 : 0
        return ((current - previous) / previous) * 100
    }

    private async calculateMonthlyGrowth(userId: string): Promise<number> {
        const currentMonth = await this.getPeriodMetrics({ userId, period: 'month' })
        const previousMonth = await this.getPeriodMetrics(
            this.getPreviousPeriodFilters({ userId, period: 'month' })
        )

        return this.calculateGrowthPercentage(previousMonth.net, currentMonth.net)
    }

    private async getCategoryName(categoryId: string): Promise<string> {
        try {
            const category = await this.categoryRepository.findById(categoryId)
            return category?.name || 'Categoria não encontrada'
        } catch {
            return 'Categoria não encontrada'
        }
    }
}
