export class AuthToken {
    private readonly _accessToken: string
    private readonly _refreshToken: string
    private readonly _expiresIn: number
    private readonly _tokenType: string
    private readonly _userId: string
    private readonly _createdAt: Date

    constructor(props: {
        accessToken: string
        refreshToken: string
        expiresIn: number
        tokenType: string
        userId: string
        createdAt: Date
    }) {
        this._accessToken = props.accessToken
        this._refreshToken = props.refreshToken
        this._expiresIn = props.expiresIn
        this._tokenType = props.tokenType
        this._userId = props.userId
        this._createdAt = props.createdAt
    }

    // Getters
    get accessToken(): string {
        return this._accessToken
    }

    get refreshToken(): string {
        return this._refreshToken
    }

    get expiresIn(): number {
        return this._expiresIn
    }

    get tokenType(): string {
        return this._tokenType
    }

    get userId(): string {
        return this._userId
    }

    get createdAt(): Date {
        return this._createdAt
    }

    // Domain methods
    isExpired(): boolean {
        const now = new Date()
        const expirationTime = new Date(this._createdAt.getTime() + this._expiresIn * 1000)
        return now > expirationTime
    }

    getExpirationTime(): Date {
        return new Date(this._createdAt.getTime() + this._expiresIn * 1000)
    }

    // Factory method
    static create(props: {
        accessToken: string
        refreshToken: string
        expiresIn: number
        userId: string
    }): AuthToken {
        const now = new Date()
        return new AuthToken({
            accessToken: props.accessToken,
            refreshToken: props.refreshToken,
            expiresIn: props.expiresIn,
            tokenType: 'Bearer',
            userId: props.userId,
            createdAt: now
        })
    }

    // Reconstitution method
    static reconstitute(props: {
        accessToken: string
        refreshToken: string
        expiresIn: number
        tokenType: string
        userId: string
        createdAt: Date
    }): AuthToken {
        return new AuthToken(props)
    }
}
