import {PrismaService} from "@/database/prisma/prisma.service";
import {NotFoundException} from "@nestjs/common";
import {User} from "../graphql/models/User";
import {ICreateUser} from "../interfaces/create-user";
import {IUsersRepository,SearchParams,SearchResult} from "../interfaces/users.repository";

export class UsersPrismaRepository implements IUsersRepository {
    sortableFields: string[]=['id','email','name','lastname','birthdate','role','created_at','updated_at'];

    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string): Promise<User> {
        const user=await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user
    }
    async create(user: ICreateUser): Promise<User> {
        const newUser=await this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                role: user.role,
                genderId: user.genderId,
                professionId: user.professionId,
                password: user.password
            }
        });

        return newUser;
    }
    async update(user: any): Promise<User> {
        const updatedUser=await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                role: user.role,
            }
        });

        return updatedUser;
    }
    async delete(id: string): Promise<User> {
        const user=await this.prisma.user.delete({
            where: {
                id: id
            }
        });

        return user;
    }
    async findById(id: string): Promise<User> {
        const user=await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user
    }
    async findAll() {
        const users=await this.prisma.user.findMany();

        return users;
    }
    async get(id: string): Promise<User> {
        const user=await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
    }
    async search(search: SearchParams): Promise<SearchResult> {
        const users=await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: search.filter
                        }
                    },
                    {
                        name: {
                            contains: search.filter
                        }
                    },
                    {
                        lastname: {
                            contains: search.filter
                        }
                    },
                    {
                        role: {
                            contains: search.filter
                        }
                    }
                ]
            }
        });

        const result: SearchResult={
            items: users,
            total: users.length,
            currentPage: search.page,
            limit: search.limit,
            totalPages: Math.ceil(users.length/search.limit),
            lastPage: Math.ceil(users.length/search.limit)
        }

        return result;

    }
}
