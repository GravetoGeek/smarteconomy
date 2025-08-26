import {Injectable} from '@nestjs/common'
import {PrismaService} from '@/database/prisma/prisma.service'
import {LoggerService} from '@/shared/services/logger.service'
import {AccountRepositoryPort,SearchParams,SearchResult} from '../../domain/ports/account-repository.port'
import {Account} from '../../domain/account.entity'

@Injectable()
export class AccountsPrismaRepository implements AccountRepositoryPort {
    readonly sortableFields: string[]=[
        'id','name','type','balance','createdAt','updatedAt'
    ]

    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    async save(account: Account): Promise<Account> {
        try {
            const data=account.toPrisma()
            const saved=await this.prisma.account.upsert({
                where: {id: account.id},
                update: data,
                create: data
            })
            return Account.reconstitute(saved)
        } catch(error) {
            this.loggerService.logError('SAVE_ACCOUNT_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }

    async findById(id: string): Promise<Account|null> {
        try {
            const acc=await this.prisma.account.findUnique({where: {id}})
            return acc? Account.reconstitute(acc):null
        } catch(error) {
            this.loggerService.logError('FIND_ACCOUNT_BY_ID_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }

    async findAllByUser(userId: string): Promise<Account[]> {
        try {
            const accs=await this.prisma.account.findMany({where: {userId}})
            return accs.map(a=> Account.reconstitute(a))
        } catch(error) {
            this.loggerService.logError('FIND_ACCOUNTS_BY_USER_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.account.delete({where: {id}})
        } catch(error) {
            this.loggerService.logError('DELETE_ACCOUNT_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }

    async search(search: SearchParams): Promise<SearchResult> {
        try {
            const skip=(search.page-1)*search.limit
            const where=search.filter? {name: {contains: search.filter, mode: 'insensitive' as any}}:{}
            const orderBy=search.sort&&this.sortableFields.includes(search.sort)? {[search.sort]: search.sortDirection||'asc'}:{createdAt: 'desc' as any}

            const [items,total]=await Promise.all([
                this.prisma.account.findMany({where,orderBy,skip,take: search.limit}),
                this.prisma.account.count({where})
            ])

            const totalPages=Math.ceil(total/search.limit)
            const lastPage=totalPages>0? totalPages:1

            return {
                items: items.map(i=> Account.reconstitute(i)),
                total,
                currentPage: search.page,
                limit: search.limit,
                totalPages,
                lastPage
            }
        } catch(error) {
            this.loggerService.logError('SEARCH_ACCOUNTS_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            const count=await this.prisma.account.count({where: {id}})
            return count>0
        } catch(error) {
            this.loggerService.logError('EXISTS_ACCOUNT_BY_ID_ERROR',error,'AccountsPrismaRepository')
            throw error
        }
    }
}
