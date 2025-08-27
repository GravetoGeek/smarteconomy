import { Inject, Injectable } from '@nestjs/common'
import { AuthToken } from '../../domain/entities/auth-token'
import {
    EmailAlreadyExistsException,
    InvalidEmailException,
    WeakPasswordException
} from '../../domain/exceptions/auth-domain.exception'
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port'
import { HashServicePort } from '../../domain/ports/hash-service.port'
import { JwtServicePort } from '../../domain/ports/jwt-service.port'
import { UserRepositoryPort } from '../../domain/ports/user-repository.port'
import { AUTH_REPOSITORY, HASH_SERVICE, JWT_SERVICE, USER_REPOSITORY } from '../../domain/tokens'
import { Email } from '../../domain/value-objects/email.vo'
import { Password } from '../../domain/value-objects/password.vo'

export interface SignupRequest {
    email: string
    password: string
    name: string
    lastname: string
    birthdate: Date
    genderId: string
    professionId: string
}

export interface SignupResponse {
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
export class SignupUseCase {
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

    async execute(request: SignupRequest): Promise<SignupResponse> {
        const { email, password, name, lastname, birthdate, genderId, professionId } = request

        // Validar email e senha
        const emailVO = new Email(email)
        const passwordVO = new Password(password)

        // Verificar se email já existe
        const existingUser = await this.userRepository.findByEmail(emailVO.getValue())
        if (existingUser) {
            throw new EmailAlreadyExistsException(emailVO.getValue())
        }

        // Hash da senha
        const hashedPassword = await this.hashService.hash(passwordVO.getValue())

        // Criar usuário
        const newUser = await this.userRepository.create({
            email: emailVO.getValue(),
            name: name.trim(),
            lastname: lastname.trim(),
            birthdate,
            password: hashedPassword,
            genderId,
            professionId,
            role: 'USER'
        })

        // Gerar tokens
        const accessToken = await this.jwtService.sign({
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role
        })

        const refreshToken = await this.jwtService.sign({
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role
        })

        // Criar AuthToken
        const authToken = AuthToken.create({
            accessToken,
            refreshToken,
            expiresIn: 24 * 60 * 60, // 24 horas em segundos
            userId: newUser.id
        })

        // Salvar token
        await this.authRepository.saveToken(authToken)

        return {
            accessToken,
            refreshToken,
            expiresIn: authToken.expiresIn,
            tokenType: authToken.tokenType,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        }
    }
}
