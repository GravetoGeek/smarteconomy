# 💰 Accounts Module

> **Módulo de Gestão de Contas Financeiras com Arquitetura Hexagonal**

## 🎯 Visão Geral

O módulo **Accounts** é responsável pelo gerenciamento de contas financeiras dos usuários do SmartEconomy. Foi desenvolvido seguindo rigorosamente os princípios da **Arquitetura Hexagonal** e **Domain-Driven Design (DDD)**.

### **Características Principais**
- ✅ **Arquitetura Hexagonal** completa com separação de responsabilidades
- ✅ **Domain-Driven Design** com entidades ricas e regras de negócio
- ✅ **GraphQL API** com resolvers e inputs tipados
- ✅ **Validação robusta** com class-validator
- ✅ **Testes unitários** e de integração
- ✅ **Logging estruturado** para auditoria

## 🏗️ Arquitetura

### **Estrutura do Módulo**

```
src/accounts/
├── 📁 domain/                      # Camada de Domínio (Core)
│   ├── 📄 account.entity.ts        # Entidade Account com regras de negócio
│   ├── 📄 tokens.ts                # Tokens de injeção de dependência
│   └── 📁 ports/                   # Contratos/Interfaces
│       └── 📄 account-repository.port.ts
├── 📁 application/                 # Camada de Aplicação (Use Cases)
│   ├── 📁 use-cases/               # Casos de uso específicos
│   │   ├── 📄 create-account.use-case.ts
│   │   ├── 📄 find-account-by-id.use-case.ts
│   │   ├── 📄 find-accounts-by-user.use-case.ts
│   │   └── 📄 search-accounts.use-case.ts
│   └── 📁 services/                # Application Services
│       └── 📄 accounts-application.service.ts
├── 📁 infrastructure/              # Camada de Infraestrutura (Adapters)
│   └── 📁 repositories/            # Implementações de repositórios
│       └── 📄 accounts-prisma.repository.ts
├── 📁 interfaces/                  # Camada de Interface (Controllers)
│   └── 📁 graphql/                 # GraphQL API
│       ├── 📁 resolvers/           # GraphQL Resolvers
│       │   └── 📄 accounts.resolver.ts
│       ├── 📁 inputs/              # GraphQL Input Types
│       │   └── 📄 create-account.input.ts
│       └── 📁 models/              # GraphQL Object Types
│           └── 📄 account.model.ts
├── 📄 accounts.module.ts           # Módulo NestJS
└── 📄 index.ts                     # Barrel exports
```

### **Fluxo de Dados**

```
GraphQL Request → Resolver → Application Service → Use Case → Repository → Database
      ↓              ↓            ↓              ↓          ↓
GraphQL Response ← Resolver ← Application Service ← Use Case ← Repository ← Database
```

## 📊 **Domain Model**

### **Account Entity**

```typescript
export class Account {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly balance: number,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // 💰 Regras de Negócio
  credit(amount: number): Account {
    if (amount <= 0) {
      throw new AccountDomainException('Credit amount must be positive')
    }
    return new Account(
      this.id,
      this.name,
      this.type,
      this.balance + amount,
      this.userId,
      this.createdAt,
      new Date()
    )
  }

  debit(amount: number): Account {
    if (amount <= 0) {
      throw new AccountDomainException('Debit amount must be positive')
    }
    if (this.balance < amount) {
      throw new AccountDomainException('Insufficient balance')
    }
    return new Account(
      this.id,
      this.name,
      this.type,
      this.balance - amount,
      this.userId,
      this.createdAt,
      new Date()
    )
  }
}
```

### **Account Types**

```typescript
export enum AccountType {
  CHECKING = 'CHECKING',     // Conta Corrente
  SAVINGS = 'SAVINGS',       // Conta Poupança
  INVESTMENT = 'INVESTMENT', // Conta de Investimento
  CREDIT_CARD = 'CREDIT_CARD', // Cartão de Crédito
  WALLET = 'WALLET'          // Carteira
}
```

## 🚀 **Use Cases**

### **1. Create Account**
Cria uma nova conta financeira para um usuário.

```typescript
interface CreateAccountRequest {
  name: string
  type: AccountType
  balance?: number
  userId: string
}

interface CreateAccountResponse {
  account: Account
}
```

### **2. Find Account By ID**
Busca uma conta específica pelo ID.

```typescript
interface FindAccountByIdRequest {
  id: string
}

interface FindAccountByIdResponse {
  account: Account | null
}
```

### **3. Find Accounts By User**
Busca todas as contas de um usuário específico.

```typescript
interface FindAccountsByUserRequest {
  userId: string
}

interface FindAccountsByUserResponse {
  accounts: Account[]
}
```

### **4. Search Accounts**
Busca contas com filtros, paginação e ordenação.

```typescript
interface SearchAccountsRequest {
  page: number
  limit: number
  filter?: string
  sort?: string
  sortDirection?: 'asc' | 'desc'
}

interface SearchAccountsResponse {
  accounts: Account[]
  total: number
  currentPage: number
  totalPages: number
}
```

## 📡 **GraphQL API**

### **Types**

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

input CreateAccountInput {
  name: String!
  type: String!
  balance: Float
  userId: String!
}
```

### **Queries**

```graphql
# Buscar contas por usuário
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

# Buscar conta específica
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

### **Mutations**

