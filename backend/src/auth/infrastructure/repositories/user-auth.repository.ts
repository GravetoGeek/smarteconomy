import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma/prisma.service'
import { UserRepositoryPort, UserAuthData } from '../../domain/ports/user-repository.port'

@Injectable()
export class UserAuthRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<UserAuthData | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    role: true,
                    status: true
                }
            })

            if (!user) {
                return null
            }

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role,
                status: user.status
            }
        } catch (error) {
            throw error
        }
    }

    async findById(id: string): Promise<UserAuthData | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    role: true,
                    status: true
                }
            })

            if (!user) {
                return null
            }

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role,
                status: user.status
            }
        } catch (error) {
            throw error
        }
    }

    async updateLastLogin(userId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    updatedAt: new Date()
                }
            })
        } catch (error) {
            throw error
        }
    }
}
