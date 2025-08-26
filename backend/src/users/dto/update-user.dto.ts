import {PartialType} from '@nestjs/mapped-types'
import {IsEmail,IsOptional,IsString,MaxLength,MinLength} from 'class-validator'
import {CreateUserDto} from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name?: string

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname?: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string
}
