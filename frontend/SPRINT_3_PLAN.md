# 🚀 Sprint 3 - GraphQL Migration Plan

## 📋 Objetivo
Migrar todas as telas restantes do frontend de REST para GraphQL, completando a transição iniciada nos Sprints 1 e 2.

## 🎯 Escopo

### ✅ Sprint 1 - Infraestrutura GraphQL (Concluído)
- Apollo Client configurado
- ApolloProvider integrado
- GraphQL folder structure criada

### ✅ Sprint 2 - Auth Implementation (Concluído)
- Mutations: LOGIN, SIGNUP, LOGOUT, REFRESH_TOKEN
- Queries: VALIDATE_TOKEN, ME
- Hooks: useLogin, useSignup, useLogout
- Telas: Login, Register migradas

### 🔄 Sprint 3 - Core Features Migration (Em Progresso)

## 📊 Análise de Telas com REST

### Telas a Migrar:

1. **Dashboard** (`dashboard/index.tsx`)
   - 5 endpoints REST:
     - `GET /profile/byUser/{userId}` → Query: `userById`
     - `GET /account/byProfile/{profileId}` → Query: `accountsByUser`
     - `GET /dashboard/despesasporcategorias` → Query: `dashboardMetrics`
     - `GET /dashboard/rendasporcategorias` → Query: `dashboardMetrics`
     - `GET /transactiontypes` → Pode ser hardcoded ou usar enums

2. **List Transactions** (`listTransactions/index.tsx`)
   - 2 endpoints REST:
     - `POST /transaction/filter` → Query: `searchTransactions`
     - `GET /category` → Query: `categories`

3. **Manage Transaction** (`manageTransaction/index.tsx`)
   - 3 endpoints REST:
     - `GET /account/byProfile/{profileId}` → Query: `accountsByUser`
     - `POST /category/filter` → Query: `categories` (com filtro)
     - `PUT /transaction/{id}` → Mutation: `updateTransaction`

4. **Add Account** (`addAccount/index.tsx`)
   - 2 endpoints REST:
     - `GET /accounttypes` → Pode ser hardcoded ou enum
     - `POST /account` → Mutation: `createAccount`

5. **Manage Profile** (`manageProfile/index.tsx`)
   - 2 endpoints REST:
     - `GET /profile/{id}` → Query: `userById`
     - `GET /profile/byUser/{userId}` → Query: `userById`

## 🏗️ Estrutura de Arquivos a Criar

### Queries:
```
frontend/src/graphql/queries/
  ├── auth.queries.ts (✅ criado)
  ├── lookup.queries.ts (✅ criado)
  ├── dashboard.queries.ts (⬜ criar)
  ├── transactions.queries.ts (⬜ criar)
  ├── accounts.queries.ts (⬜ criar)
  ├── categories.queries.ts (⬜ criar)
  └── users.queries.ts (⬜ criar)
```

### Mutations:
```
frontend/src/graphql/mutations/
  ├── auth.mutations.ts (✅ criado)
  ├── transactions.mutations.ts (⬜ criar)
  ├── accounts.mutations.ts (⬜ criar)
  └── users.mutations.ts (⬜ criar)
```

### Custom Hooks (se necessário):
```
frontend/src/hooks/
  ├── auth/ (✅ criado - useLogin, useSignup, useLogout)
  ├── transactions/ (⬜ criar - useCreateTransaction, useUpdateTransaction)
  ├── accounts/ (⬜ criar - useCreateAccount)
  └── dashboard/ (⬜ criar - useDashboardMetrics)
```

## 📝 Mapeamento Backend GraphQL Schema

### Queries Disponíveis:
- ✅ `hello: String!`
- ✅ `users: [User!]!`
- ✅ `userById(id: String!): User`
- ✅ `userByEmail(email: String!): User`
- ✅ `searchUsers(input: SearchUsersInput!): SearchResult!`
- ✅ `accountsByUser(userId: String!): [Account!]!`
- ✅ `accountById(id: String!): Account`
- ✅ `genders: [GenderModel!]!` (já usado)
- ✅ `gender(id: String!): GenderModel!`
- ✅ `professions: [ProfessionModel!]!` (já usado)
- ✅ `profession(id: String!): ProfessionModel!`
- ✅ `searchTransactions(userId: String!, input: SearchTransactionsInput): TransactionSearchResult!`
- ✅ `transactionSummary(accountId: String!, dateFrom: DateTime!, dateTo: DateTime!): TransactionSummary!`
- ✅ `categories: [Category!]!`
- ✅ `category(id: String!): Category!`
- ✅ `dashboardMetrics(...): String!`
- ✅ `financialTrends(userId: String!, months: Float): String!`
- ✅ `accountsSummary(userId: String!): String!`
- ✅ `financialAlerts(userId: String!): String!`
- ✅ `categoryAnalysis(userId: String!, period: String): String!`
- ✅ `periodComparison(userId: String!, period: String!): String!`
- ✅ `validateToken(input: ValidateTokenInput!): ValidateTokenResponse!`

