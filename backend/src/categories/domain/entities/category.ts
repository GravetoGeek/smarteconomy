export class Category {
    private readonly _id: string
    private _category: string
    private readonly _createdAt: Date
    private readonly _updatedAt: Date

    constructor(props: {
        id: string
        category: string
        createdAt: Date
        updatedAt: Date
    }) {
        this._id = props.id
        this._category = props.category
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }

    // Getters
    get id(): string {
        return this._id
    }

    get category(): string {
        return this._category
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    // Domain methods
    updateCategory(newCategory: string): void {
        this._category = newCategory
    }

    // Factory method
    static create(props: {
        category: string
    }): Category {
        const now = new Date()
        return new Category({
            id: Category.generateId(),
            category: props.category,
            createdAt: now,
            updatedAt: now
        })
    }

    // Reconstitution method for Prisma
    static reconstitute(props: {
        id: string
        category: string
        createdAt: Date
        updatedAt: Date
    }): Category {
        return new Category(props)
    }

    // Generate ID with fallback
    private static generateId(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID()
        }
        // Fallback for environments without crypto.randomUUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
}
