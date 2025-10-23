import {Field,Int,ObjectType} from '@nestjs/graphql'
import {UserModel} from './user.model'

@ObjectType()
export class UserSearchResultModel {
    @Field(() => [UserModel])
    items: UserModel[]

    @Field(() => Int)
    total: number

    @Field(() => Int)
    currentPage: number

    @Field(() => Int)
    limit: number

    @Field(() => Int)
    totalPages: number

    @Field(() => Int)
    lastPage: number
}
