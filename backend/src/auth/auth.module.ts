import {Logger,Module} from '@nestjs/common'
import {DatabaseModule} from '../database/database.module'
import {SharedModule} from '../shared/shared.module'
import {AuthApplicationService} from './application/services/auth-application.service'
import {LoginUseCase} from './application/use-cases/login.use-case'
import {LogoutUseCase} from './application/use-cases/logout.use-case'
import {RefreshTokenUseCase} from './application/use-cases/refresh-token.use-case'
import {RequestPasswordResetUseCase} from './application/use-cases/request-password-reset.use-case'
import {ResetPasswordUseCase} from './application/use-cases/reset-password.use-case'
import {SignupUseCase} from './application/use-cases/signup.use-case'
import {ValidateTokenUseCase} from './application/use-cases/validate-token.use-case'
import {AUTH_REPOSITORY,HASH_SERVICE,JWT_SERVICE,PASSWORD_RESET_TOKEN_REPOSITORY,USER_REPOSITORY} from './domain/tokens'
import {AuthResolver} from './infrastructure/graphql/resolvers/auth.resolver'
import {PasswordResetResolver} from './infrastructure/graphql/resolvers/password-reset.resolver'
import {ResetPasswordResolver} from './infrastructure/graphql/resolvers/reset-password.resolver'
import {JwtGuard} from './infrastructure/guards/jwt.guard'
import {AuthMemoryRepository} from './infrastructure/repositories/auth-memory.repository'
import {PasswordResetTokenRepository} from './infrastructure/repositories/password-reset-token.repository'
import {UserAuthRepository} from './infrastructure/repositories/user-auth.repository'
import {HashBcryptService} from './infrastructure/services/hash-bcrypt.service'
import {JwtCryptoService} from './infrastructure/services/jwt-crypto.service'
@Module({
    imports: [DatabaseModule,SharedModule],
    providers: [
        {provide: AUTH_REPOSITORY,useClass: AuthMemoryRepository},
        {provide: USER_REPOSITORY,useClass: UserAuthRepository},
        {provide: HASH_SERVICE,useClass: HashBcryptService},
        {provide: JWT_SERVICE,useClass: JwtCryptoService},
        {provide: PASSWORD_RESET_TOKEN_REPOSITORY,useClass: PasswordResetTokenRepository},
        LoginUseCase,
        SignupUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        ValidateTokenUseCase,
        AuthApplicationService,
        AuthResolver,
        JwtGuard,
        RequestPasswordResetUseCase,
        PasswordResetResolver,
        ResetPasswordResolver,
        ResetPasswordUseCase,
    ],
    exports: [AuthApplicationService,AUTH_REPOSITORY,USER_REPOSITORY,HASH_SERVICE,JWT_SERVICE,PASSWORD_RESET_TOKEN_REPOSITORY,JwtGuard]
})
export class AuthModule {
    private readonly logger=new Logger(AuthModule.name)

    constructor() {
        this.logger.log('AuthModule initialized')
    }
}
