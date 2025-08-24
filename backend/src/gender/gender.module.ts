import {DatabaseModule} from '@/database/database.module'
import {PrismaService} from '@/database/prisma/prisma.service'
import {Module} from '@nestjs/common'
import {GenderResolver} from './infrastructure/graphql/gender.resolver'

@Module({
    imports: [DatabaseModule],
    providers: [
        GenderResolver,
        {
            provide: 'PrismaService',
            useClass: PrismaService
        }
    ]
})
export class GenderModule {}
