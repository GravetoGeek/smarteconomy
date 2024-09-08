import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AccountsModule} from './accounts/accounts.module';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {CategoriesModule} from './categories/categories.module';
import {DashboardsModule} from './dashboards/dashboards.module';
import {GenderModule} from './gender/gender.module';
import {ProfilesModule} from './profiles/profiles.module';
import {TransactionsModule} from './transactions/transactions.module';
import {UsersModule} from './users/users.module';

@Module({
    imports: [
        UsersModule,
        AccountsModule,
        GenderModule,
        ProfilesModule,
        TransactionsModule,
        CategoriesModule,
        DashboardsModule,
        AuthModule,
        ConfigModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
