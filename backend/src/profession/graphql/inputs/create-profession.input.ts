import {Field,InputType} from '@nestjs/graphql'
import {IsNotEmpty,IsString} from 'class-validator'

@InputType()
export class CreateProfessionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    profession: string
}
