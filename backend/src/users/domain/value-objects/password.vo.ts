export class Password {
    private readonly value: string

    constructor(password: string) {
        this.validate(password)
        this.value=password
    }

    private validate(password: string): void {
        if(password.length<8) {
            throw new Error('Password must be at least 8 characters long')
        }

        if(!/(?=.*[a-z])/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter')
        }

        if(!/(?=.*[A-Z])/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter')
        }

        if(!/(?=.*\d)/.test(password)) {
            throw new Error('Password must contain at least one number')
        }
    }

    getValue(): string {
        return this.value
    }

    equals(other: Password): boolean {
        return this.value===other.value
    }

    toString(): string {
        return this.value
    }

    // Criar instância a partir de um hash (pula validação)
    static fromHash(hash: string): Password {
        const pw=Object.create(Password.prototype) as Password
            ; (pw as any).value=hash
        return pw
    }
}
