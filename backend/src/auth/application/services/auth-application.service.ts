import { Injectable } from '@nestjs/common'
import { LoginUseCase } from '../use-cases/login.use-case'
import { SignupUseCase } from '../use-cases/signup.use-case'
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case'
import { LogoutUseCase } from '../use-cases/logout.use-case'
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
    user: {
        id: string
        email: string
        role: string
    }
}

export interface SignupRequest {
    email: string
    password: string
    name: string
    lastname: string
    birthdate: Date
    genderId: string
    professionId: string
}

export interface SignupResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
    user: {
        id: string
        email: string
        role: string
    }
}

export interface RefreshTokenRequest {
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
    user: {
        id: string
        email: string
        role: string
    }
}

export interface LogoutRequest {
    accessToken: string
}

export interface LogoutResponse {
    success: boolean
    message: string
}

export interface ValidateTokenRequest {
    accessToken: string
}

export interface ValidateTokenResponse {
    valid: boolean
    user?: {
        id: string
        email: string
        role: string
    }
}

@Injectable()
export class AuthApplicationService {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly signupUseCase: SignupUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly validateTokenUseCase: ValidateTokenUseCase
    ) {}

    async login(request: LoginRequest): Promise<LoginResponse> {
        return await this.loginUseCase.execute(request)
    }

    async signup(request: SignupRequest): Promise<SignupResponse> {
        return await this.signupUseCase.execute(request)
    }

    async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        return await this.refreshTokenUseCase.execute(request)
    }

    async logout(request: LogoutRequest): Promise<LogoutResponse> {
        return await this.logoutUseCase.execute(request)
    }

    async validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
        return await this.validateTokenUseCase.execute(request)
    }
}
