import {Field,ObjectType} from '@nestjs/graphql'
import {User} from './User'

@ObjectType()
export class UpdateUserResponse {
    @Field(() => User,{nullable: true})
    user: User|null

    @Field()
    success: boolean
}
