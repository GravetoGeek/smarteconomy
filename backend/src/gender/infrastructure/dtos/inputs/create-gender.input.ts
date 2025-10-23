import {Field,InputType} from '@nestjs/graphql'
import {IsNotEmpty,IsString} from 'class-validator'

@InputType()
export class CreateGenderInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    gender: string
}
