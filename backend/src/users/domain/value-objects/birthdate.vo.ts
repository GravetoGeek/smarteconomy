import {UserInvalidAgeException} from '../exceptions/user-domain.exception'

const MIN_AGE=13
const MAX_AGE=120

export class Birthdate {
    private readonly value: Date

    constructor(birthdate: Date|string) {
        const date=typeof birthdate==='string'? new Date(birthdate):birthdate
        this.validate(date)
        this.value=date
    }

    private validate(birthdate: Date): void {
        if(isNaN(birthdate.getTime())) {
            throw new UserInvalidAgeException()
        }

        const today=new Date()
        if(birthdate>today) {
            throw new UserInvalidAgeException()
        }

        const age=this.calculateAge(birthdate,today)

        if(age<MIN_AGE) {
            throw new UserInvalidAgeException()
        }

        if(age>MAX_AGE) {
            throw new UserInvalidAgeException()
        }
    }

    private calculateAge(birthdate: Date,reference: Date): number {
        let age=reference.getFullYear()-birthdate.getFullYear()
        const monthDiff=reference.getMonth()-birthdate.getMonth()

        if(monthDiff<0||(monthDiff===0&&reference.getDate()<birthdate.getDate())) {
            age-=1
        }

        return age
    }

    getValue(): Date {
        return this.value
    }

    getAge(): number {
        return this.calculateAge(this.value,new Date())
    }

    equals(other: Birthdate): boolean {
        return this.value.getTime()===other.value.getTime()
    }

    toString(): string {
        return this.value.toISOString()
    }
}
