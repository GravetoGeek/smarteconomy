import {Args,Mutation,Resolver} from '@nestjs/graphql'
import {RequestPasswordResetUseCase} from '../../../application/use-cases/request-password-reset.use-case'
import {RequestPasswordResetInput} from '../inputs/request-password-reset.input'
import {PasswordResetResponse} from '../models/password-reset-response.model'

@Resolver()
export class PasswordResetResolver {
    constructor(private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

    @Mutation(() => PasswordResetResponse)
    async requestPasswordReset(@Args('input') input: RequestPasswordResetInput): Promise<PasswordResetResponse> {
        await this.requestPasswordResetUseCase.execute(input.email)
        return {
            success: true,
            message: 'E-mail de recuperação enviado com sucesso!'
        }
    }
}
