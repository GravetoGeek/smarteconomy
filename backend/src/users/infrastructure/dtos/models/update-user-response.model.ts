import {Field,ObjectType} from '@nestjs/graphql'
import {UserModel} from './user.model'

@ObjectType()
export class UpdateUserResponseModel {
    @Field()
    success: boolean

    @Field(() => UserModel,{nullable: true})
    user: UserModel|null

    @Field()
    message: string
}
