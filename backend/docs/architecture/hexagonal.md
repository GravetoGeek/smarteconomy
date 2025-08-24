# 🏗️ Arquitetura Hexagonal (Ports & Adapters)

> **Implementação Profissional da Arquitetura Hexagonal no SmartEconomy Backend**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🏛️ Princípios Fundamentais](#️-princípios-fundamentais)
- [🔌 Ports (Contratos)](#-ports-contratos)
- [🔧 Adapters (Implementações)](#-adapters-implementações)
- [📁 Estrutura de Camadas](#-estrutura-de-camadas)
- [🔄 Fluxo de Dados](#-fluxo-de-dados)
- [💡 Benefícios](#-benefícios)
- [🚀 Implementação no Projeto](#-implementação-no-projeto)
- [🧪 Testabilidade](#-testabilidade)
- [🔍 Exemplos Práticos](#-exemplos-práticos)

## 🎯 **Visão Geral**

A **Arquitetura Hexagonal** (também conhecida como **Ports & Adapters**) é um padrão arquitetural que promove a **separação de responsabilidades** e **inversão de dependência**. No SmartEconomy Backend, esta arquitetura é implementada para garantir:

- ✅ **Domínio isolado** e independente de frameworks
- ✅ **Testabilidade** máxima de cada componente
- ✅ **Flexibilidade** para trocar implementações
- ✅ **Manutenibilidade** e escalabilidade
- ✅ **Adoção de novas tecnologias** sem afetar o core

## 🏛️ **Princípios Fundamentais**

### **1. Inversão de Dependência**
```typescript
// ❌ ERRADO: Dependência direta de implementação
export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UsersPrismaRepository // ← Concreto
    ) {}
}

// ✅ CORRETO: Dependência de abstração (Port)
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort // ← Abstração
    ) {}
}
```

### **2. Separação de Responsabilidades**
- **Domain**: Lógica de negócio pura
- **Application**: Casos de uso e coordenação
- **Infrastructure**: Implementações técnicas
- **Interfaces**: Contratos de entrada/saída

### **3. Isolamento do Domínio**
```typescript
// Domain não conhece frameworks externos
export class User {
    private readonly _id: string
    private readonly _email: Email
    private _name: string

    // Lógica de negócio pura
    isAdmin(): boolean {
        return this._role === UserRole.ADMIN
    }

    activate(): void {
        this._status = AccountStatus.ACTIVE
    }
}
```

## 🔌 **Ports (Contratos)**

### **Definição de Ports**

Os **Ports** são interfaces que definem **contratos** entre as camadas. Eles estabelecem o que cada camada espera receber, sem especificar como será implementado.

#### **Port de Repositório**
```typescript
// domain/ports/user-repository.port.ts
export interface UserRepositoryPort {
    readonly sortableFields: string[]

    // Core CRUD operations
    save(user: User): Promise<User>
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findAll(): Promise<User[]>
    delete(id: string): Promise<void>

    // Search operations
    search(search: SearchParams): Promise<SearchResult>

    // Business operations
    existsByEmail(email: string): Promise<boolean>
    existsById(id: string): Promise<boolean>
}
```

#### **Port de Serviço**
```typescript
// domain/ports/hash-service.port.ts
export interface HashServicePort {
    hash(password: string): Promise<string>
    compare(password: string, hash: string): Promise<boolean>
}
```

### **Características dos Ports**

- **🔒 Contratos rígidos**: Definem exatamente o que deve ser implementado
- **📝 Documentação clara**: Cada método tem propósito bem definido
- **🔄 Independentes de tecnologia**: Não mencionam implementações específicas
- **🧪 Fáceis de mock**: Para testes unitários

## 🔧 **Adapters (Implementações)**

### **Tipos de Adapters**

#### **1. Adapters de Entrada (Interfaces)**
```typescript
// interfaces/graphql/resolvers/users.resolver.ts
@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersApplicationService: UsersApplicationService
    ) {}

    @Query(() => [User])
    async users(): Promise<User[]> {
        const result = await this.usersApplicationService.searchUsers({
            page: 1,
            limit: 100
        })
        return result.users
    }
}
```

#### **2. Adapters de Saída (Infrastructure)**
```typescript
// infrastructure/repositories/users-prisma.repository.ts
@Injectable()
export class UsersPrismaRepository implements UserRepositoryPort {
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    async save(user: User): Promise<User> {
        try {
            const userData = {
                email: user.email,
                name: user.name,
                // ... outros campos
            }

            const savedUser = await this.prisma.user.upsert({
                where: { id: user.id },
                update: userData,
                create: { id: user.id, ...userData }
            })

            return User.reconstitute(savedUser)
        } catch (error) {
            this.loggerService.logError('SAVE_USER_ERROR', error, 'UsersPrismaRepository')
            throw error
        }
    }
}
```

### **Características dos Adapters**

- **🎯 Implementam Ports**: Respeitam contratos definidos
- **🔧 Tecnologia específica**: Conhecem frameworks e bibliotecas
- **📊 Logging e monitoramento**: Implementam observabilidade
- **🔄 Tratamento de erros**: Convertem erros técnicos em erros de domínio

## 📁 **Estrutura de Camadas**

### **Organização das Camadas**

```
src/users/
├── 📁 domain/                    # 🎯 Core Business (Ports + Entities)
│   ├── 📁 ports/                # 🔌 Contratos (Interfaces)
│   ├── 📁 entities/             # 🏗️ Entidades de negócio
│   ├── 📁 value-objects/        # 💎 Objetos de valor
│   ├── 📁 exceptions/           # ⚠️ Exceções de domínio
│   └── 📁 services/             # 🔧 Serviços de domínio
├── 📁 application/               # 📋 Use Cases + Application Services
│   ├── 📁 use-cases/            # 🎯 Casos de uso específicos
│   └── 📁 services/             # 🔄 Serviços de aplicação
├── 📁 infrastructure/            # 🔧 Adapters de Saída
│   ├── 📁 repositories/         # 💾 Implementações de repositório
│   ├── 📁 services/             # 🔧 Implementações de serviços
│   └── 📁 adapters/             # 🔌 Outros adapters
└── 📁 interfaces/                # 🌐 Adapters de Entrada
    └── 📁 graphql/              # 📊 API GraphQL
```

### **Responsabilidades de Cada Camada**

#### **Domain Layer**
- **Entidades**: Regras de negócio e validações
- **Value Objects**: Objetos imutáveis com validações
- **Ports**: Contratos para serviços externos
- **Exceções**: Erros específicos do domínio

#### **Application Layer**
- **Use Cases**: Casos de uso específicos da aplicação
- **Application Services**: Orquestração de use cases
- **DTOs**: Transferência de dados entre camadas

#### **Infrastructure Layer**
- **Repositories**: Implementações de persistência
- **Services**: Implementações de serviços externos
- **Adapters**: Conversores de dados e protocolos

#### **Interfaces Layer**
- **Resolvers**: Endpoints GraphQL
- **Controllers**: Endpoints REST (se aplicável)
- **Event Handlers**: Manipuladores de eventos

## 🔄 **Fluxo de Dados**

### **Fluxo Típico de uma Operação**

```
1. GraphQL Resolver (Interface)
   ↓
2. Application Service (Application)
   ↓
3. Use Case (Application)
   ↓
4. Domain Entity (Domain)
   ↓
5. Repository Port (Domain)
   ↓
6. Prisma Repository (Infrastructure)
   ↓
7. PostgreSQL Database
```

### **Exemplo de Fluxo Completo**

```typescript
// 1. Interface Layer
@Mutation(() => User)
async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersApplicationService.createUser(input)
}

// 2. Application Layer
async createUser(dto: CreateUserDto): Promise<User> {
    const request: CreateUserRequest = {
        email: dto.email,
        name: dto.name,
        // ... outros campos
    }

    const response = await this.createUserUseCase.execute(request)
    return response.user
}

// 3. Use Case Layer
async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Validações de domínio
    const emailExists = await this.userRepository.existsByEmail(request.email)
    if (emailExists) {
        throw new UserEmailAlreadyExistsException(request.email)
    }

    // Criação da entidade
    const user = User.create({ ...request })

    // Persistência
    const savedUser = await this.userRepository.save(user)

    return { user: savedUser }
}

// 4. Infrastructure Layer
async save(user: User): Promise<User> {
    const userData = {
        email: user.email,
        name: user.name,
        // ... outros campos
    }

    const savedUser = await this.prisma.user.create({
        data: userData
    })

    return User.reconstitute(savedUser)
}
```

## 💡 **Benefícios**

### **1. Testabilidade**
```typescript
// Teste fácil com mocks
describe('CreateUserUseCase', () => {
    it('should create user successfully', async () => {
        const mockRepository = createMock<UserRepositoryPort>()
        const mockHashService = createMock<HashServicePort>()

        mockRepository.existsByEmail.mockResolvedValue(false)
        mockRepository.save.mockResolvedValue(mockUser)
        mockHashService.hash.mockResolvedValue('hashedPassword')

        const useCase = new CreateUserUseCase(mockRepository, mockHashService)
        const result = await useCase.execute(createUserRequest)

        expect(result.user).toBeDefined()
        expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User))
    })
})
```

### **2. Flexibilidade**
```typescript
// Fácil troca de implementações
@Module({
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: process.env.USE_MONGO === 'true'
                ? UsersMongoRepository
                : UsersPrismaRepository
        }
    ]
})
```

### **3. Manutenibilidade**
- **Código organizado** por responsabilidade
- **Dependências claras** e explícitas
- **Mudanças isoladas** em cada camada
- **Documentação implícita** na estrutura

### **4. Escalabilidade**
- **Novos adapters** sem afetar domínio
- **Múltiplas interfaces** para diferentes clientes
- **Microserviços** baseados na mesma arquitetura
- **Event-driven architecture** facilmente implementável

## 🚀 **Implementação no Projeto**

### **Módulo Users como Exemplo**

O módulo `users` implementa completamente a arquitetura hexagonal:

#### **Domain Layer**
```typescript
// Entidade com lógica de negócio
export class User {
    private readonly _id: string
    private readonly _email: Email
    private _name: string

    // Factory methods
    static create(props: CreateUserProps): User {
        return new User(props)
    }

    static reconstitute(data: any): User {
        return new User({
            id: data.id,
            email: data.email,
            // ... outros campos
        })
    }

    // Business methods
    promoteToAdmin(): void {
        this._role = UserRole.ADMIN
    }

    isActive(): boolean {
        return this._status === AccountStatus.ACTIVE
    }
}
```

#### **Application Layer**
```typescript
// Use Case isolado e testável
@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE)
        private readonly hashService: HashServicePort
    ) {}

    async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // Business logic
        const emailExists = await this.userRepository.existsByEmail(request.email)
        if (emailExists) {
            throw new UserEmailAlreadyExistsException(request.email)
        }

        // Domain entity creation
        const user = User.create(request)

        // Persistence
        const savedUser = await this.userRepository.save(user)

        return { user: savedUser }
    }
}
```

#### **Infrastructure Layer**
```typescript
// Repository implementation
@Injectable()
export class UsersPrismaRepository implements UserRepositoryPort {
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    async save(user: User): Promise<User> {
        try {
            const userData = this.mapToPrisma(user)
            const savedUser = await this.prisma.user.upsert({
                where: { id: user.id },
                update: userData,
                create: { id: user.id, ...userData }
            })

            return User.reconstitute(savedUser)
        } catch (error) {
            this.loggerService.logError('SAVE_USER_ERROR', error, 'UsersPrismaRepository')
            throw error
        }
    }

    private mapToPrisma(user: User): any {
        return {
            email: user.email,
            name: user.name,
            // ... outros campos
        }
    }
}
```

#### **Interfaces Layer**
```typescript
// GraphQL resolver
@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersApplicationService: UsersApplicationService
    ) {}

    @Mutation(() => User)
    async createUser(@Args('input') input: CreateUserInput): Promise<User> {
        try {
            this.loggerService.logOperation('GRAPHQL_CREATE_USER_START',
                { email: input.email }, 'UsersResolver')

            const user = await this.usersApplicationService.createUser(input)

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

## 🧪 **Testabilidade**

### **Estratégias de Teste**

#### **1. Testes Unitários**
```typescript
// Teste de entidade
describe('User Entity', () => {
    it('should create user with valid data', () => {
        const user = User.create({
            email: 'test@example.com',
            name: 'John',
            lastname: 'Doe',
            birthdate: '1990-01-01',
            role: UserRole.USER,
            genderId: 'gender-id',
            professionId: 'profession-id',
            password: 'SecurePass123'
        })

        expect(user.email).toBe('test@example.com')
        expect(user.isActive()).toBe(true)
        expect(user.isAdmin()).toBe(false)
    })

    it('should promote user to admin', () => {
        const user = User.create({ /* ... */ })
        user.promoteToAdmin()

        expect(user.isAdmin()).toBe(true)
    })
})
```

#### **2. Testes de Use Case**
```typescript
// Teste com mocks
describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase
    let mockRepository: jest.Mocked<UserRepositoryPort>
    let mockHashService: jest.Mocked<HashServicePort>

    beforeEach(() => {
        mockRepository = createMock<UserRepositoryPort>()
        mockHashService = createMock<HashServicePort>()
        useCase = new CreateUserUseCase(mockRepository, mockHashService)
    })

    it('should create user successfully', async () => {
        // Arrange
        const request = createUserRequest()
        mockRepository.existsByEmail.mockResolvedValue(false)
        mockHashService.hash.mockResolvedValue('hashedPassword')
        mockRepository.save.mockResolvedValue(mockUser)

        // Act
        const result = await useCase.execute(request)

        // Assert
        expect(result.user).toBeDefined()
        expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User))
    })

    it('should throw error if email already exists', async () => {
        // Arrange
        const request = createUserRequest()
        mockRepository.existsByEmail.mockResolvedValue(true)

        // Act & Assert
        await expect(useCase.execute(request))
            .rejects
            .toThrow(UserEmailAlreadyExistsException)
    })
})
```

#### **3. Testes de Integração**
```typescript
// Teste com banco real
describe('UsersPrismaRepository Integration', () => {
    let repository: UsersPrismaRepository
    let prisma: PrismaService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [UsersPrismaRepository, LoggerService]
        }).compile()

        repository = module.get<UsersPrismaRepository>(UsersPrismaRepository)
        prisma = module.get<PrismaService>(PrismaService)
    })

    afterEach(async () => {
        await prisma.user.deleteMany()
    })

    it('should save and retrieve user', async () => {
        // Arrange
        const user = User.create(createUserData())

        // Act
        const savedUser = await repository.save(user)
        const retrievedUser = await repository.findById(savedUser.id)

        // Assert
        expect(retrievedUser).toBeDefined()
        expect(retrievedUser?.email).toBe(user.email)
    })
})
```

## 🔍 **Exemplos Práticos**

### **1. Adicionando Novo Adapter**

```typescript
// Novo repositório para MongoDB
@Injectable()
export class UsersMongoRepository implements UserRepositoryPort {
    constructor(
        private readonly mongoService: MongoService
    ) {}

    async save(user: User): Promise<User> {
        const userData = {
            _id: user.id,
            email: user.email,
            name: user.name,
            // ... outros campos
        }

        await this.mongoService.collection('users').updateOne(
            { _id: user.id },
            { $set: userData },
            { upsert: true }
        )

        return user
    }

    // ... implementar outros métodos
}

// Configuração no módulo
@Module({
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: process.env.USE_MONGO === 'true'
                ? UsersMongoRepository
                : UsersPrismaRepository
        }
    ]
})
```

### **2. Adicionando Nova Interface**

```typescript
// REST API Controller
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersApplicationService: UsersApplicationService
    ) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersApplicationService.createUser(createUserDto)
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
        return this.usersApplicationService.findUserById(id)
    }
}

