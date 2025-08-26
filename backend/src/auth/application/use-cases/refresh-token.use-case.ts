import { Injectable, Inject } from '@nestjs/common'
import { AuthToken } from '../../domain/entities/auth-token'
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port'
import { UserRepositoryPort } from '../../domain/ports/user-repository.port'
import { JwtServicePort } from '../../domain/ports/jwt-service.port'
import { AUTH_REPOSITORY, USER_REPOSITORY, JWT_SERVICE } from '../../domain/tokens'
import { 
    RefreshTokenInvalidException, 
    TokenExpiredException,
    UserAccountInactiveException 
} from '../../domain/exceptions/auth-domain.exception'

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

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(JWT_SERVICE)
        private readonly jwtService: JwtServicePort
    ) {}

    async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        const { refreshToken } = request

        // Verificar se o refresh token existe
        const existingToken = await this.authRepository.findTokenByRefreshToken(refreshToken)
        if (!existingToken) {
            throw new RefreshTokenInvalidException()
        }

        // Verificar se o token expirou
        if (existingToken.isExpired()) {
            throw new TokenExpiredException()
        }

        // Verificar se o token foi revogado
        const isRevoked = await this.authRepository.isTokenRevoked(existingToken.accessToken)
        if (isRevoked) {
            throw new RefreshTokenInvalidException()
        }

        // Verificar se o usuário ainda existe e está ativo
        const user = await this.userRepository.findById(existingToken.userId)
        if (!user) {
            throw new RefreshTokenInvalidException()
        }

        if (user.status !== 'ACTIVE') {
            throw new UserAccountInactiveException()
        }

        // Gerar novos tokens
        const newAccessToken = await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        })

        const newRefreshToken = await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        })

        // Revogar token antigo
        await this.authRepository.revokeToken(existingToken.accessToken)

        // Criar novo AuthToken
        const newAuthToken = AuthToken.create({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 24 * 60 * 60, // 24 horas em segundos
            userId: user.id
        })

        // Salvar novo token
        await this.authRepository.saveToken(newAuthToken)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: newAuthToken.expiresIn,
            tokenType: newAuthToken.tokenType,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }
}
