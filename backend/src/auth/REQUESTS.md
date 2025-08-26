# 🧪 Testes do Módulo Auth - SmartEconomy Backend

## 📋 Visão Geral

Este documento contém exemplos de requisições para testar todas as funcionalidades do módulo Auth.

## 🚀 Pré-requisitos

1. **Servidor rodando**: `npm run start:dev`
2. **Usuário criado**: Use o módulo Users para criar um usuário primeiro
3. **GraphQL Playground**: Acesse `http://localhost:3000/graphql`

## 🔐 Testes de Autenticação

### **1. Login - Sucesso**

#### **GraphQL Query**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
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

#### **Variables**
```json
{
  "input": {
    "email": "joao.carlos@example.com",
    "password": "password123"
  }
}
```

#### **cURL**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($input: LoginInput!) { login(input: $input) { accessToken refreshToken expiresIn tokenType user { id email role } } }",
    "variables": {
      "input": {
        "email": "joao.carlos@example.com",
        "password": "password123"
      }
    }
  }'
```

#### **Resposta Esperada (Sucesso)**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400,
      "tokenType": "Bearer",
      "user": {
        "id": "a69d755a-6de1-4eaf-aaad-3123462ef281",
        "email": "joao.carlos@example.com",
        "role": "USER"
      }
    }
  }
}
```

### **2. Login - Credenciais Inválidas**

#### **Variables**
```json
{
  "input": {
    "email": "joao.carlos@example.com",
    "password": "senhaerrada"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "errors": [
    {
      "message": "Invalid email or password",
      "extensions": {
        "code": "INVALID_CREDENTIALS"
      }
    }
  ],
  "data": null
}
```

### **3. Login - Usuário Não Encontrado**

#### **Variables**
```json
{
  "input": {
    "email": "usuario.inexistente@example.com",
    "password": "password123"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "errors": [
    {
      "message": "User with email usuario.inexistente@example.com not found",
      "extensions": {
        "code": "USER_NOT_FOUND"
      }
    }
  ],
  "data": null
}
```

### **4. Login - Email Inválido**

#### **Variables**
```json
{
  "input": {
    "email": "email-invalido",
    "password": "password123"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "errors": [
    {
      "message": "Invalid email format",
      "extensions": {
        "code": "INVALID_INPUT"
      }
    }
  ],
  "data": null
}
```

### **5. Login - Senha Muito Curta**

#### **Variables**
```json
{
  "input": {
    "email": "joao.carlos@example.com",
    "password": "123"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "errors": [
    {
      "message": "Password must be at least 6 characters long",
      "extensions": {
        "code": "INVALID_INPUT"
      }
    }
  ],
  "data": null
}
```

## 🔄 Testes de Refresh Token

### **1. Refresh Token - Sucesso**

