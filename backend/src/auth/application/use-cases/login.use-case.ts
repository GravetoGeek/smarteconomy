import {Inject,Injectable} from '@nestjs/common'
import {AuthToken} from '../../domain/entities/auth-token'
import {
    InvalidCredentialsException,
    UserAccountInactiveException,
    UserNotFoundException
} from '../../domain/exceptions/auth-domain.exception'
import {AuthRepositoryPort} from '../../domain/ports/auth-repository.port'
import {HashServicePort} from '../../domain/ports/hash-service.port'
import {JwtServicePort} from '../../domain/ports/jwt-service.port'
import {UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {AUTH_REPOSITORY,HASH_SERVICE,JWT_SERVICE,USER_REPOSITORY} from '../../domain/tokens'
import {Email} from '../../domain/value-objects/email.vo'
import {Password} from '../../domain/value-objects/password.vo'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
    user: {
        id: string
        email: string
        role: string
    }
}

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE)
        private readonly hashService: HashServicePort,
        @Inject(JWT_SERVICE)
        private readonly jwtService: JwtServicePort
    ) {}

    async execute(request: LoginRequest): Promise<LoginResponse> {
        const {email,password}=request

        // Validar email e senha
        const emailVO=new Email(email)
        const passwordVO=new Password(password)

        // Buscar usuário por email
        const user=await this.userRepository.findByEmail(emailVO.getValue())
        if(!user) {
            throw new UserNotFoundException(emailVO.getValue())
        }

        // Verificar se a conta está ativa
        if(user.status!=='ACTIVE') {
            throw new UserAccountInactiveException()
        }

        // Verificar senha
        const isPasswordValid=await this.hashService.compare(
            passwordVO.getValue(),
            user.password
        )

        if(!isPasswordValid) {
            throw new InvalidCredentialsException()
        }

        // Gerar tokens
        const accessToken=await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        })

        const refreshToken=await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        })

        // Criar AuthToken
        const authToken=AuthToken.create({
            accessToken,
            refreshToken,
            expiresIn: 24*60*60, // 24 horas em segundos
            userId: user.id
        })

        // Salvar token
        await this.authRepository.saveToken(authToken)

        // Atualizar último login
        await this.userRepository.updateLastLogin(user.id)

        return {
            accessToken,
            refreshToken,
            expiresIn: authToken.expiresIn,
            tokenType: authToken.tokenType,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }
}