// Configuração no módulo
@Module({
    providers: [
        UsersResolver,      // GraphQL
        UsersController,    // REST
        // ... outros providers
    ]
})
```

### **3. Event-Driven Architecture**

```typescript
// Domain Event
export class UserCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly timestamp: Date
    ) {}
}

// Use Case com eventos
@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE)
        private readonly hashService: HashServicePort,
        private readonly eventBus: EventBus
    ) {}

    async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // ... lógica de criação

        const savedUser = await this.userRepository.save(user)

        // Publica evento
        this.eventBus.publish(new UserCreatedEvent(
            savedUser.id,
            savedUser.email,
            new Date()
        ))

        return { user: savedUser }
    }
}

// Event Handler
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler {
    constructor(
        private readonly emailService: EmailService
    ) {}

    async handle(event: UserCreatedEvent) {
        await this.emailService.sendWelcomeEmail(event.email)
    }
}
```

## 🎯 **Conclusão**

A **Arquitetura Hexagonal** implementada no SmartEconomy Backend oferece:

- **🔒 Domínio protegido** de mudanças externas
- **🧪 Testabilidade máxima** com mocks simples
- **🔄 Flexibilidade** para trocar implementações
- **📚 Manutenibilidade** com código organizado
- **🚀 Escalabilidade** para crescimento futuro

Esta implementação segue as **melhores práticas** da indústria e serve como **referência** para outros módulos do sistema.

---

**📖 Para mais detalhes, consulte:**
- [Domain-Driven Design](ddd.md)
- [Ports & Adapters](ports-adapters.md)
- [Módulo Users](../users/README.md)