#### **GraphQL Query**
```graphql
mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
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

#### **Variables**
```json
{
  "input": {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **cURL**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RefreshToken($input: RefreshTokenInput!) { refreshToken(input: $input) { accessToken refreshToken expiresIn tokenType user { id email role } } }",
    "variables": {
      "input": {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }'
```

#### **Resposta Esperada (Sucesso)**
```json
{
  "data": {
    "refreshToken": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400,
      "tokenType": "Bearer",
      "user": {
        "id": "a69d755a-6de1-4eaf-aaad-3123462ef281",
        "email": "joao.carlos@example.com",
        "role": "USER"
      }
    }
  }
}
```

### **2. Refresh Token - Token Inválido**

#### **Variables**
```json
{
  "input": {
    "refreshToken": "token-invalido"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "errors": [
    {
      "message": "Invalid refresh token",
      "extensions": {
        "code": "REFRESH_TOKEN_INVALID"
      }
    }
  ],
  "data": null
}
```

## 🚪 Testes de Logout

### **1. Logout - Sucesso**

#### **GraphQL Query**
```graphql
mutation Logout($input: LogoutInput!) {
  logout(input: $input) {
    success
    message
  }
}
```

#### **Variables**
```json
{
  "input": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **cURL**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Logout($input: LogoutInput!) { logout(input: $input) { success message } }",
    "variables": {
      "input": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }'
```

#### **Resposta Esperada (Sucesso)**
```json
{
  "data": {
    "logout": {
      "success": true,
      "message": "Successfully logged out"
    }
  }
}
```

## ✅ Testes de Validação de Token

### **1. Validate Token - Token Válido**

#### **GraphQL Query**
```graphql
query ValidateToken($input: ValidateTokenInput!) {
  validateToken(input: $input) {
    valid
    user {
      id
      email
      role
    }
  }
}
```

#### **Variables**
```json
{
  "input": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **cURL**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query ValidateToken($input: ValidateTokenInput!) { validateToken(input: $input) { valid user { id email role } } }",
    "variables": {
      "input": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }'
```

#### **Resposta Esperada (Sucesso)**
```json
{
  "data": {
    "validateToken": {
      "valid": true,
      "user": {
        "id": "a69d755a-6de1-4eaf-aaad-3123462ef281",
        "email": "joao.carlos@example.com",
        "role": "USER"
      }
    }
  }
}
```

### **2. Validate Token - Token Inválido**

#### **Variables**
```json
{
  "input": {
    "accessToken": "token-invalido"
  }
}
```

#### **Resposta Esperada (Erro)**
```json
{
  "data": {
    "validateToken": {
      "valid": false,
      "user": null
    }
  }
}
```

### **3. Validate Token - Token Revogado**

#### **Variables**
```json
{
  "input": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Resposta Esperada (Após logout)**
```json
{
  "data": {
    "validateToken": {
      "valid": false,
      "user": null
    }
  }
}
```

## 📝 Script de Teste Completo

### **Postman Collection**

```json
{
  "info": {
    "name": "SmartEconomy Auth Module",
    "description": "Testes completos do módulo de autenticação"
  },
  "item": [
    {
      "name": "Auth - Login Success",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/graphql",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"mutation Login($input: LoginInput!) { login(input: $input) { accessToken refreshToken expiresIn tokenType user { id email role } } }\",\n  \"variables\": {\n    \"input\": {\n      \"email\": \"joao.carlos@example.com\",\n      \"password\": \"password123\"\n    }\n  }\n}"
        }
      }
    },
    {
      "name": "Auth - Login Invalid Credentials",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/graphql",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"mutation Login($input: LoginInput!) { login(input: $input) { accessToken refreshToken expiresIn tokenType user { id email role } } }\",\n  \"variables\": {\n    \"input\": {\n      \"email\": \"joao.carlos@example.com\",\n      \"password\": \"senhaerrada\"\n    }\n  }\n}"
        }
      }
    },
    {
      "name": "Auth - Validate Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/graphql",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"query ValidateToken($input: ValidateTokenInput!) { validateToken(input: $input) { valid user { id email role } } }\",\n  \"variables\": {\n    \"input\": {\n      \"accessToken\": \"{{accessToken}}\"\n    }\n  }\n}"
        }
      }
    },
    {
      "name": "Auth - Logout",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:3000/graphql",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"mutation Logout($input: LogoutInput!) { logout(input: $input) { success message } }\",\n  \"variables\": {\n    \"input\": {\n      \"accessToken\": \"{{accessToken}}\"\n    }\n  }\n}"
        }
      }
    }
  ]
}
```

## 🔍 Verificações Importantes

### **1. Logs do Servidor**
Verifique se os logs estão sendo gerados corretamente:

```bash
# Ver logs em tempo real
docker-compose logs -f backend

# Exemplo de logs esperados
[AuthResolver] Login attempt for email: joao.carlos@example.com
[AuthResolver] Login successful for user: a69d755a-6de1-4eaf-aaad-3123462ef281
[AuthResolver] Token validation result: true
[AuthResolver] Logout successful
```

### **2. Validações de Segurança**
- ✅ Senhas são hasheadas com bcrypt
- ✅ Tokens são validados e verificados
- ✅ Blacklist de tokens revogados funciona
- ✅ Validações de input são aplicadas

### **3. Integração com Módulo Users**
- ✅ Busca usuário por email
- ✅ Verifica status da conta (ACTIVE/INACTIVE)
- ✅ Atualiza último login

## 🚨 Cenários de Erro

### **1. Usuário Inativo**
```json
{
  "errors": [
    {
      "message": "User account is inactive",
      "extensions": {
        "code": "USER_ACCOUNT_INACTIVE"
      }
    }
  ]
}
```

### **2. Token Expirado**
```json
{
  "errors": [
    {
      "message": "Token has expired",
      "extensions": {
        "code": "TOKEN_EXPIRED"
      }
    }
  ]
}
```

### **3. Muitas Tentativas de Login**
```json
{
  "errors": [
    {
      "message": "Too many login attempts. Please try again later",
      "extensions": {
        "code": "TOO_MANY_LOGIN_ATTEMPTS"
      }
    }
  ]
}
```

## 🎯 Conclusão

Este conjunto de testes cobre todas as funcionalidades principais do módulo Auth. Execute-os em sequência para verificar se tudo está funcionando corretamente. Lembre-se de criar um usuário primeiro usando o módulo Users antes de testar o login.
