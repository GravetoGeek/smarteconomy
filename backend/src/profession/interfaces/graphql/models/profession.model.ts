import {Field,ID,ObjectType} from '@nestjs/graphql'

@ObjectType()
export class ProfessionModel {
    @Field(() => ID)
    id: string

    @Field()
    profession: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
