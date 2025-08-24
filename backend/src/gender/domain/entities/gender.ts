export enum GenderType {
    MALE='MALE',
    FEMALE='FEMALE',
    OTHER='OTHER',
    PREFER_NOT_TO_SAY='PREFER_NOT_TO_SAY',
    AGENDER='AGENDER',
    NON_BINARY='NON_BINARY',
    GENDERFLUID='GENDERFLUID',
    BIGENDER='BIGENDER',
    PAN_GENDER='PAN_GENDER',
    DEMI_GENDER='DEMI_GENDER'
}

export class Gender {
    private readonly _id: string
    private readonly _gender: GenderType
    private readonly _createdAt: Date
    private readonly _updatedAt: Date

    constructor(props: {
        id: string
        gender: GenderType
        createdAt: Date
        updatedAt: Date
    }) {
        this._id=props.id
        this._gender=props.gender
        this._createdAt=props.createdAt
        this._updatedAt=props.updatedAt
    }

    // Getters
    get id(): string {
        return this._id
    }

    get gender(): GenderType {
        return this._gender
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    // Métodos de domínio
    isMale(): boolean {
        return this._gender===GenderType.MALE
    }

    isFemale(): boolean {
        return this._gender===GenderType.FEMALE
    }

    isOther(): boolean {
        return this._gender===GenderType.OTHER
    }

    isPreferNotToSay(): boolean {
        return this._gender===GenderType.PREFER_NOT_TO_SAY
    }

    isAgender(): boolean {
        return this._gender===GenderType.AGENDER
    }

    isNonBinary(): boolean {
        return this._gender===GenderType.NON_BINARY
    }

    // Factory methods
    static create(props: {
        gender: GenderType
    }): Gender {
        const now=new Date()
        return new Gender({
            id: Gender.generateId(),
            gender: props.gender,
            createdAt: now,
            updatedAt: now
        })
    }

    static reconstitute(props: {
        id: string
        gender: string
        createdAt: Date
        updatedAt: Date
    }): Gender {
        return new Gender({
            id: props.id,
            gender: props.gender as GenderType,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
    }

    // Métodos de validação
    private validateGender(gender: GenderType): GenderType {
        if(!Object.values(GenderType).includes(gender)) {
            throw new Error('Invalid gender type')
        }
        return gender
    }

    // Método para gerar ID único
    private static generateId(): string {
        // Fallback para versões mais antigas do Node.js
        if(typeof crypto!=='undefined'&&crypto.randomUUID) {
            return crypto.randomUUID()
        }

        // Fallback alternativo
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
            const r=Math.random()*16|0
            const v=c==='x'? r:(r&0x3|0x8)
            return v.toString(16)
        })
    }
}
