export class GenderNotFoundException extends Error {
    constructor(id: string) {
        super(`Gender with id ${id} not found`)
        this.name='GenderNotFoundException'
    }
}

export class GenderAlreadyExistsException extends Error {
    constructor(gender: string) {
        super(`Gender ${gender} already exists`)
        this.name='GenderAlreadyExistsException'
    }
}

export class InvalidGenderTypeException extends Error {
    constructor(gender: string) {
        super(`Invalid gender type: ${gender}`)
        this.name='InvalidGenderTypeException'
    }
}
