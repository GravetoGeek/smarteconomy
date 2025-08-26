# 📊 API GraphQL

> **Documentação Completa da API GraphQL do SmartEconomy Backend**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Quick Start](#-quick-start)
- [📊 Schema GraphQL](#-schema-graphql)
- [🔍 Queries](#-queries)
- [✏️ Mutations](#️-mutations)
- [📝 Types](#-types)
- [🔧 Resolvers](#-resolvers)
- [🧪 Testando a API](#-testando-a-api)
- [📚 Exemplos Práticos](#-exemplos-práticos)
- [⚠️ Tratamento de Erros](#️-tratamento-de-erros)
- [🔒 Autenticação](#-autenticação)
- [📈 Performance](#-performance)

## 🎯 **Visão Geral**

A **API GraphQL** do SmartEconomy Backend oferece uma interface moderna e flexível para acesso aos dados do sistema. Construída com **Apollo Server** e **NestJS**, a API segue os princípios da arquitetura hexagonal e DDD.

### **Características Principais**

- ✅ **Schema auto-gerado** a partir dos resolvers
- ✅ **Validação robusta** com class-validator
- ✅ **Tratamento de erros** consistente
- ✅ **Logging estruturado** para todas as operações
- ✅ **Performance otimizada** com DataLoader
- ✅ **Documentação interativa** com GraphQL Playground

### **Endpoints Disponíveis**

- **GraphQL Playground**: http://localhost:3000/graphql
- **GraphQL Endpoint**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/health

## 🚀 **Quick Start**

### **1. Acesse o GraphQL Playground**

```bash
# Inicie o projeto
docker-compose up -d

# Acesse o playground
open http://localhost:3000/graphql
```

### **2. Teste uma Query Simples**

```graphql
query {
  hello
}
```

### **3. Explore o Schema**

No GraphQL Playground, clique em **"DOCS"** para explorar:
- **Types**: Todos os tipos disponíveis
- **Queries**: Operações de leitura
- **Mutations**: Operações de escrita

## 📊 **Schema GraphQL**

### **Schema Principal**

```graphql
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Gender {
  id: ID!
  gender: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Profession {
  id: ID!
  profession: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type User {
  id: ID!
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  role: String!
  genderId: String
  professionId: String
  profileId: String
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Account {
  id: ID!
  name: String!
  type: String!
  balance: Float!
  userId: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type SearchResult {
  items: [User!]!
  total: Int!
  currentPage: Int!
  limit: Int!
  totalPages: Int!
  lastPage: Int!
}

type Query {
  hello: String!
  users: [User!]!
  userById(id: String!): User
  userByEmail(email: String!): User
  searchUsers(input: SearchUsersInput!): SearchResult!
  
  # 💰 Contas Financeiras
  accountsByUser(userId: String!): [Account!]!
  accountById(id: String!): Account
  
  genders: [Gender!]!
  professions: [Profession!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: String!, input: UpdateUserInput!): User
  deleteUser(id: String!): Boolean!
  
  # 💰 Contas Financeiras
  createAccount(input: CreateAccountInput!): Account!
}

input SearchUsersInput {
  page: Int = 1
  limit: Int = 10
  filter: String
  sort: String
  sortDirection: String = "asc"
}

input CreateUserInput {
  email: String!
  name: String!
  lastname: String!
  birthdate: String!
  role: String!
  genderId: String!
  professionId: String!
  password: String!
}

input UpdateUserInput {
  email: String
  name: String
  lastname: String
  password: String
}

input CreateAccountInput {
  name: String!
  type: String!
  balance: Float
  userId: String!
}

scalar DateTime
```

### **Tipos de Dados**

#### **Scalars**
- **ID**: Identificador único
- **String**: Texto
- **Int**: Número inteiro
- **Boolean**: Valor booleano
- **DateTime**: Data e hora

#### **Enums**
```typescript
enum UserRole {
  USER = 'USER'
  ADMIN = 'ADMIN'
}

enum AccountStatus {
  ACTIVE = 'ACTIVE'
  INACTIVE = 'INACTIVE'
  SUSPENDED = 'SUSPENDED'
}

enum AccountType {
  CHECKING = 'CHECKING'       // Conta Corrente
  SAVINGS = 'SAVINGS'         // Conta Poupança
  INVESTMENT = 'INVESTMENT'   // Conta de Investimento
  CREDIT_CARD = 'CREDIT_CARD' // Cartão de Crédito
  WALLET = 'WALLET'           // Carteira
}
```

## 🔍 **Queries**

### **1. Hello Query**

```graphql
query {
  hello
}
```

**Resposta:**
```json
{
  "data": {
    "hello": "Hello World!"
  }
}
```

### **2. Buscar Todos os Usuários**

```graphql
query {
  users {
    id
    email
    name
    lastname
    role
    status
    createdAt
  }
}
```

**Resposta:**
```json
{
  "data": {
    "users": [
      {
        "id": "user_1234567890_abc123",
        "email": "joao.silva@example.com",
        "name": "João",
        "lastname": "Silva",
        "role": "USER",
        "status": "ACTIVE",
        "createdAt": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### **3. Buscar Usuário por ID**

```graphql
query GetUserById($id: String!) {
  userById(id: $id) {
    id
    email
    name
    lastname
    birthdate
    role
    status
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "user_1234567890_abc123"
}
```

### **4. Buscar Usuário por Email**

```graphql
query GetUserByEmail($email: String!) {
  userByEmail(email: $email) {
    id
    email
    name
    lastname
    role
    status
  }
}
```

**Variables:**
```json
{
  "email": "joao.silva@example.com"
}
```

### **5. Busca Avançada de Usuários**

```graphql
query SearchUsers($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    items {
      id
      email
      name
      lastname
      role
      status
    }
    total
    currentPage
    limit
    totalPages
    lastPage
  }
}
```

**Variables:**
```json
{
  "input": {
    "page": 1,
    "limit": 10,
    "filter": "joão",
    "sort": "name",
    "sortDirection": "asc"
  }
}
```

### **6. Buscar Gêneros**

```graphql
query {
  genders {
    id
    gender
    createdAt
    updatedAt
  }
}
```

### **7. Buscar Profissões**

```graphql
query {
  professions {
    id
    profession
    createdAt
    updatedAt
  }
}
```

### **8. 💰 Buscar Contas por Usuário**

```graphql
query AccountsByUser($userId: String!) {
  accountsByUser(userId: $userId) {
    id
    name
    type
    balance
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "userId": "user-uuid-here"
}
```

**Resposta:**
```json
{
  "data": {
    "accountsByUser": [
      {
        "id": "account-uuid-1",
        "name": "Conta Corrente Principal",
        "type": "CHECKING",
        "balance": 1500.50,
        "createdAt": "2025-08-26T10:00:00.000Z",
        "updatedAt": "2025-08-26T10:00:00.000Z"
      },
      {
        "id": "account-uuid-2",
        "name": "Conta Poupança",
        "type": "SAVINGS",
        "balance": 5000.00,
        "createdAt": "2025-08-26T10:05:00.000Z",
        "updatedAt": "2025-08-26T10:05:00.000Z"
      }
    ]
  }
}
```

### **9. 💰 Buscar Conta por ID**

```graphql
query AccountById($id: String!) {
  accountById(id: $id) {
    id
    name
    type
    balance
    userId
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "account-uuid-here"
}
```

**Resposta:**
```json
{
  "data": {
    "accountById": {
      "id": "account-uuid-1",
      "name": "Conta Corrente Principal",
      "type": "CHECKING",
      "balance": 1500.50,
      "userId": "user-uuid-here",
      "createdAt": "2025-08-26T10:00:00.000Z",
      "updatedAt": "2025-08-26T10:00:00.000Z"
    }
  }
}
```

## ✏️ **Mutations**

### **1. Criar Usuário**

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    lastname
    birthdate
    role
    status
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "maria.santos@example.com",
    "name": "Maria",
    "lastname": "Santos",
    "birthdate": "1992-08-15",
    "role": "USER",
    "genderId": "gender-uuid-here",
    "professionId": "profession-uuid-here",
    "password": "SecurePass123!"
  }
}
```

**Resposta de Sucesso:**
```json
{
  "data": {
    "createUser": {
      "id": "user_1234567890_def456",
      "email": "maria.santos@example.com",
      "name": "Maria",
      "lastname": "Santos",
      "birthdate": "1992-08-15T00:00:00.000Z",
      "role": "USER",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:35:00.000Z"
    }
  }
}
```

**Resposta de Erro:**
```json
{
  "errors": [
    {
      "message": "User with email maria.santos@example.com already exists",
      "extensions": {
        "code": "USER_EMAIL_ALREADY_EXISTS",
        "statusCode": 400
      }
    }
  ]
}
```

### **2. Atualizar Usuário**

```graphql
mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    lastname
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "user_1234567890_abc123",
  "input": {
    "name": "João Pedro",
    "lastname": "Silva Santos"
  }
}
```

### **3. Deletar Usuário**

```graphql
mutation DeleteUser($id: String!) {
  deleteUser(id: $id)
}
```

**Variables:**
```json
{
  "id": "user_1234567890_abc123"
}
```

**Resposta:**
```json
{
  "data": {
    "deleteUser": true
  }
}
```

### **4. 💰 Criar Conta Financeira**

```graphql
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    userId
    createdAt
  }
}
```

**Variables para Conta Corrente:**
```json
{
  "input": {
    "name": "Conta Corrente Principal",
    "type": "CHECKING",
    "balance": 1500.50,
    "userId": "user-uuid-here"
  }
}
```

**Variables para Conta Poupança:**
```json
{
  "input": {
    "name": "Conta Poupança",
    "type": "SAVINGS",
    "balance": 5000.00,
    "userId": "user-uuid-here"
  }
}
```

**Variables para Cartão de Crédito:**
```json
{
  "input": {
    "name": "Cartão Visa Gold",
    "type": "CREDIT_CARD",
    "balance": 0.00,
    "userId": "user-uuid-here"
  }
}
```

**Resposta de Sucesso:**
```json
{
  "data": {
    "createAccount": {
      "id": "account-uuid-new",
      "name": "Conta Corrente Principal",
      "type": "CHECKING",
      "balance": 1500.50,
      "userId": "user-uuid-here",
      "createdAt": "2025-08-26T10:30:00.000Z"
    }
  }
}
```

**Resposta de Erro:**
```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "USER_NOT_FOUND",
        "statusCode": 404
      }
    }
  ]
}
```

## 📝 **Types**

### **User Type**

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  role: String!
  genderId: String
  professionId: String
  profileId: String
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### **💰 Account Type**

```graphql
type Account {
  id: ID!
  name: String!
  type: String!
  balance: Float!
  userId: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### **SearchResult Type**

```graphql
type SearchResult {
  items: [User!]!
  total: Int!
  currentPage: Int!
  limit: Int!
  totalPages: Int!
  lastPage: Int!
}
```

### **Input Types**

#### **CreateUserInput**
```graphql
input CreateUserInput {
  email: String!
  name: String!
  lastname: String!
  birthdate: String!
  role: String!
  genderId: String!
  professionId: String!
  password: String!
}
```

#### **UpdateUserInput**
```graphql
input UpdateUserInput {
  email: String
  name: String
  lastname: String
  password: String
}
```

#### **SearchUsersInput**
```graphql
input SearchUsersInput {
  page: Int = 1
  limit: Int = 10
  filter: String
  sort: String
  sortDirection: String = "asc"
}
```

#### **💰 CreateAccountInput**
```graphql
input CreateAccountInput {
  name: String!
  type: String!
  balance: Float
  userId: String!
}
```

## 🔧 **Resolvers**

### **UsersResolver**

```typescript
@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersApplicationService: UsersApplicationService,
        private readonly loggerService: LoggerService
    ) {}

    @Query(() => [User])
    async users(): Promise<User[]> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_START', null, 'UsersResolver')

            const result = await this.usersApplicationService.searchUsers({
                page: 1,
                limit: 100
            })

            this.loggerService.logOperation('GRAPHQL_GET_ALL_USERS_SUCCESS',
                { count: result.users.length }, 'UsersResolver')

            return result.users
        } catch (error) {
            this.loggerService.logError('GRAPHQL_GET_ALL_USERS_ERROR', error, 'UsersResolver')
            throw error
        }
    }

    @Query(() => User, { nullable: true })
    async userById(@Args('id') id: string): Promise<User | null> {
        try {
            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_START', { id }, 'UsersResolver')

            const user = await this.usersApplicationService.findUserById(id)

            this.loggerService.logOperation('GRAPHQL_GET_USER_BY_ID_SUCCESS',
                { id: user.id, email: user.email }, 'UsersResolver')

            return user
        } catch (error) {
            this.loggerService.logError('GRAPHQL_GET_USER_BY_ID_ERROR', error, 'UsersResolver')
            return null
        }
    }

    @Mutation(() => User)
    async createUser(@Args('input') input: CreateUserInput): Promise<User> {
        try {
            this.loggerService.logOperation('GRAPHQL_CREATE_USER_START',
                { email: input.email }, 'UsersResolver')

            const user = await this.usersApplicationService.createUser({
                email: input.email,
                name: input.name,
                lastname: input.lastname,
                birthdate: input.birthdate,
                role: input.role as UserRole,
                genderId: input.genderId,
                professionId: input.professionId,
                password: input.password
            })

            this.loggerService.logOperation('GRAPHQL_CREATE_USER_SUCCESS',
                { id: user.id, email: user.email }, 'UsersResolver')

            return user
        } catch (error) {
            this.loggerService.logError('GRAPHQL_CREATE_USER_ERROR', error, 'UsersResolver')
            throw error
        }
    }
}
```

### **Características dos Resolvers**

- **Logging estruturado** para todas as operações
- **Tratamento de erros** consistente
- **Validação automática** com class-validator
- **Injeção de dependência** com NestJS
- **Separação de responsabilidades** clara

## 🧪 **Testando a API**

### **1. Com GraphQL Playground**

1. **Acesse**: http://localhost:3000/graphql
2. **Explore o schema** na aba "DOCS"
3. **Teste queries** na aba principal
4. **Configure variáveis** na aba "Query Variables"

### **2. Com Scripts de Teste**

```bash
# Teste queries básicas
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"query { users { id name email } }"}'

# Teste mutations
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name } }","variables":{"input":{"email":"test@example.com","name":"Test","lastname":"User","birthdate":"1990-01-01","role":"USER","genderId":"gender-id","professionId":"profession-id","password":"password123"}}}'

# Teste com dados específicos
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"query GetUser($id: String!) { user(id: $id) { id name email } }","variables":{"id":"user-id"}}'
```

### **3. Com Postman**

1. **Importe a collection**: `postman_collection.json`
2. **Configure o ambiente** com variáveis
3. **Execute as requests** na sequência correta

### **4. Com cURL**

```bash
# Query simples
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}' \
  http://localhost:3000/graphql

# Query com variáveis
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetUser($id: String!) { userById(id: $id) { id email name } }","variables":{"id":"user-123"}}' \
  http://localhost:3000/graphql
```

## 📚 **Exemplos Práticos**

### **1. Fluxo Completo de Criação de Usuário**

#### **Passo 1: Obter Dados de Suporte**
```graphql
query {
  genders {
    id
    gender
  }
  professions {
    id
    profession
  }
}
```

#### **Passo 2: Criar Usuário**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    lastname
    role
    status
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "admin@smarteconomy.com",
    "name": "Administrador",
    "lastname": "Sistema",
    "birthdate": "1985-05-20",
    "role": "ADMIN",
    "genderId": "gender-uuid-from-step-1",
  }
}
```

### **4. 💰 Fluxo Completo: Usuário + Contas Financeiras**

#### **Passo 1: Criar Usuário**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    lastname
    role
    status
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "cliente@smarteconomy.com",
    "name": "Maria",
    "lastname": "Silva",
    "birthdate": "1990-03-15",
    "role": "USER",
    "genderId": "gender-uuid-from-step-1",
    "professionId": "profession-uuid-from-step-1",
    "password": "Cliente123456!"
  }
}
```

#### **Passo 2: Criar Conta Corrente**
```graphql
mutation CreateCheckingAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    userId
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Conta Corrente Principal",
    "type": "CHECKING",
    "balance": 2500.00,
    "userId": "user-uuid-created-above"
  }
}
```

#### **Passo 3: Criar Conta Poupança**
```graphql
mutation CreateSavingsAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    userId
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Conta Poupança",
    "type": "SAVINGS",
    "balance": 10000.00,
    "userId": "user-uuid-created-above"
  }
}
```

#### **Passo 4: Criar Cartão de Crédito**
```graphql
mutation CreateCreditCard($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    userId
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Cartão Mastercard Black",
    "type": "CREDIT_CARD",
    "balance": 0.00,
    "userId": "user-uuid-created-above"
  }
}
```

#### **Passo 5: Listar Todas as Contas do Usuário**
```graphql
query GetAllUserAccounts($userId: String!) {
  accountsByUser(userId: $userId) {
    id
    name
    type
    balance
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "userId": "user-uuid-created-above"
}
```

**Resposta Esperada:**
```json
{
  "data": {
    "accountsByUser": [
      {
        "id": "account-uuid-1",
        "name": "Conta Corrente Principal",
        "type": "CHECKING",
        "balance": 2500.00,
        "createdAt": "2025-08-26T10:00:00.000Z",
        "updatedAt": "2025-08-26T10:00:00.000Z"
      },
      {
        "id": "account-uuid-2",
        "name": "Conta Poupança",
        "type": "SAVINGS",
        "balance": 10000.00,
        "createdAt": "2025-08-26T10:05:00.000Z",
        "updatedAt": "2025-08-26T10:05:00.000Z"
      },
      {
        "id": "account-uuid-3",
        "name": "Cartão Mastercard Black",
        "type": "CREDIT_CARD",
        "balance": 0.00,
        "createdAt": "2025-08-26T10:10:00.000Z",
        "updatedAt": "2025-08-26T10:10:00.000Z"
      }
    ]
  }
}
```

### **5. Atualização de Perfil**

```graphql
query SearchUsersAdvanced($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    items {
      id
      email
      name
      lastname
      role
      status
      createdAt
    }
    total
    currentPage
    totalPages
    lastPage
  }
}
```

**Variables para diferentes cenários:**

#### **Busca por Nome**
```json
{
  "input": {
    "page": 1,
    "limit": 20,
    "filter": "joão",
    "sort": "name",
    "sortDirection": "asc"
  }
}
```

#### **Busca por Email**
```json
{
  "input": {
    "page": 1,
    "limit": 10,
    "filter": "@gmail.com",
    "sort": "email",
    "sortDirection": "asc"
  }
}
```

#### **Paginação Avançada**
```json
{
  "input": {
    "page": 2,
    "limit": 5,
    "sort": "createdAt",
    "sortDirection": "desc"
  }
}
```

### **3. Atualização de Perfil**

```graphql
mutation UpdateUserProfile($id: String!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    lastname
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "user-uuid-here",
  "input": {
    "name": "João Pedro",
    "lastname": "Silva Santos"
  }
}
```

## ⚠️ **Tratamento de Erros**

### **Tipos de Erro**

#### **1. Erros de Validação**
```json
{
  "errors": [
    {
      "message": "User must be at least 18 years old",
      "extensions": {
        "code": "USER_INVALID_AGE",
        "statusCode": 400
      }
    }
  ]
}
```

#### **2. Erros de Negócio**
```json
{
  "errors": [
    {
      "message": "User with email joao@example.com already exists",
      "extensions": {
        "code": "USER_EMAIL_ALREADY_EXISTS",
        "statusCode": 409
      }
    }
  ]
}
```

#### **3. Erros de Sistema**
```json
{
  "errors": [
    {
      "message": "Internal server error",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "statusCode": 500
      }
    }
  ]
}
```

### **Códigos de Erro**

| Código | Descrição | Status HTTP |
|--------|-----------|-------------|
| `USER_EMAIL_ALREADY_EXISTS` | Email já cadastrado | 409 |
| `USER_NOT_FOUND` | Usuário não encontrado | 404 |
| `USER_INVALID_AGE` | Idade inválida | 400 |
| `USER_INVALID_EMAIL` | Email inválido | 400 |
| `USER_INVALID_PASSWORD` | Senha inválida | 400 |
| `ACCOUNT_NOT_FOUND` | Conta não encontrada | 404 |
| `ACCOUNT_INVALID_TYPE` | Tipo de conta inválido | 400 |
| `ACCOUNT_INVALID_BALANCE` | Saldo inválido | 400 |
| `ACCOUNT_INSUFFICIENT_BALANCE` | Saldo insuficiente | 400 |
| `INVALID_INPUT` | Dados de entrada inválidos | 400 |
| `INTERNAL_SERVER_ERROR` | Erro interno do servidor | 500 |

## 🔒 **Autenticação**

### **Status Atual**

- ✅ **Autenticação JWT** implementada
- ✅ **Middleware de autenticação** configurado
- ✅ **Guards de autorização** disponíveis
- 🔄 **GraphQL Auth** em desenvolvimento

### **Implementação Futura**

```typescript
// Exemplo de resolver protegido
@Query(() => [User])
@UseGuards(GqlAuthGuard)
@Roles(UserRole.ADMIN)
async adminUsers(): Promise<User[]> {
    return this.usersApplicationService.getAllUsers()
}
```

## 📈 **Performance**

### **Otimizações Implementadas**

- ✅ **DataLoader** para evitar N+1 queries
- ✅ **Caching** em camadas apropriadas
- ✅ **Lazy loading** de relacionamentos
- ✅ **Query optimization** com Prisma

### **Monitoramento**

- 📊 **Logs estruturados** para todas as operações
- ⏱️ **Métricas de performance** com interceptors
- 🔍 **Query analysis** com Prisma Studio
- 📈 **Health checks** para serviços

### **Boas Práticas**

1. **Use projeções específicas** para evitar over-fetching
2. **Implemente paginação** para listas grandes
3. **Use filtros** para reduzir dados transferidos
4. **Monitore queries** com Prisma Studio
5. **Implemente caching** para dados estáticos

## 🎯 **Conclusão**

A **API GraphQL** do SmartEconomy Backend oferece:

- **🚀 Interface moderna** e flexível
- **📊 Schema auto-gerado** e documentado
- **🔒 Validação robusta** e tratamento de erros
- **📈 Performance otimizada** com DataLoader
- **🧪 Testabilidade** com playground interativo
- **📚 Documentação completa** e exemplos práticos

Esta implementação segue as **melhores práticas** do GraphQL e serve como **base sólida** para o crescimento da API.

---

**📖 Para mais detalhes, consulte:**
- [Arquitetura Hexagonal](../architecture/hexagonal.md)
- [Domain-Driven Design](../architecture/ddd.md)
- [Guia Postman](../../GUIA_POSTMAN.md)
- [Módulo Users](../../src/users/README.md)
