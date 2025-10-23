import {
    LoginResponse,
    RefreshTokenResponse,
    LogoutResponse as ServiceLogoutResponse,
    ValidateTokenResponse as ServiceValidateTokenResponse,
    SignupResponse
} from '../../../application/services/auth-application.service'
import {
    AuthResponse,
    AuthUser,
    LogoutResponse as GraphQLLogoutResponse,
    ValidateTokenResponse as GraphQLValidateTokenResponse
} from '../../dtos/models/auth.model'
import {PasswordResetResponse} from '../../dtos/models/password-reset-response.model'

export class AuthGraphQLMapper {
    private static mapUser(user: LoginResponse['user']): AuthUser {
        return {
            id: user.id,
            email: user.email,
            role: user.role
        }
    }

    static toAuthResponse(response: LoginResponse|SignupResponse|RefreshTokenResponse): AuthResponse {
        return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
            tokenType: response.tokenType,
            user: this.mapUser(response.user)
        }
    }

    static toLogoutResponse(response: ServiceLogoutResponse): GraphQLLogoutResponse {
        return {
            success: response.success,
            message: response.message
        }
    }

    static toValidateTokenResponse(response: ServiceValidateTokenResponse): GraphQLValidateTokenResponse {
        return {
            valid: response.valid,
            user: response.user? this.mapUser(response.user):null
        }
    }

    static toPasswordResetResponse(success: boolean,message: string): PasswordResetResponse {
        return {
            success,
            message
        }
    }
}
