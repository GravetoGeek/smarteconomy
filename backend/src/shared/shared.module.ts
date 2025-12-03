import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {FeatureFlagService} from './services/feature-flag.service'
import {LoggerService} from './services/logger.service'
import {SmtpMailService} from './services/smtp-mail.service'

@Module({
    imports: [ConfigModule],
    providers: [LoggerService,SmtpMailService,FeatureFlagService],
    exports: [LoggerService,SmtpMailService,FeatureFlagService],
})
export class SharedModule {}
