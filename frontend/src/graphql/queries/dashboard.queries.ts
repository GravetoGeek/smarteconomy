import { gql } from '@apollo/client';

/**
 * 📊 Dashboard Queries
 * 
 * Queries GraphQL para dados do dashboard
 */

/**
 * Query para obter métricas do dashboard
 * Retorna JSON string com dados agregados
 */
export const DASHBOARD_METRICS = gql`
  query DashboardMetrics(
    $userId: String!
    $period: String
    $dateFrom: String
    $dateTo: String
    $accountIds: [String!]
    $categoryIds: [String!]
  ) {
    dashboardMetrics(
      userId: $userId
      period: $period
      dateFrom: $dateFrom
      dateTo: $dateTo
      accountIds: $accountIds
      categoryIds: $categoryIds
    )
  }
`;

/**
 * Query para obter tendências financeiras
 * Retorna análise de evolução nos últimos meses
 */
export const FINANCIAL_TRENDS = gql`
  query FinancialTrends($userId: String!, $months: Float) {
    financialTrends(userId: $userId, months: $months)
  }
`;

/**
 * Query para obter resumo de contas
 * Retorna saldos e totais de todas as contas
 */
export const ACCOUNTS_SUMMARY = gql`
  query AccountsSummary($userId: String!) {
    accountsSummary(userId: $userId)
  }
`;

/**
 * Query para obter alertas financeiros
 * Retorna avisos sobre gastos, limites, etc
 */
export const FINANCIAL_ALERTS = gql`
  query FinancialAlerts($userId: String!) {
    financialAlerts(userId: $userId)
  }
`;

/**
 * Query para análise por categoria
 * Retorna distribuição de gastos/receitas por categoria
 */
export const CATEGORY_ANALYSIS = gql`
  query CategoryAnalysis($userId: String!, $period: String) {
    categoryAnalysis(userId: $userId, period: $period)
  }
`;

/**
 * Query para comparação entre períodos
 * Retorna comparativo de performance financeira
 */
export const PERIOD_COMPARISON = gql`
  query PeriodComparison($userId: String!, $period: String!) {
    periodComparison(userId: $userId, period: $period)
  }
`;
