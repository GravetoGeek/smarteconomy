import {IsEmail,IsStrongPassword} from "class-validator"

export class CreateUserDto {
    @IsEmail()
    readonly email?:string
    @IsStrongPassword()
    readonly password?:string
}
