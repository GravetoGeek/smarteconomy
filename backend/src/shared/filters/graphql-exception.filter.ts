import {ArgumentsHost,Catch,ExceptionFilter} from '@nestjs/common'
import {GqlArgumentsHost} from '@nestjs/graphql'
import {GraphQLError} from 'graphql'
import {UserNotFoundException as AuthUserNotFoundException,InvalidCredentialsException,InvalidTokenException,RefreshTokenInvalidException,TokenExpiredException,TooManyLoginAttemptsException,UserAccountInactiveException} from '../../auth/domain/exceptions/auth-domain.exception'
import {CategoryAlreadyExistsException,CategoryNotFoundException,InvalidCategoryNameException} from '../../categories/domain/exceptions/category-domain.exception'
import {environmentConfig} from '../../config/environment.config'
import {GenderAlreadyExistsException,GenderNotFoundException,InvalidGenderTypeException} from '../../gender/domain/exceptions/gender-domain.exception'
import {InvalidProfessionTypeException,ProfessionAlreadyExistsException,ProfessionNotFoundException} from '../../profession/domain/exceptions/profession-domain.exception'
import {UserEmailAlreadyExistsException,UserInvalidAgeException,UserInvalidEmailException,UserInvalidPasswordException} from '../../users/domain/exceptions/user-domain.exception'
import {UserNotFoundException} from '../exceptions/user-not-found.exception'

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
    catch(exception: unknown,host: ArgumentsHost) {
        const gqlHost=GqlArgumentsHost.create(host)
        const context=gqlHost.getContext()

        // Se for uma exceção de usuário não encontrado, retornar null
        if(exception instanceof UserNotFoundException) {
            // Para GraphQL, retornar null em vez de lançar erro
            return null
        }

        // Para outras exceções, criar um GraphQLError limpo e profissional
        const graphQLError=new GraphQLError(
            exception instanceof Error? exception.message:'Internal server error',
            {
                extensions: {
                    code: this.getErrorCode(exception)
                }
            }
        )

        throw graphQLError
    }

    private getErrorCode(exception: unknown): string {
        // ✅ Exceções de domínio do módulo users
        if(exception instanceof UserEmailAlreadyExistsException) return 'USER_EMAIL_EXISTS'
        if(exception instanceof UserInvalidAgeException) return 'USER_INVALID_AGE'
        if(exception instanceof UserInvalidEmailException) return 'USER_INVALID_EMAIL'
        if(exception instanceof UserInvalidPasswordException) return 'USER_INVALID_PASSWORD'

        // ✅ Exceções de domínio do módulo gender
        if(exception instanceof GenderNotFoundException) return 'GENDER_NOT_FOUND'
        if(exception instanceof GenderAlreadyExistsException) return 'GENDER_ALREADY_EXISTS'
        if(exception instanceof InvalidGenderTypeException) return 'GENDER_INVALID_TYPE'

        // ✅ Exceções de domínio do módulo profession
        if(exception instanceof ProfessionNotFoundException) return 'PROFESSION_NOT_FOUND'
        if(exception instanceof ProfessionAlreadyExistsException) return 'PROFESSION_ALREADY_EXISTS'
        if(exception instanceof InvalidProfessionTypeException) return 'PROFESSION_INVALID_TYPE'

        // ✅ Exceções de domínio do módulo categories
        if(exception instanceof CategoryNotFoundException) return 'CATEGORY_NOT_FOUND'
        if(exception instanceof CategoryAlreadyExistsException) return 'CATEGORY_ALREADY_EXISTS'
        if(exception instanceof InvalidCategoryNameException) return 'CATEGORY_INVALID_NAME'

        // ✅ Exceções de domínio do módulo auth
        if(exception instanceof InvalidCredentialsException) return 'INVALID_CREDENTIALS'
        if(exception instanceof AuthUserNotFoundException) return 'USER_NOT_FOUND'
        if(exception instanceof InvalidTokenException) return 'INVALID_TOKEN'
        if(exception instanceof TokenExpiredException) return 'TOKEN_EXPIRED'
        if(exception instanceof RefreshTokenInvalidException) return 'REFRESH_TOKEN_INVALID'
        if(exception instanceof UserAccountInactiveException) return 'USER_ACCOUNT_INACTIVE'
        if(exception instanceof TooManyLoginAttemptsException) return 'TOO_MANY_LOGIN_ATTEMPTS'

        // ✅ Outras exceções
        if(exception instanceof UserNotFoundException) return 'USER_NOT_FOUND'
        if(exception instanceof Error&&exception.message.includes('already exists')) return 'RESOURCE_EXISTS'
        if(exception instanceof Error&&exception.message.includes('validation')) return 'VALIDATION_ERROR'

        return 'INTERNAL_SERVER_ERROR'
    }

    private getStatusCode(exception: unknown): number {
        // ✅ Exceções de domínio do módulo users
        if(exception instanceof UserEmailAlreadyExistsException) return 409  // Conflict
        if(exception instanceof UserInvalidAgeException) return 422        // Unprocessable Entity
        if(exception instanceof UserInvalidEmailException) return 422     // Unprocessable Entity
        if(exception instanceof UserInvalidPasswordException) return 422  // Unprocessable Entity

        // ✅ Exceções de domínio do módulo gender
        if(exception instanceof GenderNotFoundException) return 404        // Not Found
        if(exception instanceof GenderAlreadyExistsException) return 409  // Conflict
        if(exception instanceof InvalidGenderTypeException) return 422    // Unprocessable Entity

        // ✅ Exceções de domínio do módulo profession
        if(exception instanceof ProfessionNotFoundException) return 404        // Not Found
        if(exception instanceof InvalidProfessionTypeException) return 422    // Unprocessable Entity

        // ✅ Exceções de domínio do módulo categories
        if(exception instanceof CategoryNotFoundException) return 404        // Not Found
        if(exception instanceof CategoryAlreadyExistsException) return 409  // Conflict
        if(exception instanceof InvalidCategoryNameException) return 422    // Unprocessable Entity

        // ✅ Exceções de domínio do módulo auth
        if(exception instanceof InvalidCredentialsException) return 401        // Unauthorized
        if(exception instanceof AuthUserNotFoundException) return 404         // Not Found
        if(exception instanceof InvalidTokenException) return 401             // Unauthorized
        if(exception instanceof TokenExpiredException) return 401             // Unauthorized
        if(exception instanceof RefreshTokenInvalidException) return 401      // Unauthorized
        if(exception instanceof UserAccountInactiveException) return 403      // Forbidden
        if(exception instanceof TooManyLoginAttemptsException) return 429     // Too Many Requests

        // ✅ Outras exceções
        if(exception instanceof UserNotFoundException) return 404
        if(exception instanceof Error&&exception.message.includes('already exists')) return 409
        if(exception instanceof Error&&exception.message.includes('validation')) return 400

        return 500
    }
}
