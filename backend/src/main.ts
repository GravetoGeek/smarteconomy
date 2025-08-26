import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GraphQLExceptionFilter } from './shared/filters/graphql-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(new ValidationPipe({
        whitelist: false, // ✅ Desabilitar whitelist para debug
        forbidNonWhitelisted: false, // ✅ Desabilitar forbidNonWhitelisted para debug
        transform: true,
        // ✅ Configurações para debug
        skipMissingProperties: true,
        skipNullProperties: true,
        skipUndefinedProperties: true
    }))

    // ✅ Aplicar filtro de exceção global para tratamento correto de erros
    app.useGlobalFilters(new GraphQLExceptionFilter())

    await app.listen(process.env.BACKEND_PORT || 3000)
}
bootstrap()
