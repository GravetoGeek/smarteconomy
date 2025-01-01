import {Field,ID,ObjectType} from "@nestjs/graphql"

@ObjectType()
export class User {
    @Field(()=>ID)
    id?: number
    @Field()
    email?:string
    @Field()
    name:string
    @Field()
    lastname:string
    @Field()
    birthdate:Date
    @Field()
    role?:string
    @Field()
    gender?:string
    @Field()
    genderId?:number
    @Field()
    profession?:string
    @Field()
    professionId?:number
    @Field()
    profile?:string
    @Field()
    password?:string
    @Field()
    created_at?:Date
    @Field()
    updated_at?:Date
}
