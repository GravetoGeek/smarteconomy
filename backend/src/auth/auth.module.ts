import {Logger,Module} from '@nestjs/common'
import {DatabaseModule} from '../database/database.module'
import {AuthApplicationService} from './application/services/auth-application.service'
import {LoginUseCase} from './application/use-cases/login.use-case'
import {LogoutUseCase} from './application/use-cases/logout.use-case'
import {RefreshTokenUseCase} from './application/use-cases/refresh-token.use-case'
import {SignupUseCase} from './application/use-cases/signup.use-case'
import {ValidateTokenUseCase} from './application/use-cases/validate-token.use-case'
import {AUTH_REPOSITORY,HASH_SERVICE,JWT_SERVICE,USER_REPOSITORY} from './domain/tokens'
import {JwtGuard} from './infrastructure/guards/jwt.guard'
import {AuthMemoryRepository} from './infrastructure/repositories/auth-memory.repository'
import {UserAuthRepository} from './infrastructure/repositories/user-auth.repository'
import {HashBcryptService} from './infrastructure/services/hash-bcrypt.service'
import {JwtCryptoService} from './infrastructure/services/jwt-crypto.service'
import {AuthResolver} from './interfaces/graphql/resolvers/auth.resolver'

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: AUTH_REPOSITORY,
            useClass: AuthMemoryRepository
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserAuthRepository
        },
        {
            provide: HASH_SERVICE,
            useClass: HashBcryptService
        },
        {
            provide: JWT_SERVICE,
            useClass: JwtCryptoService
        },
        LoginUseCase,
        SignupUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        ValidateTokenUseCase,
        AuthApplicationService,
        AuthResolver,
        JwtGuard
    ],
    exports: [AuthApplicationService,AUTH_REPOSITORY,USER_REPOSITORY,HASH_SERVICE,JWT_SERVICE,JwtGuard]
})
export class AuthModule {
    private readonly logger=new Logger(AuthModule.name)

    constructor() {
        this.logger.log('AuthModule initialized')
    }
}
