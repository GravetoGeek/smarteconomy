import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
    @Field(() => ID)
    id: string

    @Field()
    email: string

    @Field()
    name: string

    @Field()
    lastname: string

    @Field()
    birthdate: Date

    @Field()
    role: string

    @Field()
    genderId: string

    @Field()
    professionId: string

    @Field({ nullable: true })
    profileId?: string

    @Field()
    status: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
