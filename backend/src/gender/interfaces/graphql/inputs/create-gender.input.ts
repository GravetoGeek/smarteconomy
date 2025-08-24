import {Field,InputType} from '@nestjs/graphql'

@InputType()
export class CreateGenderInput {
    @Field(() => String)
    gender: string
}