### Mutations Disponíveis:
- ✅ `createUser(input: CreateUserInput!): User!`
- ✅ `updateUser(id: String!, input: UpdateUserInput!): UpdateUserResponse!`
- ✅ `deleteUser(id: String!): DeleteUserResponse!`
- ✅ `createAccount(input: CreateAccountInput!): Account!`
- ✅ `createGender(input: CreateGenderInput!): GenderModel!`
- ✅ `createProfession(input: CreateProfessionInput!): ProfessionModel!`
- ✅ `createTransaction(input: CreateTransactionInput!): CreateTransactionResponse!`
- ✅ `updateTransaction(id: String!, input: UpdateTransactionInput!): Transaction!`
- ✅ `reverseTransaction(transactionId: String!, reason: String!, requestedBy: String!): Transaction!`
- ✅ `createCategory(input: CreateCategoryInput!): Category!`
- ✅ `login(input: LoginInput!): AuthResponse!` (já usado)
- ✅ `signup(input: SignupInput!): AuthResponse!` (já usado)
- ✅ `refreshToken(input: RefreshTokenInput!): AuthResponse!`
- ✅ `logout(input: LogoutInput!): LogoutResponse!` (já usado)

## 🎯 Priorização (Ordem de Implementação)

### Fase 1 - Queries Básicas (Começar aqui)
1. ✅ **Categories** - Mais simples, sem dependências
   - Criar `categories.queries.ts`
   - GET categories, GET category(id)

2. ✅ **Accounts** - Necessário para transactions
   - Criar `accounts.queries.ts`
   - accountsByUser, accountById

3. ✅ **Users** - Necessário para profile
   - Criar `users.queries.ts`
   - userById, userByEmail

### Fase 2 - Queries Complexas
4. ✅ **Transactions**
   - Criar `transactions.queries.ts`
   - searchTransactions, transactionSummary

5. ✅ **Dashboard**
   - Criar `dashboard.queries.ts`
   - dashboardMetrics, financialTrends, accountsSummary

### Fase 3 - Mutations
6. ✅ **Accounts Mutations**
   - Criar `accounts.mutations.ts`
   - createAccount

7. ✅ **Transactions Mutations**
   - Criar `transactions.mutations.ts`
   - createTransaction, updateTransaction, reverseTransaction

8. ✅ **Users Mutations** (se necessário)
   - Criar `users.mutations.ts`
   - updateUser, deleteUser

### Fase 4 - Refatoração de Telas
9. ✅ **AddAccount Screen**
   - Migrar de fetch() para useQuery + useMutation

10. ✅ **ListTransactions Screen**
    - Migrar de fetch() para useQuery

11. ✅ **ManageTransaction Screen**
    - Migrar de fetch() para useQuery + useMutation

12. ✅ **Dashboard Screen**
    - Migrar de fetch() para useQuery

13. ✅ **ManageProfile Screen**
    - Migrar de fetch() para useQuery + useMutation

### Fase 5 - Testes e Validação
14. ✅ Testar todas as telas no emulador
15. ✅ Verificar persistência de dados
16. ✅ Validar navegação entre telas
17. ✅ Commit final do Sprint 3

## 📦 Dependências Removidas ao Final

Após migração completa, poderemos remover:
- ❌ `@env` (BACKEND_HOST, BACKEND_PORT) - usar apenas GraphQL endpoint
- ❌ Chamadas `fetch()` diretas
- ❌ `axios` (se não usado em outros lugares)

## 🚦 Status Atual

- Sprint 1: ✅ 100% Completo
- Sprint 2: ✅ 100% Completo
- Sprint 3: 🔄 0% (10 tarefas pendentes)

## 📅 Timeline Estimado

- Fase 1 (Queries Básicas): ~1-2 horas
- Fase 2 (Queries Complexas): ~1-2 horas
- Fase 3 (Mutations): ~1-2 horas
- Fase 4 (Refatoração Telas): ~3-4 horas
- Fase 5 (Testes): ~1 hora

**Total estimado**: 7-11 horas

## 🎯 Próximos Passos Imediatos

1. Criar `categories.queries.ts` (mais simples)
2. Criar `accounts.queries.ts` 
3. Criar `users.queries.ts`
4. Testar queries isoladamente via Apollo DevTools
5. Começar refatoração da tela mais simples (AddAccount)

---

**Preparado para começar Sprint 3!** 🚀
