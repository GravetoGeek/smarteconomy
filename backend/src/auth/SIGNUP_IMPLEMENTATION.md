# Authentication Module - Signup Implementation

## 📋 Resumo da Implementação

O endpoint de **signup** foi implementado seguindo os padrões arquiteturais estabelecidos no projeto SmartEconomy, utilizando Domain-Driven Design (DDD) e arquitetura hexagonal.

## 🚀 Funcionalidades Implementadas

### ✅ SignupUseCase
- Validação de email único no sistema
- Hash seguro da senha usando bcrypt
- Criação de usuário com dados completos
- Geração automática de tokens JWT (access + refresh)
- Logging completo para auditoria

### ✅ Validações de Input
- **Email**: Formato válido e obrigatório
- **Senha**: Mínimo 6 caracteres, obrigatória
- **Nome**: Mínimo 2 caracteres, obrigatório
- **Sobrenome**: Mínimo 2 caracteres, obrigatório
- **Data de nascimento**: Formato ISO válido, obrigatória
- **Gender ID**: UUID válido, obrigatório
- **Profession ID**: UUID válido, obrigatório

### ✅ Exceções Específicas
- `EmailAlreadyExistsException`: Email já cadastrado
- `InvalidEmailException`: Formato de email inválido
- `WeakPasswordException`: Senha não atende requisitos

## 📡 GraphQL Mutation

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

### Exemplo de Variáveis
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

## 🔄 Fluxo de Operação

1. **Validação de Input**: Verificação de formato e obrigatoriedade
2. **Verificação de Email**: Confirma se email não existe
3. **Hash da Senha**: Criptografia segura com bcrypt
4. **Criação do Usuário**: Inserção no banco com status ACTIVE
5. **Geração de Tokens**: JWT para autenticação imediata
6. **Resposta**: Dados do usuário e tokens de acesso

## ⚡ Integração com Outros Módulos

- **Users Module**: Criação efetiva do usuário
- **Auth Module**: Geração de tokens
- **Gender Module**: Validação de genderId
- **Profession Module**: Validação de professionId

## 🧪 Testes Disponíveis

- **Postman Collection**: Request configurado com exemplo
- **Variáveis de Ambiente**: Tokens salvos automaticamente
- **Scripts de Teste**: Validação de resposta automática

## 📚 Arquivos Modificados

```
src/auth/
├── application/
│   ├── use-cases/
│   │   └── signup.use-case.ts ✨ NOVO
│   └── services/
│       └── auth-application.service.ts ✏️ ATUALIZADO
├── domain/
│   ├── exceptions/
│   │   └── auth-domain.exception.ts ✏️ ATUALIZADO
│   └── ports/
│       └── user-repository.port.ts ✏️ ATUALIZADO
├── infrastructure/
│   └── repositories/
│       └── user-auth.repository.ts ✏️ ATUALIZADO
├── interfaces/
│   └── graphql/
│       ├── inputs/
│       │   └── auth.input.ts ✏️ ATUALIZADO
│       └── resolvers/
│           └── auth.resolver.ts ✏️ ATUALIZADO
└── auth.module.ts ✏️ ATUALIZADO
```

## 🔒 Segurança

- **Hash de Senha**: bcrypt com salt automático
- **Validação JWT**: Tokens assinados e verificados
- **Validação de Input**: Class-validator para sanitização
- **Exceções Específicas**: Não exposição de dados sensíveis

## 🚀 Próximos Passos

1. **Validação de Email**: Implementar verificação por email
2. **Captcha**: Adicionar proteção anti-bot
3. **Rate Limiting**: Limitar tentativas de signup
4. **Campos Opcionais**: Permitir signup simplificado

---

✅ **Status**: Implementação completa e funcional  
🏗️ **Arquitetura**: DDD + Hexagonal  
🔧 **Framework**: NestJS 11 + GraphQL  
📦 **Versão**: v2.0.0
