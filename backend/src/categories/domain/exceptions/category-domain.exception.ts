export class CategoryDomainException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CategoryDomainException'
    }
}

export class CategoryNotFoundException extends CategoryDomainException {
    constructor(id: string) {
        super(`Category with id ${id} not found`)
        this.name = 'CategoryNotFoundException'
    }
}

export class CategoryAlreadyExistsException extends CategoryDomainException {
    constructor(category: string) {
        super(`Category with name ${category} already exists`)
        this.name = 'CategoryAlreadyExistsException'
    }
}

export class InvalidCategoryNameException extends CategoryDomainException {
    constructor(category: string) {
        super(`Invalid category name: ${category}`)
        this.name = 'InvalidCategoryNameException'
    }
}
