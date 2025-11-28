export class UserDomainException extends Error {
    constructor(message: string) {
        super(message)
        this.name='UserDomainException'
    }
}

// ✅ Exceções para VIOLAÇÕES DE REGRAS DE NEGÓCIO (erros reais)
export class UserEmailAlreadyExistsException extends UserDomainException {
    constructor(email: string) {
        super(`User with email ${email} already exists`)
        this.name='UserEmailAlreadyExistsException'
    }
}

export class UserInvalidAgeException extends UserDomainException {
    constructor() {
        super('User must be at least 13 years old')
        this.name='UserInvalidAgeException'
    }
}

export class UserInvalidEmailException extends UserDomainException {
    constructor(email: string) {
        super(`Invalid email format: ${email}`)
        this.name='UserInvalidEmailException'
    }
}

export class UserInvalidPasswordException extends UserDomainException {
    constructor() {
        super('Password must be at least 8 characters long and contain uppercase, lowercase, and number')
        this.name='UserInvalidPasswordException'
    }
}

export class UserInvalidNameException extends UserDomainException {
    constructor(message: string) {
        super(message)
        this.name='UserInvalidNameException'
    }
}
