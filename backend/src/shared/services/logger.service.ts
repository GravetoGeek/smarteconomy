import {Injectable,Logger} from '@nestjs/common'

@Injectable()
export class LoggerService {
    private readonly logger=new Logger(LoggerService.name)

    logOperation(operation: string,data?: any,context?: string) {
        const logData={
            operation,
            timestamp: new Date().toISOString(),
            data: data? JSON.stringify(data,null,2):undefined,
            context
        }

        this.logger.log(`[${operation}] ${JSON.stringify(logData)}`)
    }

    logError(operation: string,error: any,context?: string) {
        const logData={
            operation,
            timestamp: new Date().toISOString(),
            error: error?.message||error,
            stack: error?.stack,
            context
        }

        this.logger.error(`[${operation}] ERROR: ${JSON.stringify(logData)}`)
    }

    logValidation(operation: string,validationData: any,context?: string) {
        this.logger.log(`[${operation}] VALIDATION: ${JSON.stringify(validationData)} - Context: ${context}`)
    }

    logDatabase(operation: string,query?: any,result?: any,context?: string) {
        const logData={
            operation,
            timestamp: new Date().toISOString(),
            query: query? JSON.stringify(query,null,2):undefined,
            result: result? JSON.stringify(result,null,2):undefined,
            context
        }

        this.logger.log(`[${operation}] DATABASE: ${JSON.stringify(logData)}`)
    }
}
