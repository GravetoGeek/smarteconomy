# 🚀 Guia Rápido - SmartEconomy Backend

## 📋 Funcionalidades Implementadas

### ✅ Módulos Prontos

- 👥 **Users** - Gestão completa de usuários
- 💰 **Accounts** - Gestão de contas com atualização de saldo
- 💸 **Transactions** - Transações com integração automática de saldo
- 📊 **Dashboard** - Métricas financeiras em tempo real
- 🔐 **Auth** - Autenticação JWT completa
- 🏷️ **Categories** - Categorias de transações
- ⚧️ **Gender** - Gêneros cadastrados
- 💼 **Profession** - Profissões do CBO

---

## 🏃 Como Executar

### 1. Iniciar Backend (Docker)

```bash
cd backend
docker compose up
```

### 2. Acessos

- **API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: http://localhost:5555
- **Database**: localhost:5432

---

## 📡 Principais Operações GraphQL

### 🔐 Autenticação

#### Login

```graphql
mutation {
    login(input: { email: "usuario@email.com", password: "senha123" }) {
        accessToken
        refreshToken
        user {
            id
            email
            name
        }
    }
}
```

#### Signup

```graphql
mutation {
    signup(
        input: {
            email: "novo@email.com"
            password: "Senha@123"
            name: "João"
            lastname: "Silva"
            birthdate: "1990-01-01"
            genderId: "uuid-gender"
            professionId: "uuid-profession"
        }
    ) {
        accessToken
        user {
            id
            email
        }
    }
}
```

---

### 💰 Contas

#### Criar Conta

```graphql
mutation {
    createAccount(
        input: {
            name: "Conta Corrente"
            type: CHECKING
            balance: 1000.00
            userId: "uuid-do-usuario"
        }
    ) {
        id
        name
        balance
        type
    }
}
```

#### Listar Contas do Usuário

```graphql
query {
    accountsByUser(userId: "uuid-do-usuario") {
        id
        name
        balance
        type
        status
        createdAt
    }
}
```

---

### 💸 Transações

#### Criar Receita (Income)

```graphql
mutation {
    createTransaction(
        input: {
            description: "Salário Mensal"
            amount: 5000.00
            type: INCOME
            accountId: "uuid-da-conta"
            categoryId: "uuid-categoria-salario"
        }
    ) {
        transaction {
            id
            description
            amount
            type
            status
        }
        warnings
    }
}
```

#### Criar Despesa (Expense)

```graphql
mutation {
    createTransaction(
        input: {
            description: "Mercado"
            amount: 350.50
            type: EXPENSE
            accountId: "uuid-da-conta"
            categoryId: "uuid-categoria-alimentacao"
            date: "2025-10-12"
        }
    ) {
        transaction {
            id
            description
            amount
            status
        }
        warnings
    }
}
```

#### Transferência entre Contas

```graphql
mutation {
    createTransaction(
        input: {
            description: "Transferência para Poupança"
            amount: 1000.00
            type: TRANSFER
            accountId: "uuid-conta-origem"
            categoryId: "uuid-categoria-transferencia"
            destinationAccountId: "uuid-conta-destino"
        }
    ) {
        transaction {
            id
            type
            status
        }
        warnings
    }
}
```

#### Buscar Transações

```graphql
query {
    searchTransactions(
        userId: "uuid-do-usuario"
        input: {
            filters: {
                type: EXPENSE
                dateFrom: "2025-10-01"
                dateTo: "2025-10-31"
            }
            page: 1
            limit: 10
            sortBy: "date"
            sortOrder: "desc"
        }
    ) {
        transactions {
            id
            description
            amount
            type
            date
        }
        total
        page
        totalPages
    }
}
```

#### Resumo Financeiro

```graphql
query {
    transactionSummary(userId: "uuid-do-usuario", period: "current_month") {
        totalIncome
        totalExpense
        totalTransfer
        balance
        period
    }
}
```

---

### 📊 Dashboard

#### Métricas do Dashboard

```graphql
query {
    getDashboardMetrics(
        filters: { userId: "uuid-do-usuario", period: "month" }
    ) {
        totalBalance
        totalIncome
        totalExpenses
        netWorth
        monthlyGrowth
        expensesByCategory {
            categoryName
            totalAmount
            percentage
        }
    }
}
```

#### Tendências Financeiras

```graphql
query {
    getFinancialTrends(userId: "uuid-do-usuario", months: 6) {
        month
        income
        expenses
        net
    }
}
```

---

## 🔄 Fluxos Comuns

### 1. Novo Usuário - Fluxo Completo

```graphql
# 1. Signup
mutation Signup {
  signup(input: { ... }) {
    accessToken
    user { id }
  }
}

# 2. Criar primeira conta
mutation CreateAccount {
  createAccount(input: {
    name: "Carteira"
    type: WALLET
    balance: 0
    userId: $userId
  }) {
    id
  }
}

# 3. Adicionar receita inicial
mutation AddIncome {
  createTransaction(input: {
    description: "Saldo inicial"
    amount: 1000
    type: INCOME
    accountId: $accountId
    categoryId: $categoryId
  }) {
    transaction { id }
  }
}
```

