export class ProfessionNotFoundException extends Error {
    constructor(id: string) {
        super(`Profession with id ${id} not found`)
        this.name='ProfessionNotFoundException'
    }
}

export class ProfessionAlreadyExistsException extends Error {
    constructor(profession: string) {
        super(`Profession ${profession} already exists`)
        this.name='ProfessionAlreadyExistsException'
    }
}

export class InvalidProfessionTypeException extends Error {
    constructor(profession: string) {
        super(`Invalid profession type: ${profession}`)
        this.name='InvalidProfessionTypeException'
    }
}
