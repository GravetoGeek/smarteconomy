# 🚀 SmartEconomy Backend

> **Sistema de Gestão Financeira Pessoal com Arquitetura Hexagonal**

[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.3.1-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19.1-purple.svg)](https://www.prisma.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.9.0-pink.svg)](https://graphql.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Tecnologias](#-tecnologias)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚡ Quick Start](#-quick-start)
- [🔧 Configuração](#-configuração)
- [📚 Documentação](#-documentação)
- [🧪 Testes](#-testes)
- [🐳 Docker](#-docker)
- [📊 API GraphQL](#-api-graphql)
- [🔒 Segurança](#-segurança)
- [📈 Monitoramento](#-monitoramento)
- [🤝 Contribuição](#-contribuição)

## 🎯 **Visão Geral**

O **SmartEconomy Backend** é uma API robusta para gestão financeira pessoal, construída com **NestJS** e seguindo os princípios da **Arquitetura Hexagonal** e **Domain-Driven Design (DDD)**.

### **Características Principais**
- ✅ **Arquitetura Hexagonal** com separação clara de responsabilidades
- ✅ **GraphQL API** com schema auto-gerado
- ✅ **PostgreSQL** com Prisma ORM
- ✅ **Autenticação JWT** e autorização baseada em roles
- ✅ **Validação robusta** com class-validator
- ✅ **Logging estruturado** com Winston
- ✅ **Testes automatizados** (Unit, Integration, E2E)
- ✅ **Docker** para desenvolvimento e produção
- ✅ **CI/CD** com GitHub Actions

## 🏗️ **Arquitetura**

### **Arquitetura Hexagonal (Ports & Adapters)**

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACES (Adapters)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ GraphQL API │  │   REST API  │  │   Event Handlers    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION (Use Cases)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ User Mgmt   │  │ Transaction │  │   Dashboard         │ │
│  │ Use Cases   │  │ Use Cases   │  │   Use Cases         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN (Core)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Entities  │  │ Value Objs  │  │   Domain Services   │ │
│  │   & Rules   │  │   & Logic   │  │   & Exceptions      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE (Adapters)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Database   │  │   External  │  │   File Storage      │ │
│  │  Repos      │  │   Services  │  │   & Cache           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Princípios de Design**

- **🔌 Inversão de Dependência**: Dependemos de abstrações, não de implementações
- **🎯 Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **🧪 Testabilidade**: Fácil mock e teste de cada componente
- **🔄 Extensibilidade**: Novos adapters podem ser adicionados sem afetar o domínio
- **📚 Manutenibilidade**: Código organizado e fácil de entender

## 🚀 **Tecnologias**

### **Core Framework**
- **[NestJS 10](https://nestjs.com/)** - Framework Node.js para aplicações escaláveis
- **[TypeScript 5.1.3](https://www.typescriptlang.org/)** - Linguagem tipada para JavaScript

### **API & Comunicação**
- **[GraphQL](https://graphql.org/)** - Query language para APIs
- **[Apollo Server](https://www.apollographql.com/)** - Servidor GraphQL
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de dados

### **Banco de Dados**
- **[PostgreSQL 15+](https://www.postgresql.org/)** - Banco de dados relacional
- **[Prisma 5.19.1](https://www.prisma.io/)** - ORM moderno para TypeScript

### **Autenticação & Segurança**
- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcrypt](https://github.com/dcodeIO/bcrypt.js)** - Hash de senhas
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos

### **Infraestrutura**
- **[Docker](https://www.docker.com/)** - Containerização
- **[Winston](https://github.com/winstonjs/winston)** - Logging estruturado
- **[Config](https://github.com/nestjs/config)** - Gerenciamento de configuração

### **Desenvolvimento**
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Jest](https://jestjs.io/)** - Framework de testes

## 📁 **Estrutura do Projeto**

```
backend/
├── 📁 src/                          # Código fonte
│   ├── 📁 users/                    # Módulo de usuários (Arquitetura Hexagonal)
│   │   ├── 📁 domain/              # Entidades, Value Objects, Ports
│   │   ├── 📁 application/          # Use Cases, Application Services
│   │   ├── 📁 infrastructure/       # Repositórios, Serviços externos
│   │   ├── 📁 interfaces/           # GraphQL Resolvers
│   │   └── 📁 graphql/              # Types, Inputs, Models GraphQL
│   ├── 📁 auth/                     # Módulo de autenticação
│   ├── 📁 accounts/                 # Módulo de contas financeiras
│   ├── 📁 transactions/             # Módulo de transações
│   ├── 📁 categories/               # Módulo de categorias
│   ├── 📁 dashboards/               # Módulo de dashboards
│   ├── 📁 profiles/                 # Módulo de perfis
│   ├── 📁 gender/                   # Módulo de gêneros
│   ├── 📁 profession/               # Módulo de profissões
│   ├── 📁 database/                 # Configuração do banco de dados
│   ├── 📁 shared/                   # Serviços e utilitários compartilhados
│   └── 📁 app.module.ts             # Módulo principal da aplicação
├── 📁 prisma/                       # Schema e migrações do banco
├── 📁 docker/                       # Arquivos Docker
├── 📁 __tests__/                    # Testes da aplicação
├── 📄 .env.example                  # Exemplo de variáveis de ambiente
├── 📄 docker-compose.yml            # Orquestração de containers
└── 📄 package.json                  # Dependências e scripts
```

## ⚡ **Quick Start**

### **Pré-requisitos**
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### **1. Clone o Repositório**
```bash
git clone <repository-url>
cd smarteconomy/backend
```

### **2. Configure as Variáveis de Ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### **3. Inicie com Docker**
```bash
# Inicia todos os serviços
docker-compose up -d

# Verifica o status
docker-compose ps
```

### **4. Acesse a Aplicação**
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

### **5. Teste a API**
```bash
# Testa as queries GraphQL
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"query { users { id name email } }"}'

# Testa as mutations
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name } }","variables":{"input":{"email":"test@example.com","name":"Test","lastname":"User","birthdate":"1990-01-01","role":"USER","genderId":"gender-id","professionId":"profession-id","password":"password123"}}}'
```

## 🔧 **Configuração**

### **Variáveis de Ambiente**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smarteconomy?schema=public
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=smarteconomy
DATABASE_SCHEMA=public

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
```

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run start:dev          # Modo watch
npm run start:debug        # Modo debug
npm run start:prod         # Modo produção

# Build
npm run build              # Compila o projeto
npm run format             # Formata o código
npm run lint               # Linting

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Cobertura de testes

# Banco de dados
npm run prisma:migrateTest # Executa migrações
npm run db:seed            # Popula o banco com dados de teste

# Docker
docker-compose up -d       # Inicia serviços
docker-compose down        # Para serviços
docker-compose logs -f     # Visualiza logs
```

## 📚 **Documentação**

### **Documentação por Módulo**

- **[📖 Users Module](src/users/README.md)** - Módulo de usuários com arquitetura hexagonal
- **[🔧 Adapters Guide](src/users/infrastructure/adapters/README.md)** - Guia de extensão de adapters
- **[📋 Postman Guide](GUIA_POSTMAN.md)** - Guia completo para testar a API

### **Arquitetura e Padrões**

- **[🏗️ Arquitetura Hexagonal](docs/architecture/hexagonal.md)** - Princípios e implementação
- **[🎯 Domain-Driven Design](docs/architecture/ddd.md)** - Estratégias e táticas
- **[🔌 Ports & Adapters](docs/architecture/ports-adapters.md)** - Contratos e implementações

### **API Reference**

- **[📊 GraphQL Schema](src/schema.gql)** - Schema completo da API
- **[🚀 API Endpoints](docs/api/endpoints.md)** - Documentação dos endpoints
- **[📝 Examples](docs/api/examples.md)** - Exemplos de uso

## 🧪 **Testes**

### **Estrutura de Testes**

```
__tests__/
├── 📁 unit/              # Testes unitários
├── 📁 integration/       # Testes de integração
├── 📁 e2e/              # Testes end-to-end
└── 📁 fixtures/          # Dados de teste
```

### **Executando Testes**

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov

# Testes específicos
npm run test:e2e          # End-to-end
npm run test:int          # Integração
```

### **Cobertura de Testes**

- **Unit Tests**: Testam componentes isoladamente
- **Integration Tests**: Testam integração entre camadas
- **E2E Tests**: Testam fluxos completos da aplicação

## 🐳 **Docker**

### **Serviços Disponíveis**

```yaml
services:
  backend:      # API NestJS na porta 3000
  db:           # PostgreSQL na porta 5432
  migration:    # Executa migrações automaticamente
  studio:       # Prisma Studio na porta 5555
```

### **Comandos Docker**

```bash
# Inicia todos os serviços
docker-compose up -d

# Para todos os serviços
docker-compose down

# Reconstrói containers
docker-compose up --build

# Visualiza logs
docker-compose logs -f backend

# Executa comandos no container
docker-compose exec backend npm run test
```

## 📊 **API GraphQL**

### **Schema Principal**

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  lastname: String!
  birthdate: DateTime!
  role: String!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  users: [User!]!
  userById(id: String!): User
  userByEmail(email: String!): User
  searchUsers(input: SearchUsersInput!): SearchResult!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: String!, input: UpdateUserInput!): User
  deleteUser(id: String!): Boolean!
}
```

### **Exemplo de Uso**

```graphql
# Criar usuário
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

# Buscar usuários
query SearchUsers($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    items {
      id
      email
      name
      lastname
      role
    }
    total
    currentPage
    totalPages
  }
}
```

## 🔒 **Segurança**

### **Autenticação**
- **JWT Tokens** para autenticação stateless
- **bcrypt** para hash seguro de senhas
- **Role-based Access Control (RBAC)** para autorização

### **Validação**
- **Input validation** com class-validator
- **SQL injection protection** com Prisma ORM
- **Rate limiting** para prevenir abuso

### **Logs e Auditoria**
- **Logging estruturado** com Winston
- **Audit trails** para operações sensíveis
- **Error tracking** para monitoramento

## 📈 **Monitoramento**

### **Logs**
- **Structured logging** com Winston
- **Log levels** configuráveis (error, warn, info, debug)
- **Log rotation** para gerenciamento de arquivos

### **Métricas**
- **Performance monitoring** com NestJS interceptors
- **Database query monitoring** com Prisma
- **Health checks** para serviços

### **Alertas**
- **Error notifications** para falhas críticas
- **Performance alerts** para degradação
- **Database connection monitoring**

## 🤝 **Contribuição**

### **Como Contribuir**

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Código**

- **ESLint** para linting
- **Prettier** para formatação
- **Husky** para git hooks
- **Conventional Commits** para mensagens de commit

### **Testes**

- **100% de cobertura** para novos códigos
- **Testes unitários** obrigatórios
- **Testes de integração** para APIs
- **Testes E2E** para fluxos críticos

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 **Suporte**

### **Canais de Suporte**
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

### **Recursos Úteis**
- **[NestJS Documentation](https://docs.nestjs.com/)**
- **[Prisma Documentation](https://www.prisma.io/docs/)**
- **[GraphQL Documentation](https://graphql.org/learn/)**
- **[Docker Documentation](https://docs.docker.com/)**

---

**🚀 Desenvolvido com ❤️ pela equipe SmartEconomy**

*Última atualização: Janeiro 2025*