```graphql
# Criar nova conta
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

### **Exemplos de Uso**

#### **Criar Conta Corrente**
```graphql
mutation CreateCheckingAccount {
  createAccount(input: {
    name: "Conta Corrente Principal"
    type: "CHECKING"
    balance: 1000.0
    userId: "user-123"
  }) {
    id
    name
    type
    balance
    createdAt
  }
}
```

#### **Criar Conta Poupança**
```graphql
mutation CreateSavingsAccount {
  createAccount(input: {
    name: "Conta Poupança"
    type: "SAVINGS"
    balance: 5000.0
    userId: "user-123"
  }) {
    id
    name
    type
    balance
    createdAt
  }
}
```

#### **Buscar Contas do Usuário**
```graphql
query GetUserAccounts {
  accountsByUser(userId: "user-123") {
    id
    name
    type
    balance
    createdAt
  }
}
```

## 🔌 **Ports & Adapters**

### **Repository Port** (Domain)

```typescript
export interface AccountRepositoryPort {
  create(account: Account): Promise<Account>
  findById(id: string): Promise<Account | null>
  findByUserId(userId: string): Promise<Account[]>
  update(account: Account): Promise<Account>
  delete(id: string): Promise<void>
  search(criteria: SearchCriteria): Promise<SearchResult<Account>>
}
```

### **Prisma Repository Adapter** (Infrastructure)

```typescript
@Injectable()
export class AccountsPrismaRepository implements AccountRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(account: Account): Promise<Account> {
    const data = await this.prisma.account.create({
      data: {
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        userId: account.userId,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }
    })
    return this.toDomain(data)
  }

  private toDomain(data: any): Account {
    return new Account(
      data.id,
      data.name,
      data.type as AccountType,
      data.balance,
      data.userId,
      data.createdAt,
      data.updatedAt
    )
  }
}
```

## 🧪 **Testes**

### **Estrutura de Testes**

```
src/accounts/__tests__/
├── 📁 unit/
│   ├── 📄 account.entity.spec.ts
│   ├── 📄 create-account.use-case.spec.ts
│   └── 📄 accounts-application.service.spec.ts
├── 📁 integration/
│   ├── 📄 accounts-prisma.repository.spec.ts
│   └── 📄 accounts.resolver.spec.ts
└── 📁 e2e/
    └── 📄 accounts.e2e-spec.ts
```

### **Exemplo de Teste Unitário**

```typescript
describe('Account Entity', () => {
  let account: Account

  beforeEach(() => {
    account = new Account(
      '123',
      'Test Account',
      AccountType.CHECKING,
      1000,
      'user-123',
      new Date(),
      new Date()
    )
  })

  describe('credit', () => {
    it('should add amount to balance', () => {
      const result = account.credit(500)
      expect(result.balance).toBe(1500)
    })

    it('should throw error for negative amount', () => {
      expect(() => account.credit(-100))
        .toThrow('Credit amount must be positive')
    })
  })

  describe('debit', () => {
    it('should subtract amount from balance', () => {
      const result = account.debit(300)
      expect(result.balance).toBe(700)
    })

    it('should throw error for insufficient balance', () => {
      expect(() => account.debit(1500))
        .toThrow('Insufficient balance')
    })
  })
})
```

## 📈 **Monitoramento e Logging**

### **Logs Estruturados**

O módulo utiliza logging estruturado para auditoria e monitoramento:

```typescript
// Exemplo de logs no resolver
this.logger.logOperation('GRAPHQL_CREATE_ACCOUNT_START', input, 'AccountsResolver')
this.logger.logOperation('GRAPHQL_CREATE_ACCOUNT_SUCCESS', { id: result.id }, 'AccountsResolver')
```

### **Eventos de Auditoria**

- `ACCOUNT_CREATED` - Conta criada
- `ACCOUNT_UPDATED` - Conta atualizada
- `ACCOUNT_CREDITED` - Crédito realizado
- `ACCOUNT_DEBITED` - Débito realizado
- `ACCOUNT_DELETED` - Conta excluída

## 🚀 **Futuras Melhorias**

### **Próximas Features**
- [ ] **Account Categories** - Categorização de contas
- [ ] **Balance History** - Histórico de saldos
- [ ] **Account Limits** - Limites de saque/crédito
- [ ] **Currency Support** - Suporte a múltiplas moedas
- [ ] **Account Sharing** - Compartilhamento de contas

### **Integrações Futuras**
- [ ] **Bank API Integration** - Integração com APIs bancárias
- [ ] **Real-time Notifications** - Notificações em tempo real
- [ ] **Account Synchronization** - Sincronização automática

## 🤝 **Contribuindo**

### **Adicionando Novos Adapters**

Para adicionar um novo adapter (ex: MongoDB Repository):

1. **Implemente a interface** `AccountRepositoryPort`
2. **Registre no módulo** como provider
3. **Configure via environment** para seleção dinâmica

### **Adicionando Novos Use Cases**

1. **Crie o arquivo** em `application/use-cases/`
2. **Implemente as interfaces** de Request/Response
3. **Registre no Application Service**
4. **Adicione testes unitários**

### **Extendendo a API GraphQL**

1. **Adicione resolver methods** em `AccountsResolver`
2. **Crie input types** se necessário
3. **Atualize os models** GraphQL
4. **Documente na API**

---

**💰 Módulo desenvolvido seguindo princípios de Clean Architecture e DDD**

*Última atualização: Agosto 2025*
