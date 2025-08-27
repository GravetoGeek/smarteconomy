# 📊 API GraphQL - SmartEconomy Backend

## 📋 **Visão Geral**

Esta documentação apresenta todos os endpoints GraphQL disponíveis na API SmartEconomy, organizados por módulo e funcionalidade. Todos os endpoints seguem o padrão GraphQL com validações robustas e tratamento de erros profissional.

## 🔗 **Endpoints Principais**

- **Playground GraphQL**: http://localhost:3000/graphql
- **Endpoint API**: http://localhost:3000/graphql (POST)
- **Introspection**: Habilitada para desenvolvimento

## 📚 **Índice de Módulos**

- [🔐 Authentication](#-authentication)
- [👥 Users](#-users)
- [💰 Accounts](#-accounts)
- [💳 Transactions](#-transactions)
- [📊 Dashboards](#-dashboards)
- [📂 Categories](#-categories)
- [⚧ Gender](#-gender)
- [💼 Profession](#-profession)

---

## 🔐 **Authentication**

### **Mutations**

#### `login(input: LoginInput!): AuthResponse!`
Autentica usuário no sistema e retorna tokens JWT.

**Input:**
```graphql
input LoginInput {
  email: String!        # Email do usuário
  password: String!     # Senha em texto plano
}
```

**Response:**
```graphql
type AuthResponse {
  accessToken: String!  # JWT para autenticação
  refreshToken: String! # Token para renovação
  expiresIn: Float!     # Tempo de expiração em segundos
  tokenType: String!    # Tipo do token (Bearer)
  user: AuthUser!       # Dados básicos do usuário
}

type AuthUser {
  id: String!
  email: String!
  role: String!         # USER | ADMIN
}
```

**Exemplo:**
```graphql
mutation {
  login(input: {
    email: "admin@smarteconomy.com"
    password: "Admin123456!"
  }) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      role
    }
  }
}
```

#### `refreshToken(input: RefreshTokenInput!): AuthResponse!`
Renova token de acesso usando refresh token.

**Input:**
```graphql
input RefreshTokenInput {
  refreshToken: String! # Token de renovação
}
```

#### `logout(input: LogoutInput!): LogoutResponse!`
Invalida token de acesso atual.

**Input:**
```graphql
input LogoutInput {
  accessToken: String!  # Token a ser invalidado
}
```

**Response:**
```graphql
type LogoutResponse {
  success: Boolean!
  message: String!
}
```

### **Queries**

#### `validateToken(input: ValidateTokenInput!): ValidateTokenResponse!`
Valida se um token de acesso está válido.

**Input:**
```graphql
input ValidateTokenInput {
  accessToken: String!
}
```

**Response:**
```graphql
type ValidateTokenResponse {
  valid: Boolean!
  user: AuthUser        # Dados do usuário se válido
}
```

---

## 👥 **Users**

### **Queries**

#### `users: [User!]!`
Lista todos os usuários cadastrados.

#### `userById(id: String!): User`
Busca usuário específico por ID.

#### `userByEmail(email: String!): User`
Busca usuário por endereço de email.

#### `searchUsers(input: SearchUsersInput!): SearchResult!`
Busca avançada de usuários com filtros e paginação.

**Input:**
```graphql
input SearchUsersInput {
  page: Int!            # Página atual (1-based)
  limit: Int!           # Itens por página
  filter: String        # Filtro de busca (nome, email)
  sort: String          # Campo para ordenação
  sortDirection: String # ASC | DESC
}
```

**Response:**
```graphql
type SearchResult {
  items: [User!]!       # Lista de usuários
  total: Int!           # Total de registros
  currentPage: Int!     # Página atual
  limit: Int!           # Itens por página
  totalPages: Int!      # Total de páginas
  lastPage: Int!        # Última página
}
```

### **Mutations**

#### `createUser(input: CreateUserInput!): User!`
Cria novo usuário no sistema.

**Input:**
```graphql
input CreateUserInput {
  email: String!        # Email único
  name: String!         # Primeiro nome
  lastname: String!     # Sobrenome
  birthdate: String!    # Data nascimento (YYYY-MM-DD)
  role: String!         # USER | ADMIN
  genderId: String!     # ID do gênero
  professionId: String! # ID da profissão
  profileId: String     # ID do perfil (opcional)
  password: String!     # Senha (min 8 caracteres)
}
```

#### `updateUser(id: String!, input: UpdateUserInput!): UpdateUserResponse!`
Atualiza dados de usuário existente.

**Input:**
```graphql
input UpdateUserInput {
  email: String
  name: String!
  lastname: String!
  birthdate: String
  role: String
  genderId: String!
  professionId: String!
  profileId: String
  password: String!     # Para alteração de senha
}
```

**Response:**
```graphql
type UpdateUserResponse {
  success: Boolean!
  user: User            # Dados atualizados
  message: String!
}
```

#### `deleteUser(id: String!): DeleteUserResponse!`
Remove usuário do sistema.

**Response:**
```graphql
type DeleteUserResponse {
  success: Boolean!
  message: String!
}
```

### **User Type**

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  role: String!         # USER | ADMIN
  genderId: String!
  professionId: String!
  profileId: String     # Pode ser null
  status: String!       # ACTIVE | INACTIVE | SUSPENDED
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

## 💰 **Accounts**

### **Queries**

#### `accountsByUser(userId: String!): [Account!]!`
Lista todas as contas de um usuário específico.

#### `accountById(id: String!): Account`
Busca conta específica por ID.

### **Mutations**

#### `createAccount(input: CreateAccountInput!): Account!`
Cria nova conta financeira.

**Input:**
```graphql
input CreateAccountInput {
  name: String!         # Nome da conta
  type: String!         # CHECKING | SAVINGS | INVESTMENT | CREDIT_CARD | WALLET
  balance: Float        # Saldo inicial (padrão: 0.00)
  userId: String!       # ID do usuário proprietário
}
```

### **Account Type**

```graphql
type Account {
  id: ID!
  name: String!         # Nome da conta
  type: String!         # Tipo da conta
  balance: Float!       # Saldo atual
  userId: String!       # ID do proprietário
  status: String!       # ACTIVE | INACTIVE | SUSPENDED
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Tipos de Conta:**
- `CHECKING`: Conta Corrente
- `SAVINGS`: Conta Poupança
- `INVESTMENT`: Conta de Investimentos
- `CREDIT_CARD`: Cartão de Crédito
- `WALLET`: Carteira Digital

---

## 💳 **Transactions**

### **Queries**

#### `searchTransactions(userId: String!, filters: String, sortBy: String, sortOrder: String, page: Float, limit: Float): String!`
Busca avançada de transações com filtros complexos.

**Parâmetros:**
- `userId`: ID do usuário
- `filters`: JSON com filtros (tipo, período, categoria, etc.)
- `sortBy`: Campo para ordenação (date, amount, type)
- `sortOrder`: Direção (ASC | DESC)
- `page`: Página atual
- `limit`: Itens por página

**Exemplo de Filtros:**
```json
{
  "type": ["INCOME", "EXPENSE"],
  "status": ["COMPLETED"],
  "categoryId": ["cat_123"],
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31",
  "amountMin": 100,
  "amountMax": 1000
}
```

#### `transactionById(id: String!): String`
Busca transação específica por ID.

#### `transactionsByAccount(accountId: String!): [String!]!`
Lista todas as transações de uma conta específica.

#### `transactionSummary(accountId: String!, dateFrom: String!, dateTo: String!): String!`
Gera resumo financeiro de uma conta em período específico.

### **Mutations**

#### `createTransaction(input: CreateTransactionInput!): Transaction!`
Cria nova transação financeira.

**Input:**
```graphql
input CreateTransactionInput {
  description: String!      # Descrição da transação
  amount: Float!           # Valor (sempre positivo)
  type: TransactionType!   # INCOME | EXPENSE | TRANSFER
  accountId: String!       # Conta de origem
  categoryId: String!      # Categoria
  destinationAccountId: String # Obrigatório para TRANSFER
  date: String            # Data customizada (ISO 8601)
}

enum TransactionType {
  INCOME      # Receita
  EXPENSE     # Despesa
  TRANSFER    # Transferência
}
```

#### `updateTransaction(id: String!, input: UpdateTransactionInput!): Transaction!`
Atualiza transação existente (apenas PENDING).

**Input:**
```graphql
input UpdateTransactionInput {
  description: String     # Nova descrição
  status: TransactionStatus # Novo status
}

enum TransactionStatus {
  PENDING     # Pendente
  COMPLETED   # Concluída
  CANCELLED   # Cancelada
  FAILED      # Falhou
}
```

#### `completeTransaction(id: String!): Transaction!`
Marca transação como concluída e atualiza saldos.

#### `cancelTransaction(id: String!): Transaction!`
Cancela transação pendente.

#### `reverseTransaction(id: String!, reason: String): Transaction!`
Reverte transação completada (até 30 dias).

---

## 📊 **Dashboards**

### **Queries**

#### `dashboardMetrics(userId: String!, period: String, dateFrom: String, dateTo: String, accountIds: [String!], categoryIds: [String!]): String!`
Obtém métricas financeiras completas.

**Parâmetros:**
- `period`: week | month | quarter | year
- `dateFrom/dateTo`: Período customizado
- `accountIds`: Filtrar por contas específicas
- `categoryIds`: Filtrar por categorias específicas

**Response (JSON):**
```json
{
  "totalBalance": 15750.50,
  "totalIncome": 5000.00,
  "totalExpenses": 3250.75,
  "netWorth": 1749.25,
  "monthlyGrowth": 12.5,
  "expensesByCategory": [
    {
      "categoryId": "cat_food",
      "categoryName": "Alimentação",
      "totalAmount": 1200.00,
      "percentage": 36.9,
      "transactionCount": 15
    }
  ],
  "accountSummary": [
    {
      "accountId": "acc_123",
      "accountName": "Conta Corrente",
      "accountType": "CHECKING",
      "balance": 5750.50,
      "lastTransaction": "2024-03-15T10:30:00Z"
    }
  ]
}
```

#### `financialTrends(userId: String!, months: Float): String!`
Analisa tendências financeiras ao longo do tempo.

**Response (JSON):**
```json
[
  {
    "month": "2024-01",
    "income": 4500.00,
    "expenses": 3200.00,
    "net": 1300.00
  },
  {
    "month": "2024-02",
    "income": 4800.00,
    "expenses": 3100.00,
    "net": 1700.00
  }
]
```

#### `accountsSummary(userId: String!): String!`
Resumo consolidado de todas as contas.

#### `financialAlerts(userId: String!): String!`
Alertas e notificações financeiras inteligentes.

**Response (JSON):**
```json
[
  {
    "type": "warning",
    "title": "Saldo Baixo",
    "message": "Conta Poupança com saldo abaixo de R$ 100",
    "actionRequired": true
  },
  {
    "type": "danger",
    "title": "Gastos Elevados",
    "message": "Gastos em alimentação 40% acima da média",
    "actionRequired": true
  }
]
```

#### `categoryAnalysis(userId: String!, period: String): String!`
Análise detalhada por categoria.

#### `periodComparison(userId: String!, period: String!): String!`
Comparação entre períodos atual e anterior.

---

## 📂 **Categories**

### **Queries**

#### `categories: [Category!]!`
Lista todas as categorias disponíveis.

#### `category(id: String!): Category!`
Busca categoria específica por ID.

### **Mutations**

#### `createCategory(input: CreateCategoryInput!): Category!`
Cria nova categoria.

**Input:**
```graphql
input CreateCategoryInput {
  category: String!     # Nome da categoria
}
```

### **Category Type**

```graphql
type Category {
  id: String!
  category: String!     # Nome da categoria
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Categorias Sugeridas:**
- Alimentação
- Transporte
- Moradia
- Lazer
- Saúde
- Educação
- Transferência

---

## ⚧ **Gender**

### **Queries**

#### `genders: [GenderModel!]!`
Lista todos os gêneros disponíveis.

#### `gender(id: String!): GenderModel!`
Busca gênero específico por ID.

### **Mutations**

#### `createGender(input: CreateGenderInput!): GenderModel!`
Cria novo gênero.

**Input:**
```graphql
input CreateGenderInput {
  gender: String!       # Nome do gênero
}
```

### **GenderModel Type**

```graphql
type GenderModel {
  id: ID!
  gender: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

## 💼 **Profession**

### **Queries**

#### `professions: [ProfessionModel!]!`
Lista todas as profissões disponíveis.

#### `profession(id: String!): ProfessionModel!`
Busca profissão específica por ID.

### **Mutations**

#### `createProfession(input: CreateProfessionInput!): ProfessionModel!`
Cria nova profissão.

**Input:**
```graphql
input CreateProfessionInput {
  profession: String!   # Nome da profissão
}
```

### **ProfessionModel Type**

```graphql
type ProfessionModel {
  id: ID!
  profession: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

## 🎯 **Basic Queries**

### `hello: String!`
Query básica para testar conectividade da API.

---

## 🔧 **Configurações Globais**

### **Headers Obrigatórios**
```
Content-Type: application/json
```

### **Headers de Autenticação (quando necessário)**
```
Authorization: Bearer <access_token>
```

### **Formato de Datas**
- ISO 8601: `2024-03-15T14:30:00Z`
- Data simples: `2024-03-15`

### **Formato de Valores Monetários**
- Sempre em ponto decimal: `1234.56`
- Máximo 2 casas decimais
- Valores sempre positivos (exceto em contextos específicos)

### **Códigos de Status HTTP**
- `200`: Sucesso
- `400`: Erro de validação ou GraphQL
- `401`: Não autenticado
- `403`: Sem permissão
- `500`: Erro interno do servidor

### **Tratamento de Erros**

**Formato de Erro GraphQL:**
```json
{
  "errors": [
    {
      "message": "Mensagem de erro clara",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "field": "email"
      }
    }
  ],
  "data": null
}
```

**Tipos de Erro:**
- `VALIDATION_ERROR`: Erro de validação de entrada
- `AUTHENTICATION_ERROR`: Erro de autenticação
- `AUTHORIZATION_ERROR`: Erro de autorização
- `NOT_FOUND`: Recurso não encontrado
- `BUSINESS_RULE_ERROR`: Violação de regra de negócio
- `INTERNAL_SERVER_ERROR`: Erro interno

---

## 📝 **Exemplos de Uso Completo**

### **Fluxo de Cadastro Completo**

1. **Obter dados de apoio:**
```graphql
query {
  genders { id gender }
  professions { id profession }
  categories { id category }
}
```

2. **Criar usuário:**
```graphql
mutation {
  createUser(input: {
    email: "joao@example.com"
    name: "João"
    lastname: "Silva"
    birthdate: "1990-01-15"
    role: "USER"
    genderId: "gender_id_aqui"
    professionId: "profession_id_aqui"
    password: "MinhaSenh@123"
  }) {
    id
    email
    name
  }
}
```

3. **Criar contas:**
```graphql
mutation {
  createAccount(input: {
    name: "Conta Corrente"
    type: "CHECKING"
    balance: 1500.00
    userId: "user_id_aqui"
  }) {
    id
    name
    balance
  }
}
```

### **Fluxo de Transações**

1. **Criar receita:**
```graphql
mutation {
  createTransaction(input: {
    description: "Salário"
    amount: 5000.00
    type: INCOME
    accountId: "account_id_aqui"
    categoryId: "category_id_aqui"
  }) {
    id
    status
  }
}
```

2. **Completar transação:**
```graphql
mutation {
  completeTransaction(id: "transaction_id_aqui") {
    id
    status
    updatedAt
  }
}
```

### **Dashboard Completo**

```graphql
query {
  dashboardMetrics(userId: "user_id_aqui", period: "month")
  financialTrends(userId: "user_id_aqui", months: 6)
  financialAlerts(userId: "user_id_aqui")
  categoryAnalysis(userId: "user_id_aqui", period: "month")
}
```

---

Esta documentação cobre todos os endpoints disponíveis na API GraphQL SmartEconomy. Para testes práticos, use o GraphQL Playground em `http://localhost:3000/graphql` ou importe a collection do Postman disponível no repositório.
