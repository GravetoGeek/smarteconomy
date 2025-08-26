import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './User'

@ObjectType()
export class UpdateUserResponse {
    @Field()
    success: boolean

    @Field(() => User, { nullable: true })
    user: User | null

    @Field()
    message: string
}
