import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Category {
    @Field()
    id: string

    @Field()
    category: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
