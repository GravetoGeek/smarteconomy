# 🚀 **API Reference - SmartEconomy GraphQL**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🔐 Autenticação](#-autenticação)
- [👤 Módulo de Usuários](#-módulo-de-usuários)
- [💰 Módulo de Contas](#-módulo-de-contas)
- [👤 Módulo de Gênero](#-módulo-de-gênero)
- [💼 Módulo de Profissão](#-módulo-de-profissão)
- [🏷️ Tipos e Enums](#-tipos-e-enums)
- [❌ Tratamento de Erros](#-tratamento-de-erros)

---

## 🎯 **Visão Geral**

**Base URL**: `http://localhost:3000/graphql`
**Método**: `POST`
**Content-Type**: `application/json`

### **Playground GraphQL**
- **Desenvolvimento**: http://localhost:3000/graphql
- **Introspection**: Habilitado em desenvolvimento

---

## 🔐 **Autenticação**

### **Signup (Registro)**

```graphql
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    accessToken
    refreshToken
    expiresIn
    tokenType
    user {
      id
      email
      role
    }
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "email": "newuser@smarteconomy.com",
    "password": "SecurePass123!",
    "name": "João",
    "lastname": "Silva",
    "birthdate": "1990-01-15T00:00:00.000Z",
    "genderId": "123e4567-e89b-12d3-a456-426614174000",
    "professionId": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

**Resposta:**
```json
{
  "data": {
    "signup": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400,
      "tokenType": "Bearer",
      "user": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "email": "newuser@smarteconomy.com",
        "role": "USER"
      }
    }
  }
}
```

### **Login**

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      lastname
      role
      status
    }
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "Password123!"
  }
}
```

**Resposta:**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "user@example.com",
        "name": "João",
        "lastname": "Silva",
        "role": "USER",
        "status": "ACTIVE"
      }
    }
  }
}
```

### **Refresh Token**

```graphql
mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Logout**

```graphql
mutation Logout($input: LogoutInput!) {
  logout(input: $input) {
    success
    message
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Validar Token**

```graphql
query ValidateToken($input: ValidateTokenInput!) {
  validateToken(input: $input) {
    valid
    payload {
      userId
      email
      role
      iat
      exp
    }
  }
}
```

---

## 👤 **Módulo de Usuários**

### **Queries (Consultas)**

#### **Listar Todos os Usuários**

```graphql
query Users {
  users {
    id
    email
    name
    lastname
    birthdate
    role
    status
    fullName
    age
    createdAt
    updatedAt
    gender {
      id
      gender
    }
    profession {
      id
      profession
    }
  }
}
```

**Resposta:**
```json
{
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "joao@example.com",
        "name": "João",
        "lastname": "Silva",
        "birthdate": "1990-05-15",
        "role": "USER",
        "status": "ACTIVE",
        "fullName": "João Silva",
        "age": 34,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "gender": {
          "id": "gen-123",
          "gender": "Masculino"
        },
        "profession": {
          "id": "prof-456",
          "profession": "Desenvolvedor"
        }
      }
    ]
  }
}
```

#### **Buscar Usuário por ID**

```graphql
query UserById($id: String!) {
  userById(id: $id) {
    id
    email
    name
    lastname
    birthdate
    role
    status
    fullName
    age
    accounts {
      id
      name
      type
      balance
    }
  }
}
```

**Variáveis:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### **Buscar Usuário por Email**

```graphql
query UserByEmail($email: String!) {
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

#### **Pesquisar Usuários**

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
    totalPages
    hasNextPage
    hasPreviousPage
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "searchTerm": "João",
    "role": "USER",
    "status": "ACTIVE",
    "page": 1,
    "limit": 10
  }
}
```

### **Mutations (Modificações)**

#### **Criar Usuário**

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

**Variáveis:**
```json
{
  "input": {
    "email": "novo@example.com",
    "name": "Maria",
    "lastname": "Santos",
    "birthdate": "1995-03-20",
    "password": "Password123!",
    "role": "USER",
    "genderId": "gen-456",
    "professionId": "prof-789"
  }
}
```

#### **Atualizar Usuário**

```graphql
mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    lastname
    role
    status
    updatedAt
  }
}
```

**Variáveis:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "input": {
    "name": "João Carlos",
    "lastname": "Silva Santos",
    "role": "ADMIN"
  }
}
```

