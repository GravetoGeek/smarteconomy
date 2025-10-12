import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthResponse, LogoutResponse, ValidateTokenResponse } from '../models/auth.model'
import { LoginInput, SignupInput, RefreshTokenInput, LogoutInput, ValidateTokenInput } from '../inputs/auth.input'
import { AuthApplicationService } from '../../../application/services/auth-application.service'
import { Logger } from '@nestjs/common'

@Resolver()
export class AuthResolver {
    private readonly logger = new Logger(AuthResolver.name)

    constructor(
        private readonly authApplicationService: AuthApplicationService
    ) { }

    @Mutation(() => AuthResponse)
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        try {
            this.logger.log(`Login attempt for email: ${input.email}`)

            const result = await this.authApplicationService.login({
                email: input.email,
                password: input.password
            })

            this.logger.log(`Login successful for user: ${result.user.id}`)
            return result
        } catch (error) {
            this.logger.error(`Login failed for email: ${input.email}`, error.stack)
            throw error
        }
    }

    @Mutation(() => AuthResponse)
    async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
        try {
            this.logger.log(`Signup attempt for email: ${input.email}`)

            const result = await this.authApplicationService.signup({
                email: input.email,
                password: input.password,
                name: input.name,
                lastname: input.lastname,
                birthdate: new Date(input.birthdate),
                genderId: input.genderId,
                professionId: input.professionId
            })

            this.logger.log(`Signup successful for user: ${result.user.id}`)
            return result
        } catch (error) {
            this.logger.error(`Signup failed for email: ${input.email}`, error.stack)
            throw error
        }
    }

    @Mutation(() => AuthResponse)
    async refreshToken(@Args('input') input: RefreshTokenInput): Promise<AuthResponse> {
        try {
            this.logger.log('Refresh token attempt')

            const result = await this.authApplicationService.refreshToken({
                refreshToken: input.refreshToken
            })

            this.logger.log(`Token refreshed successfully for user: ${result.user.id}`)
            return result
        } catch (error) {
            this.logger.error('Refresh token failed', error.stack)
            throw error
        }
    }

    @Mutation(() => LogoutResponse)
    async logout(@Args('input') input: LogoutInput): Promise<LogoutResponse> {
        try {
            this.logger.log('Logout attempt')

            const result = await this.authApplicationService.logout({
                accessToken: input.accessToken
            })

            this.logger.log('Logout successful')
            return result
        } catch (error) {
            this.logger.error('Logout failed', error.stack)
            throw error
        }
    }

    @Query(() => ValidateTokenResponse)
    async validateToken(@Args('input') input: ValidateTokenInput): Promise<ValidateTokenResponse> {
        try {
            this.logger.log('Token validation attempt')

            const result = await this.authApplicationService.validateToken({
                accessToken: input.accessToken
            })

            this.logger.log(`Token validation result: ${result.valid}`)
            return result
        } catch (error) {
            this.logger.error('Token validation failed', error.stack)
            throw error
        }
    }
}
