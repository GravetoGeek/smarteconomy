# 📝 Exemplos Práticos da API

> **Exemplos de Uso da API GraphQL do SmartEconomy Backend**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Fluxo de Criação de Usuário](#-fluxo-de-criação-de-usuário)
- [🔍 Operações de Busca](#-operações-de-busca)
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

## 🎯 **Conclusão**

Estes exemplos demonstram as principais operações da API GraphQL. Para mais detalhes, consulte a [documentação completa da API](graphql.md).

---

**📖 Para mais detalhes, consulte:**
- [API GraphQL](graphql.md)
- [Guia Postman](../../GUIA_POSTMAN.md)
- [Módulo Users](../../../src/users/README.md)
