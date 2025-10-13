import {Module} from '@nestjs/common'
import {LoggerService} from './services/logger.service'
import {SmtpMailService} from './services/smtp-mail.service'

@Module({
    providers: [LoggerService,SmtpMailService],
    exports: [LoggerService,SmtpMailService],
})
export class SharedModule {}
