import {PrismaService} from '@/database/prisma/prisma.service'
import {Field,ID,ObjectType,Query,Resolver} from '@nestjs/graphql'

@ObjectType()
export class Profession {
    @Field(() => ID)
    id: string

    @Field()
    profession: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}

@Resolver()
export class ProfessionResolver {
    constructor(private prisma: PrismaService) {}

    @Query(() => [Profession])
    async professions() {
        return this.prisma.profession.findMany()
    }
}
