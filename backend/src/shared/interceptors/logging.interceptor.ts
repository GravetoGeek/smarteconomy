import {CallHandler,ExecutionContext,Injectable,Logger,NestInterceptor} from '@nestjs/common'
import {Observable} from 'rxjs'
import {catchError,tap} from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger=new Logger(LoggingInterceptor.name)

    intercept(context: ExecutionContext,next: CallHandler): Observable<any> {
        const now=Date.now()

        // Verificar se é uma requisição HTTP ou GraphQL
        const request=context.switchToHttp().getRequest()

        if(request) {
            // Requisição HTTP normal
            const {method,url,body}=request
            this.logger.log(`[HTTP_REQUEST] ${method} ${url} - Body: ${JSON.stringify(body)}`)

            return next.handle().pipe(
                tap((data) => {
                    const responseTime=Date.now()-now
                    this.logger.log(`[HTTP_RESPONSE] ${method} ${url} - Status: 200 - Time: ${responseTime}ms - Data: ${JSON.stringify(data)}`)
                }),
                catchError((error) => {
                    const responseTime=Date.now()-now
                    this.logger.error(`[HTTP_ERROR] ${method} ${url} - Status: ${error.status||500} - Time: ${responseTime}ms - Error: ${error.message}`)
                    throw error
                })
            )
        } else {
            // Requisição GraphQL ou outro tipo
            this.logger.log(`[GRAPHQL_REQUEST] Operation: createUser - Time: ${new Date().toISOString()}`)

            return next.handle().pipe(
                tap((data) => {
                    const responseTime=Date.now()-now
                    this.logger.log(`[GRAPHQL_RESPONSE] Operation: createUser - Time: ${responseTime}ms - Success`)
                }),
                catchError((error) => {
                    const responseTime=Date.now()-now
                    this.logger.error(`[GRAPHQL_ERROR] Operation: createUser - Time: ${responseTime}ms - Error: ${error.message}`)
                    throw error
                })
            )
        }
    }
}
