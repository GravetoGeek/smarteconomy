import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from './User'

@ObjectType()
export class SearchResult {
    @Field(() => [User])
    items: User[]

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
