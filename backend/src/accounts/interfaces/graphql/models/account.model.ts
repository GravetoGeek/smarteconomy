import { ObjectType, Field, ID, Float } from '@nestjs/graphql'

@ObjectType()
export class Account {
    @Field(() => ID)
    id: string

    @Field()
    name: string

    @Field()
    type: string

    @Field(() => Float)
    balance: number

    @Field()
    userId: string

    @Field()
    status: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
