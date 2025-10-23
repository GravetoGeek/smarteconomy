import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: string

    @Field(() => String)
    email: string

    @Field(() => String)
    name: string

    @Field(() => String)
    lastname: string

    @Field(() => Date)
    birthdate: Date

    @Field(() => String)
    role: string

    @Field(() => String)
    genderId: string

    @Field(() => String)
    professionId: string

    @Field(() => String, { nullable: true })
    profileId?: string | null

    @Field(() => String)
    status: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
