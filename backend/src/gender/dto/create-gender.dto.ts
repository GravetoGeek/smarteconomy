import {IsEnum,IsNotEmpty,IsString} from 'class-validator'
import {GenderType} from '../domain/entities/gender'

export class CreateGenderDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(GenderType)
    gender: GenderType
}
