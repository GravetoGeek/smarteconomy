# 🎯 Domain-Driven Design (DDD)

> **Implementação de Estratégias e Táticas DDD no SmartEconomy Backend**

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Estratégias DDD](#️-estratégias-ddd)
- [⚡ Táticas DDD](#-táticas-ddd)
- [🔍 Bounded Contexts](#-bounded-contexts)
- [💎 Value Objects](#-value-objects)
- [🏛️ Entities](#️-entities)
- [🔧 Domain Services](#-domain-services)
- [📚 Aggregates](#-aggregates)
- [🔄 Domain Events](#-domain-events)
- [🚀 Implementação no Projeto](#-implementação-no-projeto)
- [🧪 Testes DDD](#-testes-ddd)
- [📈 Benefícios](#-benefícios)

## 🎯 **Visão Geral**

**Domain-Driven Design (DDD)** é uma abordagem para o desenvolvimento de software que coloca o **domínio de negócio** no centro do design. No SmartEconomy Backend, o DDD é implementado para:

- ✅ **Alinhar código com regras de negócio**
- ✅ **Criar modelos ricos e expressivos**
- ✅ **Facilitar comunicação entre desenvolvedores e especialistas**
- ✅ **Construir software que evolui com o domínio**
- ✅ **Implementar arquitetura hexagonal de forma eficaz**

### **Princípios Fundamentais**

- **🎯 Foco no Domínio**: O domínio de negócio é a prioridade
- **🗣️ Linguagem Ubíqua**: Termos consistentes em todo o projeto
- **🧠 Modelo Mental**: Código reflete a compreensão do negócio
- **🔄 Evolução Contínua**: O modelo evolui com o conhecimento

## 🏗️ **Estratégias DDD**

### **1. Bounded Contexts**

**Bounded Contexts** são limites claros onde um modelo específico se aplica. No SmartEconomy, temos:

#### **Users Context**
```typescript
// Bounded Context: User Management
export class User {
    // Modelo específico para gestão de usuários
    private readonly _id: string
    private readonly _email: Email
    private _name: string
    private _role: UserRole
    private _status: AccountStatus

    // Regras de negócio específicas do contexto
    canAccessAdminPanel(): boolean {
        return this._role === UserRole.ADMIN && this._status === AccountStatus.ACTIVE
    }

    canResetPassword(): boolean {
        return this._status !== AccountStatus.SUSPENDED
    }
}
```

#### **Financial Context**
```typescript
// Bounded Context: Financial Management
export class Transaction {
    private readonly _id: string
    private readonly _amount: Money
    private readonly _type: TransactionType
    private readonly _category: Category
    private readonly _date: TransactionDate
    private _status: TransactionStatus

    // Regras de negócio específicas do contexto financeiro
    isExpense(): boolean {
        return this._type === TransactionType.EXPENSE
    }

    isIncome(): boolean {
        return this._type === TransactionType.INCOME
    }

    isTransfer(): boolean {
        return this._type === TransactionType.TRANSFER
    }

    canBeReversed(): boolean {
        return this._status === TransactionStatus.COMPLETED &&
            this.daysSinceCreation() <= 30
    }

    canBeCompleted(): boolean {
        return this._status === TransactionStatus.PENDING
    }

    canBeCancelled(): boolean {
        return this._status === TransactionStatus.PENDING ||
            this._status === TransactionStatus.FAILED
    }
}

export class Account {
    private readonly _id: string
    private _name: string
    private readonly _type: AccountType
    private _balance: Money
    private readonly _userId: string
    private _status: AccountStatus

    // Regras de negócio específicas das contas
    canReceiveDeposit(): boolean {
        return this._status === AccountStatus.ACTIVE &&
            this._type !== AccountType.CREDIT_CARD
    }

    canMakeWithdrawal(amount: Money): boolean {
        return this._status === AccountStatus.ACTIVE &&
            this.hasEnoughBalance(amount)
    }

    hasEnoughBalance(amount: Money): boolean {
        if (this._type === AccountType.CREDIT_CARD) {
            return this._balance.add(amount).getValue() <= this.getCreditLimit()
        }
        return this._balance.isGreaterThanOrEqual(amount)
    }
}
```

#### **Dashboard Context**
```typescript
// Bounded Context: Financial Analytics
export class DashboardMetrics {
    private readonly _userId: string
    private readonly _period: TimePeriod
    private readonly _totalBalance: Money
    private readonly _totalIncome: Money
    private readonly _totalExpenses: Money
    private readonly _expensesByCategory: CategoryExpense[]

    // Regras de negócio específicas do contexto de analytics
    getNetWorth(): Money {
        return this._totalIncome.subtract(this._totalExpenses)
    }

    getMonthlyGrowth(): number {
        // Lógica específica para cálculo de crescimento
        return this.calculateGrowthPercentage()
    }

    getFinancialHealth(): FinancialHealthScore {
        const savings = this.getSavingsRate()
        const debt = this.getDebtRatio()
        const emergency = this.getEmergencyFundRatio()

        return FinancialHealthScore.calculate(savings, debt, emergency)
    }

    getSpendingTrends(): SpendingTrend[] {
        return this._expensesByCategory.map(category =>
            SpendingTrend.fromCategoryExpense(category)
        )
    }
}
```

### **2. Context Mapping**

#### **Shared Kernel**
```typescript
// shared/domain/value-objects/money.vo.ts
export class Money {
    private readonly amount: number
    private readonly currency: Currency

    constructor(amount: number, currency: Currency = Currency.BRL) {
        this.validateAmount(amount)
        this.amount = amount
        this.currency = currency
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add money with different currencies')
        }
        return new Money(this.amount + other.amount, this.currency)
    }

    multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency)
    }

    isPositive(): boolean {
        return this.amount > 0
    }

    isNegative(): boolean {
        return this.amount < 0
    }
}
```

#### **Customer-Supplier Relationship**
```typescript
// Users Context depende de Gender/Profession Context
export class User {
    constructor(props: {
        // ... outros campos
        genderId: string      // Referência ao Gender Context
        professionId: string // Referência ao Profession Context
    }) {
        // Validações específicas do contexto
        this.validateGenderReference(props.genderId)
        this.validateProfessionReference(props.professionId)
    }
}

// Financial Context depende de Users Context
export class Account {
    constructor(props: {
        // ... outros campos
        userId: string        // Referência ao Users Context
    }) {
        this.validateUserReference(props.userId)
    }
}

// Transactions Context depende de Accounts e Categories Context
export class Transaction {
    constructor(props: {
        // ... outros campos
        accountId: string     // Referência ao Accounts Context
        categoryId: string    // Referência ao Categories Context
        destinationAccountId?: string // Para transferências
    }) {
        this.validateAccountReference(props.accountId)
        this.validateCategoryReference(props.categoryId)
        if (props.destinationAccountId) {
            this.validateDestinationAccount(props.destinationAccountId)
        }
    }
}

// Dashboard Context depende de múltiplos contextos
export class DashboardMetrics {
    constructor(
        private readonly userId: string,           // Users Context
        private readonly accountService: any,     // Accounts Context
        private readonly transactionService: any, // Transactions Context
        private readonly categoryService: any     // Categories Context
    ) {}
}
```

## ⚡ **Táticas DDD**

### **1. Value Objects**

**Value Objects** são objetos imutáveis que representam conceitos do domínio sem identidade própria.

#### **Email Value Object**
```typescript
// domain/value-objects/email.vo.ts
export class Email {
    private readonly value: string

    constructor(email: string) {
        this.validate(email)
        this.value = email.toLowerCase().trim()
    }

    private validate(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format')
        }

        if (email.length > 255) {
            throw new Error('Email too long')
        }
    }

    getValue(): string {
        return this.value
    }

    equals(other: Email): boolean {
        return this.value === other.value
    }

    toString(): string {
        return this.value
    }

    // Métodos de negócio
    getDomain(): string {
        return this.value.split('@')[1]
    }

    isCorporate(): boolean {
        const corporateDomains = ['company.com', 'enterprise.org']
        return corporateDomains.includes(this.getDomain())
    }
}
```

#### **TransactionAmount Value Object**
```typescript
// domain/value-objects/transaction-amount.vo.ts
export class TransactionAmount {
    private readonly value: number

    constructor(amount: number) {
        this.validate(amount)
        this.value = Math.round(amount * 100) / 100 // Garantir 2 casas decimais
    }

    private validate(amount: number): void {
        if (amount <= 0) {
            throw new Error('Transaction amount must be positive')
        }

        if (amount > 999999.99) {
            throw new Error('Transaction amount exceeds maximum limit')
        }

        if (!Number.isFinite(amount)) {
            throw new Error('Transaction amount must be a valid number')
        }
    }

    getValue(): number {
        return this.value
    }

    // Métodos de negócio específicos para transações
    isLarge(): boolean {
        return this.value > 10000
    }

    isMicro(): boolean {
        return this.value < 1
    }

    getFormattedValue(currency: string = 'BRL'): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(this.value)
    }

    multiply(factor: number): TransactionAmount {
        return new TransactionAmount(this.value * factor)
    }

    add(other: TransactionAmount): TransactionAmount {
        return new TransactionAmount(this.value + other.value)
    }

    subtract(other: TransactionAmount): TransactionAmount {
        return new TransactionAmount(this.value - other.value)
    }

    equals(other: TransactionAmount): boolean {
        return this.value === other.value
    }

    isGreaterThan(other: TransactionAmount): boolean {
        return this.value > other.value
    }

    isLessThan(other: TransactionAmount): boolean {
        return this.value < other.value
    }
}
```

#### **AccountBalance Value Object**
```typescript
// domain/value-objects/account-balance.vo.ts
export class AccountBalance {
    private readonly value: number
    private readonly accountType: AccountType

    constructor(balance: number, accountType: AccountType) {
        this.accountType = accountType
        this.validate(balance)
        this.value = Math.round(balance * 100) / 100
    }

    private validate(balance: number): void {
        if (!Number.isFinite(balance)) {
            throw new Error('Balance must be a valid number')
        }

        // Contas de crédito podem ter saldo negativo
        if (this.accountType !== AccountType.CREDIT_CARD && balance < 0) {
            throw new Error('Balance cannot be negative for this account type')
        }

        if (Math.abs(balance) > 9999999.99) {
            throw new Error('Balance exceeds maximum limit')
        }
    }

    getValue(): number {
        return this.value
    }

    isPositive(): boolean {
        return this.value > 0
    }

    isNegative(): boolean {
        return this.value < 0
    }

    isZero(): boolean {
        return this.value === 0
    }

    // Métodos específicos para diferentes tipos de conta
    isLowBalance(): boolean {
        if (this.accountType === AccountType.CHECKING) {
            return this.value < 100
        }
        if (this.accountType === AccountType.SAVINGS) {
            return this.value < 500
        }
        return false
    }

    canCoverAmount(amount: TransactionAmount): boolean {
        if (this.accountType === AccountType.CREDIT_CARD) {
            // Para cartão de crédito, verificar limite disponível
            return Math.abs(this.value) + amount.getValue() <= this.getCreditLimit()
        }
        return this.value >= amount.getValue()
    }

    add(amount: TransactionAmount): AccountBalance {
        return new AccountBalance(this.value + amount.getValue(), this.accountType)
    }

    subtract(amount: TransactionAmount): AccountBalance {
        return new AccountBalance(this.value - amount.getValue(), this.accountType)
    }

    private getCreditLimit(): number {
        // Lógica para obter limite do cartão de crédito
        return 5000 // Exemplo
    }
}
```
```typescript
// domain/value-objects/password.vo.ts
export class Password {
    private readonly value: string

    constructor(password: string) {
        this.validate(password)
        this.value = password
    }

    private validate(password: string): void {
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long')
        }

        if (!/(?=.*[a-z])/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter')
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter')
        }

        if (!/(?=.*\d)/.test(password)) {
            throw new Error('Password must contain at least one number')
        }

        if (!/(?=.*[@$!%*?&])/.test(password)) {
            throw new Error('Password must contain at least one special character')
        }
    }

    getValue(): string {
        return this.value
    }

    getStrength(): PasswordStrength {
        let score = 0

        if (this.value.length >= 12) score += 2
        if (this.value.length >= 8) score += 1

        if (/(?=.*[a-z])/.test(this.value)) score += 1
        if (/(?=.*[A-Z])/.test(this.value)) score += 1
        if (/(?=.*\d)/.test(this.value)) score += 1
        if (/(?=.*[@$!%*?&])/.test(this.value)) score += 1

        if (score >= 5) return PasswordStrength.STRONG
        if (score >= 3) return PasswordStrength.MEDIUM
        return PasswordStrength.WEAK
    }

    isStrong(): boolean {
        return this.getStrength() === PasswordStrength.STRONG
    }
}
```

#### **Birthdate Value Object**
```typescript
// domain/value-objects/birthdate.vo.ts
export class Birthdate {
    private readonly value: Date

    constructor(birthdate: Date | string) {
        const date = typeof birthdate === 'string' ? new Date(birthdate) : birthdate
        this.validate(date)
        this.value = date
    }

    private validate(date: Date): void {
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format')
        }

        const today = new Date()
        const age = today.getFullYear() - date.getFullYear()
        const monthDiff = today.getMonth() - date.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            age--
        }

        if (age < 18) {
            throw new Error('User must be at least 18 years old')
        }

        if (age > 120) {
            throw new Error('Invalid birthdate')
        }
    }

    getValue(): Date {
        return new Date(this.value)
    }

    getAge(): number {
        const today = new Date()
        let age = today.getFullYear() - this.value.getFullYear()
        const monthDiff = today.getMonth() - this.value.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.value.getDate())) {
            age--
        }

        return age
    }

    isAdult(): boolean {
        return this.getAge() >= 18
    }

    isSenior(): boolean {
        return this.getAge() >= 65
    }

    getBirthdayThisYear(): Date {
        const today = new Date()
        return new Date(today.getFullYear(), this.value.getMonth(), this.value.getDate())
    }

    daysUntilBirthday(): number {
        const birthday = this.getBirthdayThisYear()
        const today = new Date()

        if (birthday < today) {
            birthday.setFullYear(today.getFullYear() + 1)
        }

        const diffTime = birthday.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
}
```

#### **Password Value Object**
```typescript
// domain/value-objects/password.vo.ts
export class Password {
    private readonly value: string

    constructor(value: string) {
        this.validatePassword(value)
        this.value = value
    }

    private validatePassword(password: string): void {
        if (!password || password.length < 6) {
            throw new InvalidPasswordException('Senha deve ter no mínimo 6 caracteres')
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            throw new InvalidPasswordException('Senha deve ter ao menos 1 letra maiúscula, 1 minúscula e 1 número')
        }
    }

    getHashed(): string {
        return bcrypt.hashSync(this.value, 10)
    }

    equals(other: Password): boolean {
        return this.value === other.value
    }

    getValue(): string {
        return this.value
    }

    getStrength(): PasswordStrength {
        let score = 0

        if (this.value.length >= 8) score++
        if (/[a-z]/.test(this.value)) score++
        if (/[A-Z]/.test(this.value)) score++
        if (/\d/.test(this.value)) score++
        if (/[^a-zA-Z0-9]/.test(this.value)) score++

        if (score < 3) return PasswordStrength.WEAK
        if (score < 4) return PasswordStrength.MEDIUM
        return PasswordStrength.STRONG
    }

    isStrong(): boolean {
        return this.getStrength() === PasswordStrength.STRONG
    }
}

enum PasswordStrength {
    WEAK = 'weak',
    MEDIUM = 'medium',
    STRONG = 'strong'
}
```

### **2. Entities**

**Entities** são objetos com identidade própria e ciclo de vida gerenciado.

#### **User Entity**
```typescript
// domain/user.entity.ts
export class User {
    private readonly _id: string
    private readonly _email: Email
    private _name: string
    private _lastname: string
    private readonly _birthdate: Birthdate
    private _role: UserRole
    private readonly _genderId: string
    private readonly _professionId: string
    private readonly _profileId?: string
    private readonly _password: Password
    private _status: AccountStatus
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: CreateUserProps) {
        this._id = props.id || this.generateId()
        this._email = new Email(props.email)
        this._name = this.validateName(props.name)
        this._lastname = this.validateName(props.lastname)
        this._birthdate = new Birthdate(props.birthdate)
        this._role = props.role
        this._genderId = props.genderId
        this._professionId = props.professionId
        this._profileId = props.profileId
        this._password = new Password(props.password)
        this._status = props.status || AccountStatus.ACTIVE
        this._createdAt = props.createdAt || new Date()
        this._updatedAt = props.updatedAt || new Date()
    }

    // Factory Methods
    static create(props: CreateUserProps): User {
        return new User(props)
    }

    static reconstitute(data: UserData): User {
        return new User({
            id: data.id,
            email: data.email,
            name: data.name,
            lastname: data.lastname,
            birthdate: data.birthdate,
            role: data.role as UserRole,
            genderId: data.genderId,
            professionId: data.professionId,
            profileId: data.profileId,
            password: data.password,
            status: data.status as AccountStatus,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        })
    }

    // Business Methods
    updateProfile(updates: UpdateUserProfile): void {
        if (updates.name) {
            this._name = this.validateName(updates.name)
        }

        if (updates.lastname) {
            this._lastname = this.validateName(updates.lastname)
        }

        if (updates.birthdate) {
            this._birthdate = new Birthdate(updates.birthdate)
        }

        this._updatedAt = new Date()
    }

    changePassword(newPassword: string): void {
        this._password = new Password(newPassword)
        this._updatedAt = new Date()
    }

    promoteToAdmin(): void {
        this._role = UserRole.ADMIN
        this._updatedAt = new Date()
    }

    demoteToUser(): void {
        this._role = UserRole.USER
        this._updatedAt = new Date()
    }

    activate(): void {
        this._status = AccountStatus.ACTIVE
        this._updatedAt = new Date()
    }

    suspend(): void {
        this._status = AccountStatus.SUSPENDED
        this._updatedAt = new Date()
    }

    deactivate(): void {
        this._status = AccountStatus.INACTIVE
        this._updatedAt = new Date()
    }

    // Query Methods
    isAdmin(): boolean {
        return this._role === UserRole.ADMIN
    }

    isActive(): boolean {
        return this._status === AccountStatus.ACTIVE
    }

    isSuspended(): boolean {
        return this._status === AccountStatus.SUSPENDED
    }

    canAccessAdminPanel(): boolean {
        return this.isAdmin() && this.isActive()
    }

    canResetPassword(): boolean {
        return !this.isSuspended()
    }

    // Computed Properties
    get fullName(): string {
        return `${this._name} ${this._lastname}`
    }

    get age(): number {
        return this._birthdate.getAge()
    }

    get daysUntilBirthday(): number {
        return this._birthdate.daysUntilBirthday()
    }

    get passwordStrength(): PasswordStrength {
        return this._password.getStrength()
    }

    get isCorporateEmail(): boolean {
        return this._email.isCorporate()
    }

    // Private Methods
    private validateName(name: string): string {
        if (!name || name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long')
        }

        if (name.trim().length > 50) {
            throw new Error('Name cannot exceed 50 characters')
        }

        return name.trim()
    }

    private generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Getters
    get id(): string { return this._id }
    get email(): string { return this._email.getValue() }
    get name(): string { return this._name }
    get lastname(): string { return this._lastname }
    get birthdate(): Date { return this._birthdate.getValue() }
    get role(): UserRole { return this._role }
    get genderId(): string { return this._genderId }
    get professionId(): string { return this._professionId }
    get profileId(): string | undefined { return this._profileId }
    get password(): string { return this._password.getValue() }
    get status(): AccountStatus { return this._status }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }
}
```

### **3. Domain Services**

**Domain Services** encapsulam lógica de negócio que não pertence a uma entidade específica.

#### **UserRegistrationService**
```typescript
// domain/services/user-registration.service.ts
export class UserRegistrationService {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly hashService: HashServicePort,
        private readonly emailService: EmailServicePort
    ) {}

    async registerUser(registrationData: UserRegistrationData): Promise<User> {
        // Validações de domínio
        await this.validateRegistrationData(registrationData)

        // Criação da entidade
        const user = User.create(registrationData)

        // Hash da senha
        const hashedPassword = await this.hashService.hash(user.password)
        user.changePassword(hashedPassword)

        // Persistência
        const savedUser = await this.userRepository.save(user)

        // Envio de email de boas-vindas
        await this.emailService.sendWelcomeEmail(user.email, user.fullName)

        return savedUser
    }

    private async validateRegistrationData(data: UserRegistrationData): Promise<void> {
        // Verificar se email já existe
        const emailExists = await this.userRepository.existsByEmail(data.email)
        if (emailExists) {
            throw new UserEmailAlreadyExistsException(data.email)
        }

        // Verificar se profissão é válida
        if (!await this.isValidProfession(data.professionId)) {
            throw new InvalidProfessionException(data.professionId)
        }

        // Verificar se gênero é válido
        if (!await this.isValidGender(data.genderId)) {
            throw new InvalidGenderException(data.genderId)
        }
    }

    private async isValidProfession(professionId: string): Promise<boolean> {
        // Implementação específica
        return true
    }

    private async isValidGender(genderId: string): Promise<boolean> {
        // Implementação específica
        return true
    }
}
```

### **4. Aggregates**

**Aggregates** são clusters de entidades e value objects que são tratados como uma unidade.

#### **UserProfile Aggregate**
```typescript
// domain/aggregates/user-profile.aggregate.ts
export class UserProfile {
    private readonly _id: string
    private readonly _user: User
    private _bio: string
    private _avatar: string
    private _preferences: UserPreferences
    private _socialLinks: SocialLinks
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: CreateUserProfileProps) {
        this._id = props.id || this.generateId()
        this._user = props.user
        this._bio = props.bio || ''
        this._avatar = props.avatar || ''
        this._preferences = new UserPreferences(props.preferences)
        this._socialLinks = new SocialLinks(props.socialLinks)
        this._createdAt = props.createdAt || new Date()
        this._updatedAt = props.updatedAt || new Date()
    }

    // Business Methods
    updateBio(bio: string): void {
        if (bio.length > 500) {
            throw new Error('Bio cannot exceed 500 characters')
        }

        this._bio = bio
        this._updatedAt = new Date()
    }

    updateAvatar(avatar: string): void {
        this._avatar = avatar
        this._updatedAt = new Date()
    }

    updatePreferences(preferences: Partial<UserPreferencesData>): void {
        this._preferences.update(preferences)
        this._updatedAt = new Date()
    }

    addSocialLink(platform: string, url: string): void {
        this._socialLinks.add(platform, url)
        this._updatedAt = new Date()
    }

    removeSocialLink(platform: string): void {
        this._socialLinks.remove(platform)
        this._updatedAt = new Date()
    }

    // Query Methods
    getPublicProfile(): PublicProfileData {
        return {
            id: this._id,
            name: this._user.fullName,
            bio: this._bio,
            avatar: this._avatar,
            socialLinks: this._socialLinks.getPublicLinks()
        }
    }

    // Getters
    get id(): string { return this._id }
    get user(): User { return this._user }
    get bio(): string { return this._bio }
    get avatar(): string { return this._avatar }
    get preferences(): UserPreferences { return this._preferences }
    get socialLinks(): SocialLinks { return this._socialLinks }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }

    private generateId(): string {
        return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
}
```

## 🔄 **Domain Events**

**Domain Events** representam algo que aconteceu no domínio.

#### **UserCreatedEvent**
```typescript
// domain/events/user-created.event.ts
export class UserCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly fullName: string,
        public readonly role: UserRole,
        public readonly timestamp: Date
    ) {}

    static fromUser(user: User): UserCreatedEvent {
        return new UserCreatedEvent(
            user.id,
            user.email,
            user.fullName,
            user.role,
            new Date()
        )
    }
}
```

#### **UserProfileUpdatedEvent**
```typescript
// domain/events/user-profile-updated.event.ts
export class UserProfileUpdatedEvent {
    constructor(
        public readonly userId: string,
        public readonly profileId: string,
        public readonly updatedFields: string[],
        public readonly timestamp: Date
    ) {}
}
```

## 🚀 **Implementação no Projeto**

### **1. Estrutura de Diretórios DDD**

```
src/users/
├── 📁 domain/                    # 🎯 Core Domain
│   ├── 📁 entities/             # 🏗️ Entidades principais
│   │   └── user.entity.ts       # Entidade User
│   ├── 📁 value-objects/        # 💎 Objetos de valor
│   │   ├── email.vo.ts          # Email value object
│   │   ├── password.vo.ts       # Password value object
│   │   └── birthdate.vo.ts      # Birthdate value object
│   ├── 📁 aggregates/           # 📦 Agregados
│   │   └── user-profile.aggregate.ts
│   ├── 📁 services/             # 🔧 Serviços de domínio
│   │   └── user-registration.service.ts
│   ├── 📁 events/               # 📢 Eventos de domínio
│   │   ├── user-created.event.ts
│   │   └── user-profile-updated.event.ts
│   ├── 📁 exceptions/           # ⚠️ Exceções de domínio
│   │   └── user-domain.exception.ts
│   └── 📁 ports/                # 🔌 Contratos (interfaces)
│       ├── user-repository.port.ts
│       └── hash-service.port.ts
├── 📁 application/               # 📋 Use Cases
├── 📁 infrastructure/            # 🔧 Implementações
└── 📁 interfaces/                # 🌐 APIs

src/transactions/
├── 📁 domain/                    # 🎯 Core Domain
│   ├── 📁 entities/             # 🏗️ Entidades principais
│   │   └── transaction.entity.ts # Entidade Transaction
│   ├── 📁 value-objects/        # 💎 Objetos de valor
│   │   ├── transaction-amount.vo.ts # Valor da transação
│   │   └── transaction-date.vo.ts   # Data da transação
│   ├── 📁 services/             # 🔧 Serviços de domínio
│   │   └── transaction-domain.service.ts
│   ├── 📁 events/               # 📢 Eventos de domínio
│   │   ├── transaction-created.event.ts
│   │   └── transaction-completed.event.ts
│   ├── 📁 exceptions/           # ⚠️ Exceções de domínio
│   │   └── transaction-domain.exception.ts
│   └── 📁 ports/                # 🔌 Contratos (interfaces)
│       ├── transaction-repository.port.ts
│       └── account-service.port.ts
├── 📁 application/               # 📋 Use Cases
│   ├── 📁 use-cases/            # Casos de uso específicos
│   │   ├── create-transaction.use-case.ts
│   │   ├── search-transactions.use-case.ts
│   │   ├── update-transaction.use-case.ts
│   │   ├── reverse-transaction.use-case.ts
│   │   └── get-transaction-summary.use-case.ts
│   └── 📁 services/             # Application Services
├── 📁 infrastructure/            # 🔧 Implementações
└── 📁 interfaces/                # 🌐 APIs

src/accounts/
├── 📁 domain/                    # 🎯 Core Domain
│   ├── 📁 entities/             # 🏗️ Entidades principais
│   │   └── account.entity.ts    # Entidade Account
│   ├── 📁 value-objects/        # 💎 Objetos de valor
│   │   ├── account-balance.vo.ts # Saldo da conta
│   │   └── account-name.vo.ts   # Nome da conta
│   ├── 📁 services/             # 🔧 Serviços de domínio
│   │   └── account-balance.service.ts
│   ├── 📁 events/               # 📢 Eventos de domínio
│   │   ├── account-created.event.ts
│   │   └── balance-updated.event.ts
│   └── 📁 ports/                # 🔌 Contratos (interfaces)
│       └── account-repository.port.ts
├── 📁 application/               # 📋 Use Cases
├── 📁 infrastructure/            # 🔧 Implementações
└── 📁 interfaces/                # 🌐 APIs

src/dashboards/
├── 📁 domain/                    # 🎯 Core Domain
│   ├── 📁 entities/             # 🏗️ Entidades principais
│   │   └── financial-metrics.entity.ts
│   ├── 📁 value-objects/        # 💎 Objetos de valor
│   │   ├── period.vo.ts         # Período de análise
│   │   └── growth-rate.vo.ts    # Taxa de crescimento
│   ├── 📁 services/             # 🔧 Serviços de domínio
│   │   └── dashboard-domain.service.ts
│   └── 📁 ports/                # 🔌 Contratos (interfaces)
│       ├── metrics-calculator.port.ts
│       └── trend-analyzer.port.ts
├── 📁 application/               # 📋 Use Cases
│   ├── 📁 use-cases/            # Casos de uso específicos
│   │   ├── get-dashboard-metrics.use-case.ts
│   │   ├── get-financial-trends.use-case.ts
│   │   └── get-financial-alerts.use-case.ts
│   └── 📁 services/             # Application Services
├── 📁 infrastructure/            # 🔧 Implementações
└── 📁 interfaces/                # 🌐 APIs
```

### **2. Use Cases com DDD**

#### **User Use Case**
```typescript
// application/use-cases/create-user.use-case.ts
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
        // Validações de domínio
        const emailExists = await this.userRepository.existsByEmail(request.email)
        if (emailExists) {
            throw new UserEmailAlreadyExistsException(request.email)
        }

        // Criação da entidade (DDD)
        const user = User.create({
            email: request.email,
            name: request.name,
            lastname: request.lastname,
            birthdate: request.birthdate,
            role: request.role,
            genderId: request.genderId,
            professionId: request.professionId,
            password: request.password
        })

        // Hash da senha
        const hashedPassword = await this.hashService.hash(user.password)
        user.changePassword(hashedPassword)

        // Persistência
        const savedUser = await this.userRepository.save(user)

        // Publicação de evento de domínio
        this.eventBus.publish(UserCreatedEvent.fromUser(savedUser))

        return { user: savedUser }
    }
}
```

#### **Transaction Use Case**
```typescript
// application/use-cases/create-transaction.use-case.ts
@Injectable()
export class CreateTransactionUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepositoryPort,
        @Inject(ACCOUNT_SERVICE)
        private readonly accountService: AccountServicePort,
        private readonly eventBus: EventBus
    ) {}

    async execute(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        // Validação da conta
        const account = await this.accountService.findById(request.accountId)
        if (!account) {
            throw new AccountNotFoundException(request.accountId)
        }

        // Validação de saldo para despesas
        if (request.amount < 0 && account.balance + request.amount < 0) {
            throw new InsufficientBalanceException(account.id)
        }

        // Criação da transação (DDD)
        const transaction = Transaction.create({
            amount: new TransactionAmount(request.amount),
            description: request.description,
            accountId: request.accountId,
            categoryId: request.categoryId,
            type: request.amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
            status: TransactionStatus.COMPLETED,
            destinationAccountId: request.destinationAccountId
        })

        // Persistência
        const savedTransaction = await this.transactionRepository.save(transaction)

        // Atualização do saldo da conta
        await this.accountService.updateBalance(
            account.id,
            account.balance + request.amount
        )

        // Publicação de evento
        this.eventBus.publish(TransactionCreatedEvent.fromTransaction(savedTransaction))

        return { transaction: savedTransaction }
    }
}
```

#### **Dashboard Use Case**
```typescript
// application/use-cases/get-dashboard-metrics.use-case.ts
@Injectable()
export class GetDashboardMetricsUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepositoryPort,
        @Inject(ACCOUNT_SERVICE)
        private readonly accountService: AccountServicePort,
        private readonly metricsCalculator: MetricsCalculatorPort,
        private readonly trendAnalyzer: TrendAnalyzerPort
    ) {}

    async execute(request: GetDashboardMetricsRequest): Promise<GetDashboardMetricsResponse> {
        // Buscar dados financeiros
        const accounts = await this.accountService.findByUserId(request.userId)
        const transactions = await this.transactionRepository.findByUserIdAndPeriod(
            request.userId,
            request.startDate,
            request.endDate
        )

        // Calcular métricas financeiras
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
        const totalIncome = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0)
        const totalExpenses = transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        // Análise de tendências
        const trends = await this.trendAnalyzer.analyzeTrends(transactions)

        // Alertas financeiros
        const alerts = this.generateFinancialAlerts(totalBalance, totalExpenses, totalIncome)

        return {
            totalBalance,
            totalIncome,
            totalExpenses,
            netFlow: totalIncome - totalExpenses,
            trends,
            alerts,
            period: { startDate: request.startDate, endDate: request.endDate }
        }
    }

    private generateFinancialAlerts(balance: number, expenses: number, income: number): Alert[] {
        const alerts: Alert[] = []

        if (balance < 0) {
            alerts.push(new Alert('NEGATIVE_BALANCE', 'Saldo negativo detectado', AlertLevel.CRITICAL))
        }

        if (expenses > income * 0.8) {
            alerts.push(new Alert('HIGH_EXPENSES', 'Gastos altos detectados', AlertLevel.WARNING))
        }

        return alerts
    }
}
```

### **3. Repository com DDD**

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
            const userData = this.mapToPrisma(user)

            const savedUser = await this.prisma.user.upsert({
                where: { id: user.id },
                update: userData,
                create: { id: user.id, ...userData }
            })

            // Reconstituição da entidade (DDD)
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
            lastname: user.lastname,
            birthdate: user.birthdate,
            role: user.role,
            genderId: user.genderId,
            professionId: user.professionId,
            profileId: user.profileId,
            password: user.password,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}
```

## 🧪 **Testes DDD**

### **1. Testes de Value Objects**

```typescript
// __tests__/domain/value-objects/email.vo.spec.ts
describe('Email Value Object', () => {
    describe('creation', () => {
        it('should create email with valid format', () => {
            const email = new Email('test@example.com')
            expect(email.getValue()).toBe('test@example.com')
        })

        it('should normalize email to lowercase', () => {
            const email = new Email('TEST@EXAMPLE.COM')
            expect(email.getValue()).toBe('test@example.com')
        })

        it('should trim whitespace', () => {
            const email = new Email('  test@example.com  ')
            expect(email.getValue()).toBe('test@example.com')
        })

        it('should throw error for invalid email', () => {
            expect(() => new Email('invalid-email')).toThrow('Invalid email format')
        })

        it('should throw error for email too long', () => {
            const longEmail = 'a'.repeat(250) + '@example.com'
            expect(() => new Email(longEmail)).toThrow('Email too long')
        })
    })

    describe('business methods', () => {
        it('should extract domain correctly', () => {
            const email = new Email('user@company.com')
            expect(email.getDomain()).toBe('company.com')
        })

        it('should identify corporate emails', () => {
            const corporateEmail = new Email('user@company.com')
            const personalEmail = new Email('user@gmail.com')

            expect(corporateEmail.isCorporate()).toBe(true)
            expect(personalEmail.isCorporate()).toBe(false)
        })
    })

    describe('equality', () => {
        it('should be equal to email with same value', () => {
            const email1 = new Email('test@example.com')
            const email2 = new Email('test@example.com')

            expect(email1.equals(email2)).toBe(true)
        })

        it('should not be equal to email with different value', () => {
            const email1 = new Email('test1@example.com')
            const email2 = new Email('test2@example.com')

            expect(email1.equals(email2)).toBe(false)
        })
    })
})
```

### **2. Testes de Entidades**

```typescript
// __tests__/domain/user.entity.spec.ts
describe('User Entity', () => {
    describe('creation', () => {
        it('should create user with valid data', () => {
            const user = User.create({
                email: 'test@example.com',
                name: 'John',
                lastname: 'Doe',
                birthdate: '1990-01-01',
                role: UserRole.USER,
                genderId: 'gender-id',
                professionId: 'profession-id',
                password: 'SecurePass123!'
            })

            expect(user.email).toBe('test@example.com')
            expect(user.fullName).toBe('John Doe')
            expect(user.isActive()).toBe(true)
            expect(user.isAdmin()).toBe(false)
        })

        it('should generate ID if not provided', () => {
            const user = User.create(createUserData())
            expect(user.id).toMatch(/^user_\d+_[a-z0-9]+$/)
        })

        it('should set default values', () => {
            const user = User.create(createUserData())
            expect(user.status).toBe(AccountStatus.ACTIVE)
            expect(user.createdAt).toBeInstanceOf(Date)
            expect(user.updatedAt).toBeInstanceOf(Date)
        })
    })

    describe('business methods', () => {
        let user: User

        beforeEach(() => {
            user = User.create(createUserData())
        })

        it('should promote user to admin', () => {
            user.promoteToAdmin()
            expect(user.isAdmin()).toBe(true)
            expect(user.updatedAt.getTime()).toBeGreaterThan(user.createdAt.getTime())
        })

        it('should demote user from admin', () => {
            user.promoteToAdmin()
            user.demoteToUser()
            expect(user.isAdmin()).toBe(false)
        })

        it('should activate user', () => {
            user.suspend()
            user.activate()
            expect(user.isActive()).toBe(true)
        })

        it('should suspend user', () => {
            user.suspend()
            expect(user.isSuspended()).toBe(true)
        })
    })

    describe('validation', () => {
        it('should throw error for name too short', () => {
            expect(() => User.create({
                ...createUserData(),
                name: 'A'
            })).toThrow('Name must be at least 2 characters long')
        })

        it('should throw error for name too long', () => {
            expect(() => User.create({
                ...createUserData(),
                name: 'A'.repeat(51)
            })).toThrow('Name cannot exceed 50 characters')
        })

        it('should throw error for invalid birthdate', () => {
            expect(() => User.create({
                ...createUserData(),
                birthdate: '2010-01-01' // Menor de 18 anos
            })).toThrow('User must be at least 18 years old')
        })
    })

    describe('computed properties', () => {
        it('should calculate full name correctly', () => {
            const user = User.create({
                ...createUserData(),
                name: 'John',
                lastname: 'Doe'
            })

            expect(user.fullName).toBe('John Doe')
        })

        it('should calculate age correctly', () => {
            const user = User.create({
                ...createUserData(),
                birthdate: '1990-01-01'
            })

            const expectedAge = new Date().getFullYear() - 1990
            expect(user.age).toBe(expectedAge)
        })

        it('should identify corporate email', () => {
            const corporateUser = User.create({
                ...createUserData(),
                email: 'user@company.com'
            })

            const personalUser = User.create({
                ...createUserData(),
                email: 'user@gmail.com'
            })

            expect(corporateUser.isCorporateEmail).toBe(true)
            expect(personalUser.isCorporateEmail).toBe(false)
        })
    })
})
```

## 📈 **Benefícios**

### **1. Alinhamento com Negócio**
- **Código expressivo** que reflete regras de negócio
- **Terminologia consistente** em todo o projeto
- **Validações centralizadas** no domínio

### **2. Manutenibilidade**
- **Mudanças isoladas** em cada camada
- **Regras de negócio** protegidas de mudanças técnicas
- **Código auto-documentado** pela estrutura

### **3. Testabilidade**
- **Testes unitários** simples e eficazes
- **Mocks fáceis** com ports bem definidos
- **Cobertura completa** do domínio

### **4. Escalabilidade**
- **Novos contextos** sem afetar existentes
- **Múltiplas implementações** para mesma interface
- **Event-driven architecture** facilmente implementável

## 🎯 **Conclusão**

O **Domain-Driven Design** implementado no SmartEconomy Backend oferece:

- **🎯 Foco no domínio** de negócio
- **🏗️ Modelos ricos** e expressivos
- **🔒 Proteção** das regras de negócio
- **🧪 Testabilidade** máxima
- **📚 Manutenibilidade** e escalabilidade

Esta implementação segue as **melhores práticas** do DDD e serve como **base sólida** para o crescimento do sistema.

---

**📖 Para mais detalhes, consulte:**
- [Arquitetura Hexagonal](hexagonal.md)
- [Ports & Adapters](ports-adapters.md)
- [Módulo Users](../users/README.md)
