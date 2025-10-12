import { InputType, Field, Float } from '@nestjs/graphql'

@InputType()
export class CreateAccountInput {
    @Field()
    name: string

    @Field()
    type: string

    @Field(() => Float, { nullable: true })
    balance?: number

    @Field()
    userId: string
}
