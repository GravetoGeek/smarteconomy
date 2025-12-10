import {UserInvalidPasswordException} from '../exceptions/user-domain.exception'
import {Password} from './password.vo'

describe('Password Value Object',() => {
    it('should create a valid password',() => {
        const validPassword='StrongPassword1!'
        const password=new Password(validPassword)
        expect(password.getValue()).toBe(validPassword)
    })

    it('should throw error if password is too short',() => {
        expect(() => new Password('Short1!')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password has no lowercase letter',() => {
        expect(() => new Password('STRONGPASSWORD1!')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password has no uppercase letter',() => {
        expect(() => new Password('strongpassword1!')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password has no number',() => {
        expect(() => new Password('StrongPassword!')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password has no special character',() => {
        expect(() => new Password('StrongPassword1')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password is a common password',() => {
        expect(() => new Password('password123')).toThrow(UserInvalidPasswordException)
    })

    it('should throw error if password is empty',() => {
        expect(() => new Password('')).toThrow(UserInvalidPasswordException)
    })

    it('should check equality',() => {
        const p1=new Password('StrongPassword1!')
        const p2=new Password('StrongPassword1!')
        const p3=new Password('OtherPassword1!')
        expect(p1.equals(p2)).toBe(true)
        expect(p1.equals(p3)).toBe(false)
    })
})
