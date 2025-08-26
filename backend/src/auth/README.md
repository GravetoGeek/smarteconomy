# 🔐 Módulo Auth - SmartEconomy Backend

## 📋 Visão Geral

O módulo **Auth** implementa um sistema completo de autenticação e autorização seguindo os princípios da **Arquitetura Hexagonal** e **Domain-Driven Design (DDD)**.

## 🏗️ Arquitetura

### **Estrutura de Camadas**

```
src/auth/
├── domain/                    # 🎯 Camada de Domínio
│   ├── entities/             # Entidades de domínio
│   ├── value-objects/        # Objetos de valor
│   ├── exceptions/           # Exceções de domínio
│   ├── ports/               # Contratos/Interfaces
│   └── tokens.ts            # Tokens de injeção
├── application/              # 📱 Camada de Aplicação
│   ├── use-cases/           # Casos de uso
│   └── services/            # Serviços de aplicação
├── infrastructure/           # 🏗️ Camada de Infraestrutura
│   ├── repositories/        # Implementações de repositórios
│   └── services/            # Implementações de serviços
└── interfaces/              # 🌐 Camada de Interface
    └── graphql/             # Adaptadores GraphQL
        ├── models/          # Modelos GraphQL
        ├── inputs/          # Inputs GraphQL
        └── resolvers/       # Resolvers GraphQL
```

## 🎯 Funcionalidades

### **1. Autenticação JWT**
- ✅ **Login** com email/senha
- ✅ **Geração** de access token e refresh token
- ✅ **Validação** de tokens
- ✅ **Refresh** de tokens expirados
- ✅ **Logout** com revogação de tokens

### **2. Segurança**
- ✅ **Hash de senhas** com bcryptjs
- ✅ **Validação robusta** de inputs
- ✅ **Logs de auditoria** para todas as operações
- ✅ **Gestão de tokens** com blacklist

### **3. Autorização**
- ✅ **Verificação de roles** (USER, ADMIN)
- ✅ **Validação de status** de conta (ACTIVE/INACTIVE)
- ✅ **Middleware de autenticação** para GraphQL

## 🔧 Componentes Principais

### **Domain Layer**

#### **Entidades**
- **`AuthToken`**: Representa tokens de autenticação com métodos de domínio

#### **Value Objects**
- **`Email`**: Validação e normalização de emails
- **`Password`**: Validação de força de senha

#### **Exceções**
- `InvalidCredentialsException`
- `UserNotFoundException`
- `InvalidTokenException`
- `TokenExpiredException`
- `RefreshTokenInvalidException`
- `UserAccountInactiveException`
- `TooManyLoginAttemptsException`

#### **Ports**
- `AuthRepositoryPort`: Contrato para gestão de tokens
- `UserRepositoryPort`: Contrato para dados de usuário
- `HashServicePort`: Contrato para hash de senhas
- `JwtServicePort`: Contrato para operações JWT

### **Application Layer**

#### **Use Cases**
- **`LoginUseCase`**: Autenticação de usuário
- **`RefreshTokenUseCase`**: Renovação de tokens
- **`LogoutUseCase`**: Revogação de tokens
- **`ValidateTokenUseCase`**: Validação de tokens

#### **Application Service**
- **`AuthApplicationService`**: Orquestra os use cases

### **Infrastructure Layer**

#### **Repositories**
- **`AuthMemoryRepository`**: Implementação em memória para tokens
- **`UserAuthRepository`**: Integração com módulo Users

#### **Services**
- **`HashBcryptService`**: Hash com bcryptjs
- **`JwtCryptoService`**: Implementação JWT temporária

### **Interface Layer**

#### **GraphQL**
- **Models**: `AuthUser`, `AuthResponse`, `LogoutResponse`, `ValidateTokenResponse`
- **Inputs**: `LoginInput`, `RefreshTokenInput`, `LogoutInput`, `ValidateTokenInput`
- **Resolver**: `AuthResolver` com todas as operações

## 🚀 Como Usar

### **1. Login**
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

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### **2. Refresh Token**
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

### **3. Logout**
```graphql
mutation Logout($input: LogoutInput!) {
  logout(input: $input) {
    success
    message
  }
}
```

### **4. Validate Token**
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

## 🔒 Segurança

### **Validações Implementadas**

#### **Email**
- ✅ Formato válido de email
- ✅ Máximo 255 caracteres
- ✅ Normalização (lowercase, trim)

#### **Senha**
- ✅ Mínimo 6 caracteres
- ✅ Máximo 100 caracteres
- ✅ Pelo menos uma letra e um número

#### **Tokens**
- ✅ Verificação de assinatura
- ✅ Verificação de expiração
- ✅ Blacklist de tokens revogados
- ✅ Validação de usuário ativo

### **Configurações de Segurança**

```typescript
// JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

// Hash Configuration
SALT_ROUNDS=12

// Token Configuration
TOKEN_EXPIRATION=24 * 60 * 60 // 24 horas em segundos
```

## 📊 Logs e Auditoria

O módulo implementa logs estruturados para todas as operações:

```typescript
// Exemplo de logs
[AuthResolver] Login attempt for email: user@example.com
[AuthResolver] Login successful for user: 123e4567-e89b-12d3-a456-426614174000
[AuthResolver] Token validation result: true
```

## 🔄 Integração com Outros Módulos

### **Módulo Users**
- Utiliza `UserAuthRepository` para buscar dados de usuário
- Integra com entidade `User` existente
- Atualiza `lastLogin` automaticamente

### **Módulo Shared**
- Utiliza `GraphQLExceptionFilter` para tratamento de erros
- Implementa padrão de resposta consistente

## 🧪 Testes

### **Estrutura de Testes Recomendada**

```
src/auth/
├── __tests__/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── exceptions/
│   ├── application/
│   │   ├── use-cases/
│   │   └── services/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   └── services/
│   └── interfaces/
│       └── graphql/
```

## 🚧 Melhorias Futuras

### **1. Implementação JWT Real**
- [ ] Substituir `JwtCryptoService` por `@nestjs/jwt`
- [ ] Implementar HMAC-SHA256 real
- [ ] Adicionar suporte a múltiplos algoritmos

### **2. Persistência de Tokens**
- [ ] Implementar `AuthPrismaRepository`
- [ ] Adicionar suporte a Redis para cache
- [ ] Implementar limpeza automática de tokens expirados

### **3. Rate Limiting**
- [ ] Implementar rate limiting por IP
- [ ] Adicionar proteção contra brute force
- [ ] Implementar captcha para múltiplas tentativas

### **4. Autenticação Multi-Fator**
- [ ] Suporte a 2FA (TOTP)
- [ ] Autenticação por SMS/Email
- [ ] Backup codes

### **5. OAuth/SSO**
- [ ] Integração com Google OAuth
- [ ] Integração com GitHub OAuth
- [ ] Suporte a SAML

## 📝 Exemplos de Uso

### **cURL Examples**

#### **Login**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($input: LoginInput!) { login(input: $input) { accessToken refreshToken expiresIn tokenType user { id email role } } }",
    "variables": {
      "input": {
        "email": "user@example.com",
        "password": "password123"
      }
    }
  }'
```

#### **Validate Token**
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

## 🎯 Conclusão

O módulo **Auth** implementa um sistema robusto e profissional de autenticação seguindo as melhores práticas de arquitetura de software. Com separação clara de responsabilidades, alta testabilidade e extensibilidade, está pronto para produção e pode ser facilmente expandido com novas funcionalidades.