### 2. Registrar Gasto Diário

```graphql
mutation RegisterExpense {
    createTransaction(
        input: {
            description: "Almoço"
            amount: 25.00
            type: EXPENSE
            accountId: "minha-conta-id"
            categoryId: "categoria-alimentacao-id"
        }
    ) {
        transaction {
            id
            status
        }
        warnings
    }
}
```

### 3. Ver Situação Financeira

```graphql
# Resumo do mês
query MonthSummary {
    transactionSummary(userId: $userId, period: "current_month") {
        totalIncome
        totalExpense
        balance
    }
}

# Contas
query MyAccounts {
    accountsByUser(userId: $userId) {
        name
        balance
        type
    }
}
```

---

## 🔍 Filtros Avançados

### Busca com Múltiplos Filtros

```graphql
query AdvancedSearch {
  searchTransactions(
    userId: "uuid"
    input: {
      filters: {
        accountId: "conta-especifica"
        type: EXPENSE
        dateFrom: "2025-10-01"
        dateTo: "2025-10-31"
        minAmount: 50.00
        maxAmount: 500.00
        searchTerm: "mercado"
      }
      page: 1
      limit: 20
      sortBy: "amount"
      sortOrder: "desc"
    }
  ) {
    transactions { ... }
    total
  }
}
```

---

## ⚡ Validações Automáticas

### O que é Validado

#### Transações

- ✅ Valor mínimo: R$ 0,01
- ✅ Descrição: máx 255 caracteres
- ✅ Saldo suficiente para despesas
- ✅ Conta destino válida para transferências
- ✅ UUIDs válidos para IDs

#### Contas

- ✅ Nome único por usuário
- ✅ Tipo de conta válido
- ✅ Saldo não pode ficar negativo (exceto cartão de crédito)

#### Usuários

- ✅ Email único e válido
- ✅ Senha forte (min 8 chars, 1 número, 1 maiúscula, 1 especial)
- ✅ Idade entre 13-120 anos

---

## 🐛 Tratamento de Erros

### Erros Comuns e Soluções

#### Saldo Insuficiente

```json
{
    "errors": [
        {
            "message": "Saldo insuficiente"
        }
    ]
}
```

**Solução**: Verificar saldo da conta antes da transação

#### Conta Não Encontrada

```json
{
    "errors": [
        {
            "message": "Conta não encontrada: uuid-invalido"
        }
    ]
}
```

**Solução**: Verificar se o accountId está correto

#### Validação Falhou

```json
{
    "errors": [
        {
            "message": "Valor deve ser maior que zero"
        }
    ]
}
```

**Solução**: Ajustar valores conforme validações

---

## 📊 Tipos de Enum

### TransactionType

- `INCOME` - Receita
- `EXPENSE` - Despesa
- `TRANSFER` - Transferência

### TransactionStatus

- `PENDING` - Pendente
- `COMPLETED` - Completada
- `CANCELLED` - Cancelada
- `FAILED` - Falhou

### AccountType

- `CHECKING` - Conta Corrente
- `SAVINGS` - Poupança
- `INVESTMENT` - Investimento
- `CREDIT_CARD` - Cartão de Crédito
- `WALLET` - Carteira

### AccountStatus

- `ACTIVE` - Ativa
- `INACTIVE` - Inativa

---

## 🔐 Headers de Autenticação

Para rotas protegidas, adicione o header:

```
Authorization: Bearer {seu-access-token}
```

No GraphQL Playground:

```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 📝 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smarteconomy"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"
```

---

## 🧪 Testando o Sistema

### 1. Health Check

```graphql
query {
    hello
}
```

### 2. Testar Autenticação

```bash
# Login
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { login(input: {...}) { accessToken } }"}'
```

### 3. Testar Transação

```graphql
# Com autenticação
mutation {
    createTransaction(
        input: {
            description: "Teste"
            amount: 10.00
            type: INCOME
            accountId: "..."
            categoryId: "..."
        }
    ) {
        transaction {
            id
        }
    }
}
```

---

## 📚 Próximos Passos

1. ✅ Executar testes de integração
2. ✅ Popular banco com dados de exemplo
3. ✅ Testar fluxos completos no Playground
4. ✅ Integrar com frontend
5. ✅ Adicionar mais categorias

---

## 🆘 Suporte

### Documentação Completa

- `backend/README.md` - Documentação principal
- `backend/IMPLEMENTACOES_FINALIZADAS.md` - Funcionalidades implementadas
- `backend/docs/` - Documentação técnica

### Logs

```bash
# Ver logs do Docker
docker compose logs -f backend

# Ver logs do banco
docker compose logs -f db
```

---

**🎉 Sistema Pronto para Uso!**

Desenvolvido com ❤️ para o TCC SmartEconomy
