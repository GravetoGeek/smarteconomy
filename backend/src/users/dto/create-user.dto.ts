import {IsEmail,IsEnum,IsString,IsUUID,MaxLength,MinLength} from 'class-validator'

export enum UserRole {
    USER='USER',
    ADMIN='ADMIN'
}

export enum AccountStatus {
    ACTIVE='ACTIVE',
    INACTIVE='INACTIVE'
}

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name: string

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname: string

    @IsString()
    birthdate: string

    @IsString()
    role: string

    @IsString()
    genderId: string

    @IsString()
    professionId: string

    @IsString()
    @MinLength(8)
    password: string
}
