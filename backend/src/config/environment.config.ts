export const environmentConfig={
    isDevelopment: process.env.NODE_ENV==='development',
    isProduction: process.env.NODE_ENV==='production',
    isTest: process.env.NODE_ENV==='test',

    // Configurações de erro - mais direta
    includeStacktrace: process.env.INCLUDE_STACKTRACE==='true',

    // Configurações de log
    logLevel: process.env.LOG_LEVEL||'info',

    // Configurações de porta
    backendPort: process.env.BACKEND_PORT||3000,

    // Configurações de banco
    databaseUrl: process.env.DATABASE_URL,
} as const
