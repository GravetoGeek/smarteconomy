import {ApolloDriver,ApolloDriverConfig} from '@nestjs/apollo'
import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {GraphQLModule} from '@nestjs/graphql'
import path from 'path'
import {AccountsModule} from './accounts/accounts.module'
import {AppController} from './app.controller'
import {AppResolver} from './app.resolver'
import {AppService} from './app.service'
import {AuthModule} from './auth/auth.module'
import {CategoriesModule} from './categories/categories.module'
import {DashboardsModule} from './dashboards/dashboards.module'
import {DatabaseModule} from './database/database.module'
import {GenderModule} from './gender/gender.module'
import {ProfessionModule} from './profession/profession.module'
import {ProfilesModule} from './profiles/profiles.module'
import {SharedModule} from './shared/shared.module'
import {TransactionsModule} from './transactions/transactions.module'
import {UsersModule} from './users/users.module'

@Module({
    imports: [
        UsersModule,
        AccountsModule,
        GenderModule,
        ProfessionModule,
        ProfilesModule,
        TransactionsModule,
        CategoriesModule,
        DashboardsModule,
        AuthModule,
        ConfigModule.forRoot(),
        DatabaseModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: path.resolve(process.cwd(),'src/schema.gql'),
            playground: true,
            // ✅ Configuração para respostas de erro limpas e profissionais
            formatError: (error) => {
                // Remover apenas o stacktrace das extensions
                if(error.extensions?.stacktrace) {
                    delete error.extensions.stacktrace
                }

                // ✅ Criar um novo erro limpo sem locations e path
                const cleanError={
                    message: error.message,
                    extensions: error.extensions
                }

                return cleanError
            }
        }
        ),
        SharedModule,
    ],
    controllers: [AppController],
    providers: [AppService,AppResolver],
})
export class AppModule {}
