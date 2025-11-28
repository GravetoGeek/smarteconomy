import {UserInvalidPasswordException} from '../exceptions/user-domain.exception'

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
            throw new UserInvalidPasswordException()
        }

        if(password.length<8) {
            throw new UserInvalidPasswordException()
        }

        if(!/(?=.*[a-z])/.test(password)) {
            throw new UserInvalidPasswordException()
        }

        if(!/(?=.*[A-Z])/.test(password)) {
            throw new UserInvalidPasswordException()
        }

        if(!/(?=.*\d)/.test(password)) {
            throw new UserInvalidPasswordException()
        }

        if(!SPECIAL_CHAR_REGEX.test(password)) {
            throw new UserInvalidPasswordException()
        }

        if(COMMON_PASSWORDS.has(password.toLowerCase())) {
            throw new UserInvalidPasswordException()
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
