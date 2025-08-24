import {PrismaService} from '@/database/prisma/prisma.service'
import {Injectable} from '@nestjs/common'
import {LoggerService} from '../../../shared/services/logger.service'
import {SearchParams,SearchResult,UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {AccountStatus,User,UserRole} from '../../domain/user.entity'

@Injectable()
export class UsersPrismaRepository implements UserRepositoryPort {
    readonly sortableFields: string[]=[
        'id','email','name','lastname','birthdate','role','createdAt','updatedAt'
    ]

    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    async save(user: User): Promise<User> {
        try {
            this.loggerService.logDatabase('SAVE_USER_START',{id: user.id,email: user.email},null,'UsersPrismaRepository')

            const userData: any={
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                role: user.role,
                genderId: user.genderId,
                professionId: user.professionId,
                profileId: user.profileId,
                password: user.password,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            const savedUser=await this.prisma.user.upsert({
                where: {id: user.id},
                update: userData,
                create: {
                    id: user.id,
                    ...userData
                }
            })

            this.loggerService.logDatabase('SAVE_USER_SUCCESS',null,{id: savedUser.id,email: savedUser.email},'UsersPrismaRepository')

            return User.reconstitute(savedUser)
        } catch(error) {
            this.loggerService.logError('SAVE_USER_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async findById(id: string): Promise<User|null> {
        try {
            const user=await this.prisma.user.findUnique({
                where: {id}
            })

            return user? User.reconstitute(user):null
        } catch(error) {
            this.loggerService.logError('FIND_USER_BY_ID_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async findByIdOrFail(id: string): Promise<User> {
        try {
            const user=await this.prisma.user.findUnique({
                where: {id}
            })

            if (!user) {
                throw new Error(`User with id ${id} not found`)
            }

            return User.reconstitute(user)
        } catch(error) {
            this.loggerService.logError('FIND_USER_BY_ID_OR_FAIL_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async findByEmail(email: string): Promise<User|null> {
        try {
            const user=await this.prisma.user.findUnique({
                where: {email}
            })

            return user? User.reconstitute(user):null
        } catch(error) {
            this.loggerService.logError('FIND_USER_BY_EMAIL_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users=await this.prisma.user.findMany()
            return users.map(user => User.reconstitute(user))
        } catch(error) {
            this.loggerService.logError('FIND_ALL_USERS_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: {id}
            })
        } catch(error) {
            this.loggerService.logError('DELETE_USER_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async search(search: SearchParams): Promise<SearchResult> {
        try {
            const skip=(search.page-1)*search.limit
            const where=search.filter? {
                OR: [
                    {name: {contains: search.filter,mode: 'insensitive' as any}},
                    {lastname: {contains: search.filter,mode: 'insensitive' as any}},
                    {email: {contains: search.filter,mode: 'insensitive' as any}}
                ]
            }:{}

            const orderBy=search.sort&&this.sortableFields.includes(search.sort)
                ? {[search.sort]: search.sortDirection||'asc'}
                :{createdAt: 'desc' as any}

            const [users,total]=await Promise.all([
                this.prisma.user.findMany({
                    where,
                    orderBy,
                    skip,
                    take: search.limit
                }),
                this.prisma.user.count({where})
            ])

            const totalPages=Math.ceil(total/search.limit)
            const lastPage=totalPages>0? totalPages:1

            return {
                items: users.map(user => User.reconstitute(user)),
                total,
                currentPage: search.page,
                limit: search.limit,
                totalPages,
                lastPage
            }
        } catch(error) {
            this.loggerService.logError('SEARCH_USERS_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async existsByEmail(email: string): Promise<boolean> {
        try {
            const count=await this.prisma.user.count({
                where: {email}
            })
            return count>0
        } catch(error) {
            this.loggerService.logError('EXISTS_BY_EMAIL_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            const count=await this.prisma.user.count({
                where: {id}
            })
            return count>0
        } catch(error) {
            this.loggerService.logError('EXISTS_BY_ID_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }
}
