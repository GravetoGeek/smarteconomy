# SmartEconomy Backend · Guia para Agentes de IA

> **Toda documentação gerada e toda conversa no chat devem ser redigidas em português brasileiro.**

> **Sempre analisar completamente todo o projeto antes de responder.**

## Visão Geral da Arquitetura

-   Cada módulo de negócio (`users`, `accounts`, `transactions`, etc.) segue a arquitetura hexagonal: `domain` (entidades puras e portas), `application` (casos de uso + serviços orquestradores) e `infrastructure` (repositórios Prisma, integrações externas, adaptadores GraphQL). Não utilize NestJS ou Prisma dentro de `domain`.
-   GraphQL fica em `infrastructure/graphql`. DTOs de entrada/saída moram em `infrastructure/dtos/{inputs,models}`; pastas legadas `src/**/dto` existem apenas como herança e não devem ser reutilizadas.
-   Serviços de aplicação agregam casos de uso (ex.: `src/users/application/services/users-application.service.ts`). Novos fluxos exigem declarar portas no domínio, implementar adaptadores na infraestrutura e conectá-los via camada de aplicação.

## Padrões Cruciais

-   Sempre declare o tipo explícito em `@Field` para primitivos opcionais (`@Field(() => String, { nullable: true })`). Falhas nesse padrão geram `UndefinedTypeError` ao montar o schema GraphQL; veja `transactions/infrastructure/dtos/models/transaction.model.ts`.
-   Conversões entre entidades e modelos GraphQL ocorrem em mappers (`transactions/infrastructure/graphql/mappers/transaction-graphql.mapper.ts`). Não coloque lógica de transformação diretamente em resolvers.
-   Guards e interceptors residem em `auth/infrastructure`. Testes reutilizam tokens de mock (`JWT_SERVICE`, `JwtGuard`). Consulte os specs existentes antes de criar novos dublês.
-   Adaptadores Prisma ficam em `infrastructure/repositories`. Eles injetam `PrismaService` de `database/prisma` e retornam entidades de domínio. Concentre a montagem das queries nessas classes.
-   Configurações centralizadas em `config/environment.config.ts`. Novas variáveis devem ser adicionadas ali e expostas pelo módulo de configuração do Nest.

## Fluxos de Trabalho

-   Desenvolvimento local: `npm run start:dev` (requer `.env.development`) ou `docker compose up --build` dentro de `backend/` para subir API, Postgres e Prisma Studio.
-   Testes: `npm run test` (unitários), `npm run test:int` (integração), `npm run test:e2e` (end-to-end). O cenário E2E depende de Docker e usa `.env.test`. Seeds residem em `prisma/seed.ts` e `seed-data.sql`.
-   Para depurar erros de schema sem Docker, use `npx ts-node -r tsconfig-paths/register src/main.ts` e observe os logs de reflexão.
-   Alterou o schema Prisma? Rode `npx prisma generate` para atualizar os artefatos TypeScript antes de compilar ou testar.

## Boas Práticas Específicas

-   Siga o padrão de nomes: casos de uso terminam com `UseCase`, DTOs de requisição com `Request`, modelos GraphQL com `Model`. Registre enums com `registerEnumType` no mesmo arquivo do modelo.
-   Utilitários de teste estão em `src/__tests__/utils`. Suites de integração/E2E inicializam `AppModule` completo e limpam o banco com `TestHelpers.clearDatabase`; certifique-se de passar uma instância válida do Prisma.
-   Mantenha arquivos novos em ASCII, sem ponto e vírgula, e escreva comentários curtos apenas quando a intenção não for evidente.
-   O diretório `frontend/` existe, mas o foco atual é o backend. Evite tocar no app mobile salvo orientação explícita.

> Dúvidas sobre limites de módulos ou contratos? Consulte o `README.md` específico em cada módulo — eles trazem diagramas e descrições de portas/adaptadores.
