import {PageInfo} from '@/shared/infrastructure/graphql/models/page-info.model'
import {Field,ObjectType} from '@nestjs/graphql'
import {UserModel} from './user.model'

@ObjectType()
export class UserEdge {
    @Field(() => String)
    cursor: string

    @Field(() => UserModel)
    node: UserModel
}

@ObjectType()
export class UserConnection {
    @Field(() => [UserEdge])
    edges: UserEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo

    @Field(() => Number)
    totalCount: number
}
