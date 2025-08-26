import { Injectable, Inject } from '@nestjs/common'
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port'
import { AUTH_REPOSITORY } from '../../domain/tokens'

export interface LogoutRequest {
    accessToken: string
}

export interface LogoutResponse {
    success: boolean
    message: string
}

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort
    ) {}

    async execute(request: LogoutRequest): Promise<LogoutResponse> {
        const { accessToken } = request

        // Revogar o token
        await this.authRepository.revokeToken(accessToken)

        return {
            success: true,
            message: 'Successfully logged out'
        }
    }
}