#### **Excluir Usuário**

```graphql
mutation DeleteUser($id: String!) {
  deleteUser(id: $id)
}
```

**Variáveis:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

## 💰 **Módulo de Contas**

### **Queries (Consultas)**

#### **Contas por Usuário**

```graphql
query AccountsByUser($userId: String!) {
  accountsByUser(userId: $userId) {
    id
    name
    type
    balance
    status
    createdAt
    updatedAt
  }
}
```

**Variáveis:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Resposta:**
```json
{
  "data": {
    "accountsByUser": [
      {
        "id": "acc-123",
        "name": "Conta Corrente Principal",
        "type": "CHECKING",
        "balance": 2500.75,
        "status": "ACTIVE",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-20T14:45:00Z"
      },
      {
        "id": "acc-456",
        "name": "Poupança",
        "type": "SAVINGS",
        "balance": 10000.00,
        "status": "ACTIVE",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### **Conta por ID**

```graphql
query AccountById($id: String!) {
  accountById(id: $id) {
    id
    name
    type
    balance
    status
    user {
      id
      name
      lastname
      email
    }
    createdAt
    updatedAt
  }
}
```

### **Mutations (Modificações)**

#### **Criar Conta**

```graphql
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    userId
    status
    createdAt
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "name": "Cartão de Crédito Visa",
    "type": "CREDIT_CARD",
    "balance": 0,
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Resposta:**
```json
{
  "data": {
    "createAccount": {
      "id": "acc-789",
      "name": "Cartão de Crédito Visa",
      "type": "CREDIT_CARD",
      "balance": 0,
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "status": "ACTIVE",
      "createdAt": "2024-01-25T09:15:00Z"
    }
  }
}
```

---

## 👤 **Módulo de Gênero**

### **Queries (Consultas)**

#### **Listar Todos os Gêneros**

```graphql
query Genders {
  genders {
    id
    gender
    createdAt
    updatedAt
  }
}
```

**Resposta:**
```json
{
  "data": {
    "genders": [
      {
        "id": "gen-123",
        "gender": "Masculino",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "gen-456",
        "gender": "Feminino",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "gen-789",
        "gender": "Não-binário",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### **Mutations (Modificações)**

#### **Criar Gênero**

```graphql
mutation CreateGender($input: CreateGenderInput!) {
  createGender(input: $input) {
    id
    gender
    createdAt
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "gender": "Agênero"
  }
}
```

---

## 💼 **Módulo de Profissão**

### **Queries (Consultas)**

#### **Listar Todas as Profissões**

```graphql
query Professions {
  professions {
    id
    profession
    createdAt
    updatedAt
  }
}
```

### **Mutations (Modificações)**

#### **Criar Profissão**

```graphql
mutation CreateProfession($input: CreateProfessionInput!) {
  createProfession(input: $input) {
    id
    profession
    createdAt
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "profession": "Engenheiro de Software"
  }
}
```

---

## 🏷️ **Tipos e Enums**

### **User Types**

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  role: UserRole!
  status: AccountStatus!
  fullName: String!
  age: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  gender: Gender!
  profession: Profession!
  accounts: [Account!]!
}

input CreateUserInput {
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  password: String!
  role: UserRole = USER
  genderId: String!
  professionId: String!
}

input UpdateUserInput {
  name: String
  lastname: String
  role: UserRole
}

input SearchUsersInput {
  searchTerm: String
  role: UserRole
  status: AccountStatus
  page: Int = 1
  limit: Int = 20
}
```

### **Account Types**

