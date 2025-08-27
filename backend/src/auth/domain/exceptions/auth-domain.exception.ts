export class AuthDomainException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthDomainException'
    }
}

export class InvalidCredentialsException extends AuthDomainException {
    constructor() {
        super('Invalid email or password')
        this.name = 'InvalidCredentialsException'
    }
}

export class UserNotFoundException extends AuthDomainException {
    constructor(email: string) {
        super(`User with email ${email} not found`)
        this.name = 'UserNotFoundException'
    }
}

export class InvalidTokenException extends AuthDomainException {
    constructor() {
        super('Invalid or expired token')
        this.name = 'InvalidTokenException'
    }
}

export class TokenExpiredException extends AuthDomainException {
    constructor() {
        super('Token has expired')
        this.name = 'TokenExpiredException'
    }
}

export class RefreshTokenInvalidException extends AuthDomainException {
    constructor() {
        super('Invalid refresh token')
        this.name = 'RefreshTokenInvalidException'
    }
}

export class UserAccountInactiveException extends AuthDomainException {
    constructor() {
        super('User account is inactive')
        this.name = 'UserAccountInactiveException'
    }
}

export class TooManyLoginAttemptsException extends AuthDomainException {
    constructor() {
        super('Too many login attempts. Please try again later')
        this.name = 'TooManyLoginAttemptsException'
    }
}

export class EmailAlreadyExistsException extends AuthDomainException {
    constructor(email: string) {
        super(`User with email ${email} already exists`)
        this.name = 'EmailAlreadyExistsException'
    }
}

export class InvalidEmailException extends AuthDomainException {
    constructor(email: string) {
        super(`Invalid email format: ${email}`)
        this.name = 'InvalidEmailException'
    }
}

export class WeakPasswordException extends AuthDomainException {
    constructor() {
        super('Password does not meet security requirements')
        this.name = 'WeakPasswordException'
    }
}
