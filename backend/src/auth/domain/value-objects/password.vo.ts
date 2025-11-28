const COMMON_PASSWORDS=new Set([
    '123456',
    '123456789',
    'qwerty',
    'password',
    '111111',
    '123123',
    'abc123',
    'password1',
    'admin123',
    'letmein',
    'welcome',
    'teste123',
    'password123',
    '12345678'
])

const SPECIAL_CHAR_REGEX=/[\p{P}\p{S}]/u

export class Password {
    private readonly value: string

    constructor(password: string) {
        this.validate(password)
        this.value=password
    }

    private validate(password: string): void {
        if(!password||password.trim().length===0) {
            throw new Error('Password is required')
        }

        if(password.length<8) {
            throw new Error('Password must be at least 8 characters long')
        }

        if(password.length>100) {
            throw new Error('Password is too long')
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

        if(!SPECIAL_CHAR_REGEX.test(password)) {
            throw new Error('Password must contain at least one special character')
        }

        if(COMMON_PASSWORDS.has(password.toLowerCase())) {
            throw new Error('Password is too common')
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

    static fromHash(hash: string): Password {
        const pw=Object.create(Password.prototype) as Password
            ; (pw as any).value=hash
        return pw
    }
}
