import {PrismaService} from '@/database/prisma/prisma.service';
import {Args,ID,Query,Resolver} from '@nestjs/graphql';
import {User} from '../models/User';

@Resolver(() => User)
export class UsersResolver {
    constructor(private prisma: PrismaService) {}

    @Query(() => [User])
    users(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    @Query(() => User)
    userById(@Args('id') id: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    @Query(() => User)
    userByEmail(@Args('email') email: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }
    @Query(() => [User])
    usersByRole(@Args('role') role: string): Promise<User[]> {
        return this.prisma.user.findMany({
            where: {
                role: role
            }
        });
    }
    @Query(() => [User])
    usersByProfession(@Args('profession') searchProfession: string): Promise<User[]> {
        return this.prisma.profession.findUnique({
            where: {
                profession: searchProfession
            }
        }).then(profession => {
            if(!profession) {
                return [];
            }
            return this.prisma.user.findMany({
                where: {
                    professionId: profession.id
                }
            });
        });
    }

}
