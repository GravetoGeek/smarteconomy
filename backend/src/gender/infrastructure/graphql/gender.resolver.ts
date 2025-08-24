import {PrismaService} from '@/database/prisma/prisma.service'
import {Field,ID,ObjectType,Query,Resolver} from '@nestjs/graphql'

@ObjectType()
export class Gender {
    @Field(() => ID)
    id: string

    @Field()
    gender: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}

@Resolver()
export class GenderResolver {
    constructor(private prisma: PrismaService) {}

    @Query(() => [Gender])
    async genders() {
        return this.prisma.gender.findMany()
    }
}
