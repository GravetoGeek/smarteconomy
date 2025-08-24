export enum ProfessionType {
    ENGINEER='ENGINEER',
    DOCTOR='DOCTOR',
    TEACHER='TEACHER',
    LAWYER='LAWYER',
    ACCOUNTANT='ACCOUNTANT',
    NURSE='NURSE',
    ARCHITECT='ARCHITECT',
    DESIGNER='DESIGNER',
    DEVELOPER='DEVELOPER',
    MANAGER='MANAGER',
    SALES='SALES',
    MARKETING='MARKETING',
    FINANCE='FINANCE',
    HR='HR',
    OPERATIONS='OPERATIONS',
    RESEARCH='RESEARCH',
    CONSULTANT='CONSULTANT',
    ENTREPRENEUR='ENTREPRENEUR',
    STUDENT='STUDENT',
    OTHER='OTHER'
}

export class Profession {
    private readonly _id: string
    private _profession: ProfessionType
    private readonly _createdAt: Date
    private readonly _updatedAt: Date

    private constructor(
        id: string,
        profession: ProfessionType,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id=id
        this._profession=profession
        this._createdAt=createdAt
        this._updatedAt=updatedAt
    }

    // Getters
    get id(): string {
        return this._id
    }

    get profession(): ProfessionType {
        return this._profession
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    // Domain methods
    isEngineer(): boolean {
        return this._profession===ProfessionType.ENGINEER
    }

    isDoctor(): boolean {
        return this._profession===ProfessionType.DOCTOR
    }

    isTeacher(): boolean {
        return this._profession===ProfessionType.TEACHER
    }

    isDeveloper(): boolean {
        return this._profession===ProfessionType.DEVELOPER
    }

    isHealthcare(): boolean {
        return [ProfessionType.DOCTOR,ProfessionType.NURSE].includes(this._profession)
    }

    isTechnical(): boolean {
        return [ProfessionType.ENGINEER,ProfessionType.ARCHITECT,ProfessionType.DEVELOPER].includes(this._profession)
    }

    // Business logic
    updateProfession(newProfession: ProfessionType): void {
        if(newProfession!==this._profession) {
            this._profession=newProfession
        }
    }

    // Factory methods
    static create(profession: ProfessionType): Profession {
        const id=Profession.generateId()
        const now=new Date()

        return new Profession(id,profession,now,now)
    }

    static reconstitute(
        id: string,
        profession: string|ProfessionType,
        createdAt: Date,
        updatedAt: Date
    ): Profession {
        const professionType=typeof profession==='string'
            ? profession as ProfessionType
            :profession

        return new Profession(id,professionType,createdAt,updatedAt)
    }

    // Utility methods
    private static generateId(): string {
        // Fallback for environments where crypto.randomUUID() might not be available
        if(typeof crypto!=='undefined'&&crypto.randomUUID) {
            return crypto.randomUUID()
        }

        // Simple fallback ID generation
        return 'prof_'+Date.now()+'_'+Math.random().toString(36).substr(2,9)
    }
}
