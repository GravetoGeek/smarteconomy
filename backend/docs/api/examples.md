# 📝 Exemplos Práticos da API

> **Exemplos de Uso da API GraphQL do SmartEconomy Backend**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Fluxo de Criação de Usuário](#-fluxo-de-criação-de-usuário)
- [� Gestão de Contas Financeiras](#-gestão-de-contas-financeiras)
- [�🔍 Operações de Busca](#-operações-de-busca)
- [✏️ Operações de Atualização](#️-operações-de-atualização)
- [🗑️ Operações de Remoção](#️-operações-de-remoção)
- [🧪 Testando com cURL](#-testando-com-curl)

## 🎯 **Visão Geral**

Esta documentação apresenta exemplos práticos de como usar a API GraphQL do SmartEconomy Backend. Todos os exemplos podem ser testados no **GraphQL Playground** disponível em `http://localhost:3000/graphql`.

## 🚀 **Fluxo de Criação de Usuário**

### **Passo 1: Obter Dados de Suporte**

```graphql
query GetSupportData {
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

**Resposta esperada:**
```json
{
  "data": {
    "genders": [
      {
        "id": "gender-uuid-1",
        "gender": "Masculino"
      },
      {
        "id": "gender-uuid-2",
        "gender": "Feminino"
      }
    ],
    "professions": [
      {
        "id": "profession-uuid-1",
        "profession": "Desenvolvedor"
      },
      {
        "id": "profession-uuid-2",
        "profession": "Designer"
      }
    ]
  }
}
```

### **Passo 2: Criar Usuário**

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
    "email": "joao.silva@example.com",
    "name": "João",
    "lastname": "Silva",
    "birthdate": "1990-01-15",
    "role": "USER",
    "genderId": "gender-uuid-1",
    "professionId": "profession-uuid-1",
    "password": "SecurePass123!"
  }
}
```

### **Passo 3: Verificar Usuário Criado**

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

  }
}
```

## 💰 **Gestão de Contas Financeiras**

### **Criar Conta Corrente**

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
    "balance": 1500.50,
    "userId": "user-uuid-here"
  }
}
```

### **Criar Conta Poupança**

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
    "balance": 5000.00,
    "userId": "user-uuid-here"
  }
}
```

### **Criar Cartão de Crédito**

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
    "name": "Cartão Visa Gold",
    "type": "CREDIT_CARD",
    "balance": 0.00,
    "userId": "user-uuid-here"
  }
}
```

### **Buscar Contas do Usuário**

```graphql
query GetUserAccounts($userId: String!) {
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

**Resposta esperada:**
```json
{
  "data": {
    "accountsByUser": [
      {
        "id": "account-uuid-1",
        "name": "Conta Corrente Principal",
        "type": "CHECKING",
        "balance": 1500.50,
        "createdAt": "2025-08-26T12:00:00Z",
        "updatedAt": "2025-08-26T12:00:00Z"
      },
      {
        "id": "account-uuid-2",
        "name": "Conta Poupança",
        "type": "SAVINGS",
        "balance": 5000.00,
        "createdAt": "2025-08-26T12:05:00Z",
        "updatedAt": "2025-08-26T12:05:00Z"
      }
    ]
  }
}
```

### **Buscar Conta Específica**

```graphql
query GetAccountById($id: String!) {
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

### **Fluxo Completo: Usuário + Contas**

```graphql
# 1. Criar usuário
mutation CreateUser($userInput: CreateUserInput!) {
  createUser(input: $userInput) {
    id
    email
    name
    lastname
  }
}

# 2. Criar conta corrente
mutation CreateAccount1($accountInput: CreateAccountInput!) {
  createAccount(input: $accountInput) {
    id
    name
    type
    balance
  }
}

# 3. Criar conta poupança
mutation CreateAccount2($accountInput: CreateAccountInput!) {
  createAccount(input: $accountInput) {
    id
    name
    type
    balance
  }
}

# 4. Listar todas as contas do usuário
query GetAllUserAccounts($userId: String!) {
  accountsByUser(userId: $userId) {
    id
    name
    type
    balance
    createdAt
  }
}
```

**Exemplo de Variables para o fluxo:**
```json
{
  "userInput": {
    "email": "maria.santos@example.com",
    "name": "Maria",
    "lastname": "Santos",
    "birthdate": "1985-03-20",
    "role": "USER",
    "genderId": "gender-uuid-2",
    "professionId": "profession-uuid-2",
    "password": "SecurePass456!"
  },
  "accountInput": {
    "name": "Conta Corrente Principal",
    "type": "CHECKING",
    "balance": 2500.00,
    "userId": "user-uuid-created-above"
  },
  "userId": "user-uuid-created-above"
}
```

## 🔍 **Operações de Busca**

### **Busca por ID**

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
  "id": "user-uuid-here"
}
```

### **Busca por Email**

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

### **Busca Avançada com Filtros**

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
    lastPage
  }
}
```

**Exemplos de Variables:**

#### **Busca por Nome**
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

#### **Busca por Email Corporativo**
```json
{
  "input": {
    "page": 1,
    "limit": 20,
    "filter": "@company.com",
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

## ✏️ **Operações de Atualização**

### **Atualizar Nome e Sobrenome**

```graphql
mutation UpdateUserName($id: String!, $input: UpdateUserInput!) {
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

### **Alterar Senha**

```graphql
mutation UpdateUserPassword($id: String!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "user-uuid-here",
  "input": {
    "password": "NewSecurePass456!"
  }
}
```

## 🗑️ **Operações de Remoção**

### **Deletar Usuário**

```graphql
mutation DeleteUser($id: String!) {
  deleteUser(id: $id)
}
```

**Variables:**
```json
{
  "id": "user-uuid-here"
}
```

**Resposta esperada:**
```json
{
  "data": {
    "deleteUser": true
  }
}
```

## 🧪 **Testando com cURL**

### **Query Simples**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}' \
  http://localhost:3000/graphql
```

### **Query com Variáveis**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: String!) { userById(id: $id) { id email name } }",
    "variables": {"id": "user-uuid-here"}
  }' \
  http://localhost:3000/graphql
```

### **Mutation com Variáveis**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name } }",
    "variables": {
      "input": {
        "email": "test@example.com",
        "name": "Test",
        "lastname": "User",
        "birthdate": "1990-01-01",
        "role": "USER",
        "genderId": "gender-uuid",
        "professionId": "profession-uuid",
        "password": "TestPass123!"
      }
    }
  }' \
  http://localhost:3000/graphql
```

### **💰 Criar Conta Financeira**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateAccount($input: CreateAccountInput!) { createAccount(input: $input) { id name type balance createdAt } }",
    "variables": {
      "input": {
        "name": "Conta Teste",
        "type": "CHECKING",
        "balance": 1000.0,
        "userId": "user-uuid-here"
      }
    }
  }' \
  http://localhost:3000/graphql
```

### **💰 Buscar Contas do Usuário**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query AccountsByUser($userId: String!) { accountsByUser(userId: $userId) { id name type balance } }",
    "variables": {"userId": "user-uuid-here"}
  }' \
  http://localhost:3000/graphql
```

### **💰 Buscar Conta Específica**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query AccountById($id: String!) { accountById(id: $id) { id name type balance userId } }",
    "variables": {"id": "account-uuid-here"}
  }' \
  http://localhost:3000/graphql
```

## 🎯 **Conclusão**

Estes exemplos demonstram as principais operações da API GraphQL. Para mais detalhes, consulte a [documentação completa da API](graphql.md).

---

**📖 Para mais detalhes, consulte:**
- [API GraphQL](graphql.md)
- [Guia Postman](../../GUIA_POSTMAN.md)
- [Módulo Users](../../../src/users/README.md)
