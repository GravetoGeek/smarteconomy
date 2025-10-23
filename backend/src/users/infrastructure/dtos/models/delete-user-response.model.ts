import {Field,ObjectType} from '@nestjs/graphql'

@ObjectType()
export class DeleteUserResponseModel {
    @Field()
    success: boolean

    @Field()
    message: string
}
