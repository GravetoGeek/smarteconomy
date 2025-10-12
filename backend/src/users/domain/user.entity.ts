import {Birthdate} from './value-objects/birthdate.vo'
import {Email} from './value-objects/email.vo'
import {Password} from './value-objects/password.vo'

export enum UserRole {
    USER='USER',
    ADMIN='ADMIN'
}

export enum AccountStatus {
    ACTIVE='ACTIVE',
    INACTIVE='INACTIVE',
    SUSPENDED='SUSPENDED'
}

export class User {
    private readonly _id: string
    private readonly _email: Email
    private _name: string // Removido readonly para permitir atualização
    private _lastname: string // Removido readonly para permitir atualização
    private readonly _birthdate: Birthdate
    private _role: UserRole
    private readonly _genderId: string
    private readonly _professionId: string
    private readonly _profileId?: string|null
    private readonly _password: Password
    private _status: AccountStatus
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: {
        id?: string
        email: string
        name: string
        lastname: string
        birthdate: Date|string
        role: UserRole
        genderId: string
        professionId: string
        profileId?: string|null // Aceita null do Prisma
        password: string
        status?: AccountStatus
        createdAt?: Date
        updatedAt?: Date
    }) {
        this._id=props.id||this.generateId()
        this._email=new Email(props.email)
        this._name=this.validateName(props.name)
        this._lastname=this.validateName(props.lastname)
        this._birthdate=new Birthdate(props.birthdate)
        this._role=props.role
        this._genderId=props.genderId
        this._professionId=props.professionId
        this._profileId=props.profileId
        this._password=new Password(props.password)
        this._status=props.status||AccountStatus.ACTIVE
        this._createdAt=props.createdAt||new Date()
        this._updatedAt=props.updatedAt||new Date()
    }

    private validateName(name: string): string {
        if(!name||name.trim().length<2) {
            throw new Error('Name must be at least 2 characters long')
        }
        if(name.trim().length>50) {
            throw new Error('Name cannot exceed 50 characters')
        }
        return name.trim()
    }

    private generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2,9)}`
    }

    // Getters
    get id(): string {return this._id}
    get email(): string {return this._email.getValue()}
    get name(): string {return this._name}
    get lastname(): string {return this._lastname}
    get birthdate(): Date {return this._birthdate.getValue()}
    get role(): UserRole {return this._role}
    get genderId(): string {return this._genderId}
    get professionId(): string {return this._professionId}
    get profileId(): string|undefined|null {return this._profileId}
    get password(): string {return this._password.getValue()}
    get status(): AccountStatus {return this._status}
    get createdAt(): Date {return this._createdAt}
    get updatedAt(): Date {return this._updatedAt}

    // Computed properties
    get fullName(): string {
        return `${this._name} ${this._lastname}`
    }

    get age(): number {
        return this._birthdate.getAge()
    }

    // Business logic methods
    isAdmin(): boolean {
        return this._role===UserRole.ADMIN
    }

    isActive(): boolean {
        return this._status===AccountStatus.ACTIVE
    }

    isSuspended(): boolean {
        return this._status===AccountStatus.SUSPENDED
    }

    // Domain methods
    activate(): void {
        this._status=AccountStatus.ACTIVE
        this._updatedAt=new Date()
    }

    deactivate(): void {
        this._status=AccountStatus.INACTIVE
        this._updatedAt=new Date()
    }

    suspend(): void {
        this._status=AccountStatus.SUSPENDED
        this._updatedAt=new Date()
    }

    promoteToAdmin(): void {
        this._role=UserRole.ADMIN
        this._updatedAt=new Date()
    }

    demoteToUser(): void {
        this._role=UserRole.USER
        this._updatedAt=new Date()
    }

    updateProfile(name: string,lastname: string): void {
        this._name=this.validateName(name)
        this._lastname=this.validateName(lastname)
        this._updatedAt=new Date()
    }

    // Factory method
    static create(props: {
        email: string
        name: string
        lastname: string
        birthdate: Date|string
        role: UserRole
        genderId: string
        professionId: string
        profileId?: string
        password: string
    }): User {
        return new User({
            ...props,
            status: AccountStatus.ACTIVE
        })
    }

    // Reconstitution method
    static reconstitute(props: {
        id: string
        email: string
        name: string
        lastname: string
        birthdate: Date
        role: UserRole|string // Aceita string para compatibilidade com Prisma
        genderId: string
        professionId: string
        profileId?: string|null // Aceita null do Prisma
        password: string
        status: AccountStatus|string // Aceita string para compatibilidade com Prisma
        createdAt: Date
        updatedAt: Date
    }): User {
        return new User({
            ...props,
            role: typeof props.role==='string'? props.role as UserRole:props.role,
            status: typeof props.status==='string'? props.status as AccountStatus:props.status
        })
    }
}
