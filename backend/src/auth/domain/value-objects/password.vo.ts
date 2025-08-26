export class Password {
    private readonly value: string

    constructor(password: string) {
        this.validate(password)
        this.value = password
    }

    private validate(password: string): void {
        if (!password || password.trim().length === 0) {
            throw new Error('Password is required')
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long')
        }

        if (password.length > 100) {
            throw new Error('Password is too long')
        }

        // Verificar se contém pelo menos uma letra e um número
        const hasLetter = /[a-zA-Z]/.test(password)
        const hasNumber = /\d/.test(password)

        if (!hasLetter || !hasNumber) {
            throw new Error('Password must contain at least one letter and one number')
        }
    }

    getValue(): string {
        return this.value
    }

    equals(other: Password): boolean {
        return this.value === other.value
    }

    toString(): string {
        return this.value
    }
}
