import {plainToInstance} from 'class-transformer'
import {IsBoolean,IsEnum,IsNumber,IsString,validateSync} from 'class-validator'

enum NodeEnv {
    development='development',
    test='test',
    production='production'
}

export class EnvironmentVariables {
    @IsEnum(NodeEnv)
    NODE_ENV: NodeEnv

    @IsNumber()
    BACKEND_PORT: number

    @IsString()
    LOG_LEVEL: string

    @IsString()
    DATABASE_URL: string
}

export function validateEnv(config: Record<string,unknown>) {
    const validated=plainToInstance(EnvironmentVariables,config,{enableImplicitConversion: true})
    const errors=validateSync(validated,{skipMissingProperties: false})
    if(errors.length>0) {
        throw new Error(errors.toString())
    }
    return validated
}

const validatedEnv=validateEnv(process.env)

export const environmentConfig={
    isDevelopment: validatedEnv.NODE_ENV==='development',
    isProduction: validatedEnv.NODE_ENV==='production',
    isTest: validatedEnv.NODE_ENV==='test',
    logLevel: validatedEnv.LOG_LEVEL,
    backendPort: validatedEnv.BACKEND_PORT,
    databaseUrl: validatedEnv.DATABASE_URL
} as const

export type EnvironmentConfig=typeof environmentConfig
