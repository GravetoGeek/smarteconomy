import {PrismaService} from "@/database/prisma/prisma.service";
import {IUsersRepository} from "../interfaces/users.repository";

export class UsersPrismaRepository implements IUsersRepository {
    sortableFields: string[]=['id','email','name','lastname','birthdate','role','created_at','updated_at'];

    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        throw new Error("Method not implemented.");
    }
    async create(user: any) {
        throw new Error("Method not implemented.");
    }
    async update(user: any) {
        throw new Error("Method not implemented.");
    }
    async delete(id: string) {
        throw new Error("Method not implemented.");
    }
    async findById(id: string) {
        throw new Error("Method not implemented.");
    }
    async findAll() {
        throw new Error("Method not implemented.");
    }
    async get(id: string) {
        throw new Error("Method not implemented.");
    }
    async search(search: any) {
        throw new Error("Method not implemented.");
    }
}
