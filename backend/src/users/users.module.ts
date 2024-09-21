import {DatabaseModule} from '@/database/database.module';
import {Module} from '@nestjs/common';
import {UsersResolver} from './graphql/resolvers/users.resolver';

@Module({
    imports: [DatabaseModule],
    providers: [UsersResolver]
})
export class UsersModule {}
