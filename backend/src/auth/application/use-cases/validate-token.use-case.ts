import { Injectable, Inject } from '@nestjs/common'
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port'
import { UserRepositoryPort } from '../../domain/ports/user-repository.port'
import { JwtServicePort } from '../../domain/ports/jwt-service.port'
import { AUTH_REPOSITORY, USER_REPOSITORY, JWT_SERVICE } from '../../domain/tokens'
import { 
    InvalidTokenException, 
    TokenExpiredException,
    UserAccountInactiveException 
} from '../../domain/exceptions/auth-domain.exception'

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
export class ValidateTokenUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(JWT_SERVICE)
        private readonly jwtService: JwtServicePort
    ) {}

    async execute(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
        const { accessToken } = request

        try {
            // Verificar se o token foi revogado
            const isRevoked = await this.authRepository.isTokenRevoked(accessToken)
            if (isRevoked) {
                return { valid: false }
            }

            // Verificar se o token existe no repositório
            const existingToken = await this.authRepository.findTokenByAccessToken(accessToken)
            if (!existingToken) {
                return { valid: false }
            }

            // Verificar se o token expirou
            if (existingToken.isExpired()) {
                return { valid: false }
            }

            // Verificar assinatura do JWT
            const payload = await this.jwtService.verify(accessToken)

            // Verificar se o usuário ainda existe e está ativo
            const user = await this.userRepository.findById(payload.sub)
            if (!user) {
                return { valid: false }
            }

            if (user.status !== 'ACTIVE') {
                return { valid: false }
            }

            return {
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }

        } catch (error) {
            return { valid: false }
        }
    }
}
