export enum AccountType {
    CHECKING='CHECKING',
    SAVINGS='SAVINGS'
}

export enum AccountStatus {
    ACTIVE='ACTIVE',
    INACTIVE='INACTIVE'
}

export class Account {
    private readonly _id: string
    private _name: string
    private _type: AccountType
    private _balance: number
    private _userId: string
    private _status: AccountStatus
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: {
        id?: string
        name: string
        type: AccountType
        balance?: number
        userId: string
        status?: AccountStatus
        createdAt?: Date
        updatedAt?: Date
    }) {
        this._id=props.id||this.generateId()
        this._name=this.validateName(props.name)
        this._type=props.type
        this._balance=props.balance||0
        this._userId=props.userId
        this._status=props.status||AccountStatus.ACTIVE
        this._createdAt=props.createdAt||new Date()
        this._updatedAt=props.updatedAt||new Date()
    }

    private validateName(name: string): string {
        if(!name||name.trim().length<2) throw new Error('Nome da conta inválido')
        return name.trim()
    }

    private generateId(): string {
        // simples uuid placeholder
        return 'acc_'+Math.random().toString(36).slice(2,11)
    }

    get id(){return this._id}
    get name(){return this._name}
    get type(){return this._type}
    get balance(){return this._balance}
    get userId(){return this._userId}
    get status(){return this._status}
    get createdAt(){return this._createdAt}
    get updatedAt(){return this._updatedAt}

    static reconstitute(data: any): Account {
        return new Account({
            id: data.id,
            name: data.name,
            type: data.type,
            balance: data.balance,
            userId: data.userId,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        })
    }

    toPrisma(){
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            balance: this.balance,
            userId: this.userId,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }

    credit(amount: number){
        if(amount<=0) throw new Error('Valor inválido')
        this._balance+=amount
        this._updatedAt=new Date()
    }

    debit(amount: number){
        if(amount<=0) throw new Error('Valor inválido')
        if(this._balance<amount) throw new Error('Saldo insuficiente')
        this._balance-=amount
        this._updatedAt=new Date()
    }
}
