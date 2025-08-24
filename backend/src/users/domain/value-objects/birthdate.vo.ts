export class Birthdate {
    private readonly value: Date

    constructor(birthdate: Date|string) {
        const date=typeof birthdate==='string'? new Date(birthdate):birthdate
        this.validate(date)
        this.value=date
    }

    private validate(birthdate: Date): void {
        if(isNaN(birthdate.getTime())) {
            throw new Error('Invalid birthdate')
        }

        const today=new Date()
        const age=today.getFullYear()-birthdate.getFullYear()
        const monthDiff=today.getMonth()-birthdate.getMonth()

        if(age<18||(age===18&&monthDiff<0)) {
            throw new Error('User must be at least 18 years old')
        }

        if(birthdate>today) {
            throw new Error('Birthdate cannot be in the future')
        }
    }

    getValue(): Date {
        return this.value
    }

    getAge(): number {
        const today=new Date()
        const age=today.getFullYear()-this.value.getFullYear()
        const monthDiff=today.getMonth()-this.value.getMonth()

        if(monthDiff<0||(monthDiff===0&&today.getDate()<this.value.getDate())) {
            return age-1
        }

        return age
    }

    equals(other: Birthdate): boolean {
        return this.value.getTime()===other.value.getTime()
    }

    toString(): string {
        return this.value.toISOString()
    }
}
