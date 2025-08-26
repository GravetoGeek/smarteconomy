export class Email {
    private readonly value: string

    constructor(email: string) {
        this.validate(email)
        this.value = email.toLowerCase().trim()
    }

    private validate(email: string): void {
        if (!email || email.trim().length === 0) {
            throw new Error('Email is required')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format')
        }

        if (email.length > 255) {
            throw new Error('Email is too long')
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
}