```graphql
type Account {
  id: ID!
  name: String!
  type: AccountType!
  balance: Float!
  status: AccountStatus!
  userId: String!
  user: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateAccountInput {
  name: String!
  type: AccountType!
  balance: Float = 0
  userId: String!
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  INVESTMENT
  CASH
}
```

### **Enums Globais**

```graphql
enum UserRole {
  USER
  ADMIN
}

enum AccountStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### **Auth Types**

```graphql
type AuthResponse {
  accessToken: String!
  refreshToken: String!
  user: User!
}

input LoginInput {
  email: String!
  password: String!
}

input RefreshTokenInput {
  refreshToken: String!
}

input LogoutInput {
  accessToken: String!
}

type LogoutResponse {
  success: Boolean!
  message: String!
}
```

---

## ❌ **Tratamento de Erros**

### **Códigos de Erro Comuns**

#### **400 - Bad Request**
```json
{
  "errors": [
    {
      "message": "Email já existe no sistema",
      "extensions": {
        "code": "USER_EMAIL_ALREADY_EXISTS",
        "field": "email"
      }
    }
  ]
}
```

#### **401 - Unauthorized**
```json
{
  "errors": [
    {
      "message": "Token de acesso inválido",
      "extensions": {
        "code": "INVALID_ACCESS_TOKEN"
      }
    }
  ]
}
```

#### **403 - Forbidden**
```json
{
  "errors": [
    {
      "message": "Permissões insuficientes para esta operação",
      "extensions": {
        "code": "INSUFFICIENT_PERMISSIONS",
        "requiredRole": "ADMIN"
      }
    }
  ]
}
```

#### **404 - Not Found**
```json
{
  "errors": [
    {
      "message": "Usuário não encontrado",
      "extensions": {
        "code": "USER_NOT_FOUND",
        "id": "123e4567-e89b-12d3-a456-426614174000"
      }
    }
  ]
}
```

#### **422 - Validation Error**
```json
{
  "errors": [
    {
      "message": "Dados de entrada inválidos",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "validationErrors": [
          {
            "field": "email",
            "message": "Email deve ter formato válido"
          },
          {
            "field": "password",
            "message": "Senha deve ter pelo menos 8 caracteres"
          }
        ]
      }
    }
  ]
}
```

### **Códigos de Erro Específicos**

| Código | Descrição |
|--------|-----------|
| `USER_EMAIL_ALREADY_EXISTS` | Email já cadastrado |
| `USER_NOT_FOUND` | Usuário não encontrado |
| `INVALID_CREDENTIALS` | Email ou senha incorretos |
| `ACCOUNT_SUSPENDED` | Conta suspensa |
| `INVALID_ACCESS_TOKEN` | Token de acesso inválido |
| `TOKEN_EXPIRED` | Token expirado |
| `INSUFFICIENT_PERMISSIONS` | Permissões insuficientes |
| `ACCOUNT_NOT_FOUND` | Conta financeira não encontrada |
| `INSUFFICIENT_BALANCE` | Saldo insuficiente |
| `INVALID_ACCOUNT_TYPE` | Tipo de conta inválido |
| `VALIDATION_ERROR` | Erro de validação de dados |

---

## 🔧 **Configuração do Cliente**

### **Headers Obrigatórios**

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Para rotas protegidas
}
```

### **Exemplo com cURL**

```bash
# Login
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($input: LoginInput!) { login(input: $input) { accessToken user { id email name } } }",
    "variables": {
      "input": {
        "email": "user@example.com",
        "password": "Password123!"
      }
    }
  }'

# Consulta protegida
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query Users { users { id email name } }"
  }'
```

### **Exemplo com JavaScript/TypeScript**

```typescript
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  link: new HttpLink({
    headers: {
      authorization: localStorage.getItem('token')
        ? `Bearer ${localStorage.getItem('token')}`
        : '',
    }
  }),
  cache: new InMemoryCache()
});
```

---

**📅 Última atualização:** Agosto 2025
**🔗 GraphQL Playground:** http://localhost:3000/graphql
**📚 Schema:** [schema.gql](../src/schema.gql)
