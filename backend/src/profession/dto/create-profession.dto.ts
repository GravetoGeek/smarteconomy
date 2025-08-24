import {IsEnum,IsNotEmpty,IsString} from 'class-validator'
import {ProfessionType} from '../domain/entities/profession'

export class CreateProfessionDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(ProfessionType)
    profession: ProfessionType
}
