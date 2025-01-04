import {Field,ID,ObjectType} from "@nestjs/graphql"
import {Profession} from "@prisma/client"

@ObjectType()
export class User {
    @Field(() => ID)
    id?: string
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
    gender?: string
    @Field()
    genderId?: string
    @Field()
    profession?: string
    @Field()
    professionId?: string
    @Field()
    profile?: string
    @Field()
    password?: string
    @Field()
    created_at?: Date
    @Field()
    updated_at?: Date
}
