import {Args,Mutation,Resolver} from '@nestjs/graphql'
import {RequestPasswordResetUseCase} from '../../../application/use-cases/request-password-reset.use-case'
import {RequestPasswordResetInput} from '../../dtos/inputs/request-password-reset.input'
import {PasswordResetResponse} from '../../dtos/models/password-reset-response.model'
import {AuthGraphQLMapper} from '../mappers/auth-graphql.mapper'

@Resolver()
export class PasswordResetResolver {
    constructor(private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

    @Mutation(() => PasswordResetResponse)
    async requestPasswordReset(@Args('input') input: RequestPasswordResetInput): Promise<PasswordResetResponse> {
        await this.requestPasswordResetUseCase.execute(input.email)
        return AuthGraphQLMapper.toPasswordResetResponse(
            true,
            'E-mail de recuperação enviado com sucesso!'
        )
    }
}
