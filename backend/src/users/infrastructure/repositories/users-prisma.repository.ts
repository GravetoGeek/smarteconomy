import {PrismaService} from '@/database/prisma/prisma.service'
import {Injectable} from '@nestjs/common'
import {Prisma} from '@prisma/client'
import {LoggerService} from '../../../shared/services/logger.service'
import {SearchParams,SearchResult,UserRepositoryPort} from '../../domain/ports/user-repository.port'
import {User} from '../../domain/user.entity'

@Injectable()
export class UsersPrismaRepository implements UserRepositoryPort {
    readonly sortableFields: string[]=[
        'id','email','name','lastname','birthdate','role','createdAt','updatedAt'
    ]

    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    async updatePassword(userId: string,hashedPassword: string): Promise<void> {
        await this.prisma.user.update({
            where: {id: userId},
            data: {password: hashedPassword}
        })
    }

    async create(user: User): Promise<User> {
        try {
            this.loggerService.logDatabase('CREATE_USER_START',{id: user.id,email: user.email},null,'UsersPrismaRepository')

            const userData: Prisma.UserCreateInput={
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                role: user.role,
                gender: {connect: {id: user.genderId}},
                profession: {connect: {id: user.professionId}},
                profile: user.profileId? {connect: {id: user.profileId}}:undefined,
                password: user.password,
                status: user.status as any,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            const savedUser=await this.prisma.user.create({
                data: userData
            })

            this.loggerService.logDatabase('CREATE_USER_SUCCESS',null,{id: savedUser.id,email: savedUser.email},'UsersPrismaRepository')

            return User.reconstitute(savedUser)
        } catch(error: any) {
            if(error.code==='P2003') {
                const fieldName=error.meta?.field_name||'unknown field'
                const err=new Error(`Foreign key constraint failed on field: ${fieldName}`)
                this.loggerService.logError('CREATE_USER_FK_ERROR',err,'UsersPrismaRepository')
                throw err
            }
            this.loggerService.logError('CREATE_USER_ERROR',error,'UsersPrismaRepository')
            throw error
        }
    }

    async update(user: User): Promise<User> {
        try {
            this.loggerService.logDatabase('UPDATE_USER_START',{id: user.id,email: user.email},null,'UsersPrismaRepository')

            const userData: Prisma.UserUpdateInput={
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                birthdate: user.birthdate,
                role: user.role,
                gender: {connect: {id: user.genderId}},
                profession: {connect: {id: user.professionId}},
                profile: user.profileId? {connect: {id: user.profileId}}:undefined,
                password: user.password,
                status: user.status as any,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            const savedUser=await this.prisma.user.update({
                where: {id: user.id},
                data: userData
            })

            this.loggerService.logDatabase('UPDATE_USER_SUCCESS',null,{id: savedUser.id,email: savedUser.email},'UsersPrismaRepository')

            return User.reconstitute(savedUser)
        } catch(error) {
            this.loggerService.logError('UPDATE_USER_ERROR',error,'UsersPrismaRepository')
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

            if(!user) {
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
            const where: Prisma.UserWhereInput=search.filter? {
                OR: [
                    {name: {contains: search.filter,mode: 'insensitive'}},
                    {lastname: {contains: search.filter,mode: 'insensitive'}},
                    {email: {contains: search.filter,mode: 'insensitive'}}
                ]
            }:{}

            const orderBy: Prisma.UserOrderByWithRelationInput=search.sort&&this.sortableFields.includes(search.sort)
                ? {[search.sort]: search.sortDirection||'asc'}
                :{createdAt: 'desc'}

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

    async findConnection(params: {first?: number; after?: string; last?: number; before?: string; filter?: string}): Promise<{
        items: User[]
        total: number
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor?: string
        endCursor?: string
    }> {
        try {
            const {first,after,last,before,filter}=params
            const limit=first||last||10

            const where: Prisma.UserWhereInput=filter? {
                OR: [
                    {name: {contains: filter,mode: 'insensitive'}},
                    {lastname: {contains: filter,mode: 'insensitive'}},
                    {email: {contains: filter,mode: 'insensitive'}}
                ]
            }:{}

            let cursor=undefined
            let skip=0

            if(after) {
                cursor={id: Buffer.from(after,'base64').toString('ascii')}
                skip=1
            } else if(before) {
                cursor={id: Buffer.from(before,'base64').toString('ascii')}
                skip=1
            }

            const users=await this.prisma.user.findMany({
                where,
                take: last? -(limit+1):(limit+1), // Fetch one extra to check for next page
                skip,
                cursor,
                orderBy: {createdAt: 'desc'} // Default ordering
            })

            const total=await this.prisma.user.count({where})

            let hasNextPage=false
            let hasPreviousPage=false
            let items=users

            if(users.length>limit) {
                if(last) {
                    hasPreviousPage=true
                    items=users.slice(1) // Remove the extra item from the beginning
                } else {
                    hasNextPage=true
                    items=users.slice(0,limit) // Remove the extra item from the end
                }
            }

            // If we are paginating with 'after', we might have a previous page
            if(after) {
                // This is a simplification. In a real relay implementation, checking for previous page when going forward is more complex or requires another query.
                // For now, we assume if we have an 'after' cursor, there is likely a previous page.
                hasPreviousPage=true
            }

            // If we are paginating with 'before', we might have a next page
            if(before) {
                hasNextPage=true
            }

            const startCursor=items.length>0? Buffer.from(items[0].id).toString('base64'):undefined
            const endCursor=items.length>0? Buffer.from(items[items.length-1].id).toString('base64'):undefined

            return {
                items: items.map(u => User.reconstitute(u)),
                total,
                hasNextPage,
                hasPreviousPage,
                startCursor,
                endCursor
            }

        } catch(error) {
            this.loggerService.logError('FIND_CONNECTION_ERROR',error,'UsersPrismaRepository')
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
