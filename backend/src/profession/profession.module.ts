import {DatabaseModule} from '@/database/database.module'
import {PrismaService} from '@/database/prisma/prisma.service'
import {Module} from '@nestjs/common'
import {ProfessionResolver} from './infrastructure/graphql/profession.resolver'

@Module({
    imports: [DatabaseModule],
    providers: [
        ProfessionResolver,
        {
            provide: 'PrismaService',
            useClass: PrismaService
        }
    ]
})
export class ProfessionModule {}
