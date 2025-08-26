import {Module} from '@nestjs/common'
import {DatabaseModule} from '@/database/database.module'
import {SharedModule} from '@/shared/shared.module'
import {AccountsPrismaRepository} from './infrastructure/repositories/accounts-prisma.repository'
import {ACCOUNT_REPOSITORY} from './domain/tokens'
import {AccountsApplicationService} from './application/services/accounts-application.service'
import {CreateAccountUseCase} from './application/use-cases/create-account.use-case'
import {AccountsResolver} from './interfaces/graphql/resolvers/accounts.resolver'

@Module({
	imports: [SharedModule, DatabaseModule],
	providers: [
		// Adapters
		{
			provide: ACCOUNT_REPOSITORY,
			useClass: AccountsPrismaRepository
		},

		// Use cases
		CreateAccountUseCase,

		// Application services
		AccountsApplicationService,

		// Interface adapters
		AccountsResolver
	],
	exports: [AccountsApplicationService, ACCOUNT_REPOSITORY]
})
export class AccountsModule {}
