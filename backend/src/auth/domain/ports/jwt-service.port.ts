export interface JwtPayload {
    sub: string
    email: string
    role: string
    iat?: number
    exp?: number
}

export interface JwtServicePort {
    sign(payload: JwtPayload): Promise<string>
    verify(token: string): Promise<JwtPayload>
    decode(token: string): JwtPayload | null
}
