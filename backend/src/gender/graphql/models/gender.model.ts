import {Field,ID,ObjectType} from '@nestjs/graphql'

@ObjectType()
export class GenderModel {
    @Field(() => ID)
    id: string

    @Field()
    gender: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
