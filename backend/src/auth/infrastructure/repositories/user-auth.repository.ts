import {Injectable} from '@nestjs/common'
import type {AccountStatus,Role} from '@prisma/client'
import {PrismaService} from '../../../database/prisma/prisma.service'
import {CreateUserData,UserAuthData,UserRepositoryPort} from '../../domain/ports/user-repository.port'

@Injectable()
export class UserAuthRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<UserAuthData|null> {
        const user=await this.prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                status: true
            }
        })

        if(!user) {
            return null
        }

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status
        }
    }

    async findById(id: string): Promise<UserAuthData|null> {
        const user=await this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                status: true
            }
        })

        if(!user) {
            return null
        }

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status
        }
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: {id: userId},
            data: {
                updatedAt: new Date()
            }
        })
    }

    async create(userData: CreateUserData): Promise<UserAuthData> {
        const user=await this.prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                lastname: userData.lastname,
                birthdate: userData.birthdate,
                password: userData.password,
                genderId: userData.genderId,
                professionId: userData.professionId,
                role: (userData.role||'USER') as Role,
                status: 'ACTIVE' as AccountStatus
            },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                status: true
            }
        })

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status
        }
    }

    async updatePassword(userId: string,hashedPassword: string): Promise<void> {
        await this.prisma.user.update({
            where: {id: userId},
            data: {password: hashedPassword,updatedAt: new Date()}
        })
    }
}
