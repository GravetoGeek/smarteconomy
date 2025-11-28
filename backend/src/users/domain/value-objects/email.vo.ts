import {UserInvalidEmailException} from '../exceptions/user-domain.exception'

const DISPOSABLE_DOMAINS=new Set([
    'mailinator.com',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'discard.email',
    'trashmail.com',
    'getnada.com'
])

export class Email {
    private readonly value: string

    constructor(email: string) {
        this.validate(email)
        this.value=email.toLowerCase().trim()
    }

    private validate(email: string): void {
        if(!email||email.trim().length===0) {
            throw new UserInvalidEmailException('Email is required')
        }

        const normalized=email.toLowerCase().trim()
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(normalized)) {
            throw new UserInvalidEmailException(`Invalid email format: ${email}`)
        }

        const domain=normalized.split('@')[1]
        if(DISPOSABLE_DOMAINS.has(domain)) {
            throw new UserInvalidEmailException(`Disposable email domains are not allowed: ${domain}`)
        }
    }

    getValue(): string {
        return this.value
    }

    equals(other: Email): boolean {
        return this.value===other.value
    }

    toString(): string {
        return this.value
    }
}
