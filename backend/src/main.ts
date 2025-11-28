import {ValidationPipe} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import 'dotenv/config'
import {AppModule} from './app.module'
import {environmentConfig} from './config/environment.config'
import {GraphQLExceptionFilter} from './shared/filters/graphql-exception.filter'

async function bootstrap() {
    const app=await NestFactory.create(AppModule)

    const isProd=environmentConfig.isProduction
    app.useGlobalPipes(new ValidationPipe({
        whitelist: isProd? true:false,
        forbidNonWhitelisted: isProd? true:false,
        transform: true,
        skipMissingProperties: isProd? false:true,
        skipNullProperties: isProd? false:true,
        skipUndefinedProperties: isProd? false:true
    }))

    // ✅ Aplicar filtro de exceção global para tratamento correto de erros
    app.useGlobalFilters(new GraphQLExceptionFilter())

    await app.listen(environmentConfig.backendPort||3000)
}
bootstrap()
