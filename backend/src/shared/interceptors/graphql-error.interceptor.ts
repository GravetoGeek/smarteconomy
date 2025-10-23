import {CallHandler,ExecutionContext,Injectable,Logger,NestInterceptor} from '@nestjs/common'
import {GraphQLError} from 'graphql'
import {Observable,throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {environmentConfig} from '../../config/environment.config'

@Injectable()
export class GraphQLErrorInterceptor implements NestInterceptor {
    private readonly logger=new Logger(GraphQLErrorInterceptor.name)

    intercept(context: ExecutionContext,next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                // ✅ Log do erro para debugging (sem expor para o cliente)
                this.logger.error(`GraphQL Error: ${error.message}`,error.stack)

                // ✅ Se for um erro GraphQL já formatado, apenas repassar
                if(error instanceof GraphQLError) {
                    return throwError(() => error)
                }

                // ✅ Para erros não tratados, criar um GraphQLError genérico
                const graphQLError=new GraphQLError(
                    error.message||'Internal server error',
                    {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            statusCode: 500,
                            stacktrace: error.stack
                        }
                    }
                )

                return throwError(() => graphQLError)
            })
        )
    }
}
