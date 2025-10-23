import {Args,Mutation,Resolver} from '@nestjs/graphql'
import {ResetPasswordUseCase} from '../../../application/use-cases/reset-password.use-case'
import {ResetPasswordInput} from '../../dtos/inputs/reset-password.input'

@Resolver()
export class ResetPasswordResolver {
    constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {}

    @Mutation(() => Boolean)
    async resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
        return await this.resetPasswordUseCase.execute(input.token,input.newPassword)
    }
}
