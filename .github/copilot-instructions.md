# SmartEconomy Backend · Manual Completo para Agentes de IA

> **Toda documentação e interação devem ser redigidas em português brasileiro.**

> **Analise sempre todo o projeto antes de responder.**

---

## 📑 Índice

1. Visão Geral e Princípios
2. Regras de Negócio
3. Padrão de Commits
4. Arquitetura Hexagonal
5. Domain-Driven Design (DDD)
6. API GraphQL: Referência e Exemplos
7. Coleção Postman: Guia e Workflows
8. Fluxos de Trabalho e Boas Práticas
9. Análise Técnica e Métricas
10. Contribuição e Expansão

---

## 1. Visão Geral e Princípios

### Stack principal

-   NestJS 11 com GraphQL (Apollo Server).
-   Prisma ORM 5.19.1 sobre PostgreSQL.
-   Node.js 20, TypeScript 5, ESLint + Prettier.
-   Testes com Jest (unit, integration, e2e) e script `npm run test:unit|int|e2e`.
-   Containerização via Docker Compose (backend, banco, prisma studio).

### Estrutura de pastas (hexagonal + DDD)

```
src/
  accounts/      # módulos de domínio seguem o mesmo padrão
  auth/
  users/
    domain/        # entidades, value objects, portas
    application/   # casos de uso, serviços de aplicação
    infrastructure/# repositórios (Prisma), serviços externos
    interfaces/    # resolvers GraphQL, DTOs de entrada/saída
  shared/        # utilitários, value objects reutilizáveis
```

### Convenções transversais

-   Linguagem ubíqua obrigatória: nomes de classes, métodos e campos refletem o domínio (ex.: `CreateAccountUseCase`, `UserStatus`).
-   Nada de dependências de frameworks dentro de `domain/` (somente TypeScript puro).
-   Portas (`*.port.ts`) definem contratos; adaptadores ficam em `infrastructure/`.
-   DTOs e validadores pertencem à camada de interfaces/infrastructure, nunca ao domínio.
-   Arquivos de configuração centralizados em `src/config/environment.config.ts`.
-   Sempre preferir value objects para validações repetidas (Email, Password, Money etc.).

### Setup rápido

```bash
# 1. Clone o repositório e entre no backend
git clone <url>
cd smarteconomy/backend

# 2. Configure variáveis de ambiente
cp env.development .env

# 3. Suba os serviços com Docker
fish -c "docker compose up -d"
# ou
npm install
npm run prisma:generate
npm run start:dev
```

### Serviços disponíveis em desenvolvimento

-   API NestJS: `http://localhost:3000`.
-   Playground GraphQL: `http://localhost:3000/graphql`.
-   Prisma Studio: `http://localhost:5555`.

### Fluxo mínimo para criar um novo módulo

1. Desenhe o modelo de domínio (entidades, agregados, value objects, portas).
2. Crie as portas em `domain/ports` e as entidades em `domain/entities`.
3. Implemente casos de uso em `application/use-cases` e orquestração em `application/services`.
4. Crie adaptadores em `infrastructure/` (repositories Prisma, serviços externos, loggers).
5. Exponha via `interfaces/graphql` (resolver + models + inputs) ou REST, conforme necessário.
6. Cubra com testes unitários (domínio) e integração (adapters) antes de expor publicamente.

---

## 2. Regras de Negócio

### 📋 Visão geral

Regras aplicadas em todas as camadas (domínio, aplicação, infraestrutura e interfaces) para garantir consistência, segurança e compliance.

### 👤 Módulo de Usuários

#### RN-001: Validação de email

-   Email deve ser único no sistema.
-   Formato válido obrigatório.
-   Bloquear domínios temporários.
-   Verificação de email obrigatória para ativação.

#### RN-002: Validação de senha

-   Mínimo 8 caracteres.
-   Pelo menos 1 número, 1 letra maiúscula e 1 caractere especial.
-   Hash com bcrypt (12 salt rounds).
-   Senhas comuns (123456, password etc.) são rejeitadas.

#### RN-003: Validação de idade

-   Idade mínima 13 anos e máxima 120 anos.
-   Datas futuras não são aceitas.

#### RN-004: Validação de nome

-   Nome e sobrenome entre 2 e 50 caracteres.
-   Permitir apenas letras, acentos e hífens.
-   Remover espaços extras automaticamente.

#### RN-005: Estados válidos

-   `ACTIVE`: acesso completo.
-   `INACTIVE`: acesso suspenso temporariamente.
-   `SUSPENDED`: sanção por violação.

#### RN-006: Transições de status

-   ACTIVE → INACTIVE ou SUSPENDED permitido.
-   INACTIVE → ACTIVE permitido.
-   SUSPENDED → ACTIVE somente por admin.
-   SUSPENDED → INACTIVE proibido.

#### RN-007: Papéis disponíveis

-   `USER` (padrão) e `ADMIN`.

#### RN-008: Promoção/democao

-   Apenas ADMIN promove/demove.
-   Não é permitido ficar sem nenhum ADMIN.

### 💰 Módulo de Contas Financeiras

#### RN-009: Nome da conta

-   Entre 3 e 100 caracteres.
-   Único por usuário.
-   Permite letras, números, espaços e hífens.

#### RN-010: Tipos de conta

-   `CHECKING`, `SAVINGS`, `CREDIT_CARD`, `INVESTMENT`, `CASH`.

#### RN-011: Saldo

-   Saldo inicial ≥ 0 (exceto cartão de crédito).
-   Saldo negativo apenas para `CREDIT_CARD`.
-   Precisão máxima de 2 casas decimais.
-   Valor máximo R$ 999.999.999,99.

#### RN-012: Operações de crédito

-   Valor entre R$ 0,01 e R$ 999.999,99.
-   Atualizar `updatedAt` e registrar log de auditoria.

#### RN-013: Operações de débito

-   Verificar saldo (exceto `CREDIT_CARD`).
-   Valor mínimo R$ 0,01.
-   Cartão de crédito aceita saldo negativo até limite.
-   Débitos que violam limite são bloqueados.

#### RN-014: Status da conta

-   `ACTIVE`: operações liberadas.
-   `INACTIVE`: apenas consulta.
-   Contas inativas não recebem/transferem valores.

### 🔒 Módulo de Autenticação

#### RN-015: Tentativas de login

-   Máximo 5 tentativas por email em 15 minutos.
-   Bloqueio de 15 minutos após limite.
-   Log de tentativas obrigatório.
-   Notificação por email em casos suspeitos.

#### RN-016: Credenciais

-   Email e senha obrigatórios.
-   Usuário precisa estar ACTIVE e com email verificado.
-   Status SUSPENDED/INACTIVE impede login.

#### RN-017: Geração de token

-   Expiração do access token em 24h.
-   Refresh token com 30 dias.
-   Algoritmo HS256.
-   Claims obrigatórias: userId, email, role.

#### RN-018: Validação de token

-   Verificar assinatura, expiração e existência/status do usuário.
-   Tokens inválidos retornam 401.

#### RN-019: Logout seguro

-   Invalidação do refresh token.
-   Log do evento.
-   Limpeza do contexto de autenticação.

### 👤 Módulo de Gênero

#### RN-020: Gêneros suportados

-   Masculino, Feminino, Não-binário, Prefiro não informar, Agênero, Outros (texto livre).

#### RN-021: Validação

-   Campo obrigatório na criação.
-   Pode ser alterado pelo usuário.
-   Não duplicar registros.

### 💼 Módulo de Profissão

#### RN-022: Nome

-   3 a 100 caracteres.
-   Única no sistema.
-   Normalizar (trim + case insensitive).

#### RN-023: Criação

-   Apenas ADMIN cria novas profissões.
-   Validar existência antes de inserir.

### 🔐 Segurança geral

#### RN-024: LGPD

-   Consentimento explícito para coleta.
-   Direito de acesso e exclusão (soft delete).
-   Portabilidade em JSON.

#### RN-025: Auditoria

-   Log de operações críticas com IP + timestamp UTC.
-   Retenção mínima de 1 ano.

#### RN-026: Rate limiting

-   100 req/min por IP em endpoints públicos.
-   1000 req/min por usuário autenticado.
-   10 tentativas de reset de senha por hora.
-   Responder com 429 ao exceder.

### 🎯 Validação cross-module

#### RN-027: Referências obrigatórias

-   `User.genderId` aponta para Gender existente.
-   `User.professionId` aponta para Profession existente.
-   `Account.userId` aponta para User existente.
-   Bloquear exclusões quando houver dependências.

#### RN-028: Soft delete

-   Usuários excluídos mantêm flag `deleted`.
-   Contas excluídas ficam INACTIVE.
-   Preservar histórico relacional.

### 📈 Performance

#### RN-029: Índices

-   `User.email` índice único.
-   `Account.userId`, `User.status`, `Account.type` com índices dedicados.

#### RN-030: Paginação

-   Máximo 100 itens por página.
-   Padrão 20 itens.
-   Offset simples para listas pequenas.
-   Cursor para grandes volumes.

### Implementação das regras

-   Domínio: validações fundamentais (value objects, entidades).
-   Aplicação: regras de processo e orquestração.
-   Infraestrutura: integridade e performance (Prisma, DB).
-   Interfaces: validação de entrada (class-validator, DTOs).
-   Monitoramento: testes automatizados, métricas, alertas e revisão mensal.

---

## 3. Padrão de Commits

### Convenção utilizada

-   Seguir a convenção Conventional Commits (https://www.conventionalcommits.org/pt-br/v1.0.0/) em português.
-   Formato: `<tipo>[escopo opcional]: <descrição>`.
-   Tipos aceitos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`, `revert`.

### Exemplos válidos

```
feat(users): adicionar validação de idade mínima
fix(accounts): corrigir cálculo de saldo negativo
docs: atualizar instruções da API
style: padronizar indentação TypeScript
refactor(auth): extrair lógica de token
```

### Diretrizes adicionais

-   Escopos sugeridos: users, accounts, transactions, auth, gender, profession, dashboards, categories, infra, prisma, graphql, tests, docs, build.
-   Corpo do commit explica o "porquê" da mudança quando necessário.
-   Rodapé obrigatório para breaking changes (`BREAKING CHANGE:`) e issues (`Closes issue 123`).
-   Commits pequenos, atômicos e revisados manualmente antes de enviar.

---

## 4. Arquitetura Hexagonal

### Princípios gerais

-   Separar regras de negócio de detalhes técnicos (Ports & Adapters).
-   Fluxo de dependência: `interfaces → application → domain ← infrastructure`.
-   `domain/` nunca possui imports de NestJS, Prisma, bcrypt etc.
-   Ports definem contratos; adapters implementam o contrato com tecnologia específica.

### Estrutura típica de módulo

```
users/
  domain/
    entities/
    value-objects/
    ports/
    services/
    events/
  application/
    use-cases/
    services/
  infrastructure/
    repositories/
    services/
  interfaces/
    graphql/
      resolvers/
      models/
      inputs/
```

### Boas práticas

-   UseCases recebem ports por injeção de dependência.
-   Application Service agrega múltiplos casos de uso e orquestra fluxos.
-   Interfaces expõem apenas DTOs específicos (GraphQL models, inputs, resolvers).
-   Repositórios Prisma convertem entre entidades e schema relacional.
-   Log estruturado em adapters, nunca no domínio.

### Exemplo resumido

```typescript
// domain/ports/user-repository.port.ts
export interface UserRepositoryPort {
  save(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  existsByEmail(email: string): Promise<boolean>
}

// application/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: UserRepositoryPort) {}
  async execute(dto: CreateUserRequest): Promise<CreateUserResponse> {
    if (await this.repo.existsByEmail(dto.email)) throw new UserEmailAlreadyExistsException(dto.email)
    const user = User.create(dto)
    return { user: await this.repo.save(user) }
  }
}

// infrastructure/repositories/user-prisma.repository.ts
@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.upsert({...})
    return User.reconstitute(saved)
  }
}
```

---

## 5. Domain-Driven Design (DDD)

### Conceitos fundamentais

-   Entidade: possui identidade e ciclo de vida (`User`, `Account`).
-   Value Object: imutável e definido por atributos (`Email`, `Password`, `Money`).
-   Agregado: conjunto coeso com raiz (`Account` + `Transaction`).
-   Repositório: abstração para persistir agregados.
-   Serviço de domínio: lógica que não cabe em uma única entidade.
-   Fábrica: criação complexa preservando invariantes.
-   Eventos de domínio: comunicam fatos relevantes (ex.: `UserCreatedEvent`).

### Linguagem ubíqua

-   Termos de negócio presentes em código, testes e documentação.
-   Evite nomes genéricos (`data`, `obj`). Prefira `accountBalance`, `UserStatus` etc.

### Exemplo de agregado

```typescript
export class Account {
  constructor(
    public readonly id: string,
    public name: string,
    public balance: number,
    public readonly userId: string,
  ) {}

  credit(amount: number) {
    if (amount <= 0) throw new Error('Valor invalido')
    this.balance += amount
  }

  debit(amount: number) {
    if (amount <= 0) throw um Error('Valor invalido')
    if (this.balance - amount < 0) throw new Error('Saldo insuficiente')
    this.balance -= amount
  }
}
```

### Recomendações práticas

-   Domínio isolado: sem NestJS, Prisma ou bibliotecas externas.
-   Teste entidades e serviços de domínio com Jest (sem mocks pesados).
-   Value objects concentram validações complexas.
-   Repositórios retornam agregados completos; evite expor entidades internas.
-   Publique eventos para propagar mudanças entre bounded contexts.

---

## 6. API GraphQL: Referência e Exemplos

### Endpoints principais

-   Playground/Endpoint: `POST http://localhost:3000/graphql`.
-   Health check REST: `GET http://localhost:3000/health`.

### Características

-   Schema gerado automaticamente pelos resolvers NestJS.
-   Validação com `class-validator` e pipes globais.
-   Tratamento de erros padronizado (mensagem + code + statusCode).
-   Logging estruturado via `LoggerService`.
-   DataLoader e paginação para evitar N+1.

### Schema resumido

```
type Query {
  hello: String!
  users: [User!]!
  userById(id: String!): User
  userByEmail(email: String!): User
  searchUsers(input: SearchUsersInput!): SearchResult!
  accountsByUser(userId: String!): [Account!]!
  accountById(id: String!): Account
  genders: [Gender!]!
  professions: [Profession!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: String!, input: UpdateUserInput!): User
  deleteUser(id: String!): Boolean!
  createAccount(input: CreateAccountInput!): Account!
}
```

### Queries destacadas

-   `users`: lista todos os usuários com paginação via `searchUsers`.
-   `accountsByUser(userId)` e `accountById` para contas financeiras.
-   `genders` e `professions` para dados auxiliares.

#### Exemplo

```graphql
query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
        items {
            id
            email
            name
            lastname
            role
            status
        }
        total
        currentPage
        totalPages
    }
}
```

### Mutations destacadas

-   `createUser` com validações completas e retorno do usuário persistido.
-   `updateUser` para perfil/senha.
-   `deleteUser` com soft delete.
-   `createAccount` suporta CHECKING, SAVINGS, INVESTMENT, CREDIT_CARD, WALLET.

#### Exemplo

```graphql
mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
        id
        name
        type
        balance
        userId
        createdAt
    }
}
```

### Tratamento de erros

-   Erros de validação retornam mensagens explícitas (ex.: `USER_INVALID_AGE`).
-   Erros de negócio (ex.: email duplicado) usam códigos (`USER_EMAIL_ALREADY_EXISTS`).
-   Falhas inesperadas retornam `INTERNAL_SERVER_ERROR` com log detalhado.

### Testes e automação

-   `npm run test:e2e` cobre resolvers principais.
-   cURL básico:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}' \
  http://localhost:3000/graphql
```

### Exemplos de fluxos completos

1. Obter `genders` e `professions` → criar usuário → criar contas (`CHECKING`, `SAVINGS`, `CREDIT_CARD`) → listar contas por usuário.
2. Atualizar nome e senha do usuário → validar retorno → auditar logs.
3. Paginar resultados: `page`, `limit`, `filter`, `sort`, `sortDirection`.

---

## 7. Coleção Postman: Guia e Workflows

### Estrutura da collection (v2.0.0)

1. Basic: hello world.
2. Authentication: login, refresh, validate token, logout.
3. Users: CRUD completo e buscas.
4. Accounts: criação/consulta, cinco tipos de conta.
5. Gender: listar, buscar e criar.
6. Profession: listar, buscar e criar.
7. Categories: listar, buscar e criar.
8. Complete Workflow Examples: setup, jornada do usuário, visão financeira.

### Variáveis automáticas

```
base_url = http://localhost:3000
graphql_endpoint = {{base_url}}/graphql
access_token, refresh_token, user_id, account_id = gerenciadas por scripts
```

### Scripts de teste

-   Extraem tokens após login e populam variáveis globais.
-   Validam campos obrigatórios nas responses GraphQL.
-   Logam erros no console do Postman para debugging rápido.

### Como usar

1. Importar `backend/postman_collection.json` no Postman.
2. Confirmar `base_url` (ajustar se necessário).
3. Executar Basic → Hello para validar ambiente.
4. Rodar Workflow → Setup: Get Support Data para obter IDs.
5. Autenticar com Authentication → Login (tokens armazenados automaticamente).
6. Seguir os cenários completos (criação de usuário, contas, consultas).

### Troubleshooting frequente

-   Token expirado: execute Refresh Token ou refaça o login.
-   IDs inválidos: rode Get All do módulo correspondente.
-   Erros de validação: confira schema GraphQL e regras de negócio.

---

## 8. Fluxos de Trabalho e Boas Práticas

### Desenvolvimento local

1. `npm install` (ou utilizar Docker Compose).
2. `npm run prisma:generate` para gerar tipos.
3. `npm run db:migrate` + `npm run db:seed` quando houver alterações de schema.
4. `npm run start:dev` para hot reload.
5. `npm run lint` antes de abrir PR.

### Logs e observabilidade

-   Utilizar `LoggerService` com prefixo e contexto por operação.
-   Registrar metadados relevantes (userId, accountId, IP) em operações críticas.
-   Garantir auditoria para autenticação, movimentações financeiras e alterações sensíveis.

### Segurança

-   Validar todos os DTOs com `class-validator` + pipes globais.
-   Sanitizar entradas (trim, lowerCase) antes de persistir.
-   Aplicar guards e policies em resolvers que exigem autenticação.
-   Respeitar limites de requisição definidos nas RN-024 a RN-026.

### Testes

-   Unitários: entidades, value objects, use cases (mocks leves).
-   Integração: repositórios Prisma com banco dockerizado ou testcontainers.
-   E2E: cenários GraphQL cobrindo fluxos principais.
-   Scripts auxiliares em `src/__tests__/` para setup/teardown.

### Deploy e CI recomendados

-   Pipeline: lint → testes unitários → testes de integração → build → deploy.
-   Executar migrations (`prisma migrate deploy`) antes de subir API.
-   Monitorar health check `/health` após deploy.
-   Registrar métricas de performance e logs centralizados.

---

## 9. Análise Técnica e Métricas

### Resumo executivo

-   Collection Postman cobre 100% das queries e mutations atuais.
-   Módulos verificados: Users, Accounts, Authentication, Gender, Profession, Categories, App.
-   Arquitetura validada: NestJS + GraphQL + Prisma, padrão hexagonal + DDD.

### Cobertura da collection (29 requests)

-   Authentication: login, refresh, validate, logout.
-   Users: 7 operações (CRUD + search + lookup).
-   Accounts: 6 operações, incluindo todos os tipos de conta.
-   Gender/Profession/Categories: listar, buscar, criar.
-   Workflows completos (setup inicial, jornada do usuário, overview financeiro).

### Métricas relevantes

-   Tokens gerenciados automaticamente em scripts.
-   Logs de error/response para debugging rápido.
-   Serviços Docker monitorados (API 3000, PostgreSQL 5432, Prisma Studio 5555).
-   Recomendações: adicionar módulo de transações, dashboards, relatórios e notificações.

---

## 10. Contribuição e Expansão

### Como contribuir

1. Leia este manual integralmente antes de iniciar qualquer tarefa.
2. Crie branch seguindo convenção (`feature/`, `fix/`, `chore/` etc.).
3. Desenvolva aplicando arquitetura hexagonal e princípios DDD.
4. Escreva testes adequados (unitários, integração e/ou e2e).
5. Execute lint e suites de teste antes de commitar.
6. Abra PR com descrição clara (contexto, mudanças, passos para testar).

### Atualização da documentação

-   Mantenha `.github/copilot-instructions.md` sincronizado com regras vigentes.
-   Atualize exemplos GraphQL e collection Postman quando a API mudar.
-   Utilize READMEs específicos dos módulos para detalhes aprofundados.

### Roadmap

-   Documentar Ports & Adapters restantes e endpoints REST.
-   Adicionar diagramas de arquitetura (hexagonal + bounded contexts).
-   Criar guia de troubleshooting avançado para produção.
-   Automatizar changelog com base nos commits convencionais.

### Suporte

-   Dúvidas técnicas: contatar equipe SmartEconomy.
-   Problemas: abrir issue com reprodução detalhada.
-   Sugestões: usar discussões ou PRs bem descritos.

---

**Última atualização consolidada:** Outubro 2025 · Equipe SmartEconomy

---

Evaluating User Goals
Essa é uma visão poderosa e estratégica. Você está descrevendo essencialmente o modelo que projetos como Signal, Bitwarden ou Mastodon utilizam: um serviço centralizado confiável para as massas, mas com o código aberto para garantir transparência e permitir a descentralização.

Para que essa sua "cosmovisão" se concretize e o SmartEconomy sobreviva como um SaaS gratuito sem quebrar sua conta bancária, você precisa tomar decisões arquiteturais e legais agora.

Aqui está o plano de batalha técnico e estratégico para viabilizar isso:

1. A Licença: O Escudo Jurídico (AGPLv3)
   Se o objetivo é "dificultar o cenário capitalista", você não pode usar licenças permissivas como MIT ou Apache.

O Risco: Um banco digital pega seu código MIT, muda a cor, integra no app deles, fecha o código e vende como "Gestão Financeira Premium".
A Solução: Adote a GNU AGPLv3.
Ela exige que qualquer um que ofereça seu software como serviço (SaaS) tenha que disponibilizar o código fonte modificado.
Isso "envenena" o poço para empresas que querem apenas extrair valor sem contribuir, garantindo que o software permaneça livre. 2. Sobrevivência do SaaS Gratuito (Engenharia de Custos)
Para oferecer o SaaS oficial gratuitamente para milhares de pessoas, seu custo por usuário deve tender a zero. Sua arquitetura atual (NestJS + Prisma) é boa, mas precisa de ajustes para ser "multi-tenant" eficiente.

Multi-tenancy Lógico (Obrigatório): Não suba um banco de dados para cada usuário. Use um único banco Postgres com uma coluna userId (ou tenantId) em todas as tabelas (o que você já está fazendo com userId).
Limites Rígidos (Hard Limits): Para evitar abuso, defina quotas no nível da aplicação (ex: máximo de 5.000 transações por conta, 50MB de anexos).
Armazenamento Frio: Transações de 5 anos atrás não precisam estar na memória RAM do banco. Crie rotinas para arquivar dados antigos em armazenamento barato (S3/R2) se o banco crescer demais. 3. Facilitando a "Revolução" (Developer Experience)
Para que ONGs, coletivos e comunidades criem suas próprias versões, o processo de deploy deve ser trivial. Ninguém vai "forkar" se precisar de 3 dias para configurar.

O "One-Click Deploy": Mantenha seu docker-compose.yml impecável. O objetivo é que alguém com um servidor de R$ 30,00 possa rodar:
E ter o sistema rodando com SSL automático (Caddy/Traefik).
Documentação de "Soberania": Crie um guia específico no README: "Como hospedar o SmartEconomy para sua comunidade local". 4. O Diferencial "Anti-Capitalista" no Produto
O que fará as pessoas escolherem o SmartEconomy e não o app do banco (que já categoriza tudo automático)?

Privacidade Radical: Deixe claro na UI: "Seus dados não saem daqui. Não vendemos para seguradoras. Não oferecemos empréstimos."
Importação Universal: Como você não vai pagar APIs caras de Open Finance (que custam por usuário), invista pesado em importadores de OFX/CSV e leitores de notificação de celular (no app mobile). Isso dá o poder ao usuário, não à API do banco.
Sem "Nudges": Apps de banco são desenhados para fazer você gastar (notificações de crédito, loja, etc). O SmartEconomy deve ser desenhado para a paz financeira. Interface limpa, silenciosa.
Próximos Passos Práticos no Código
Olhando para o seu repositório atual, você está no caminho certo. Para preparar o terreno para esse futuro:

Auditoria de Licença: Adicione um arquivo LICENSE (AGPLv3) na raiz agora.
Configuração de Deploy: Certifique-se de que as variáveis de ambiente no docker-compose.yml permitam configurar domínios e segredos facilmente.
Feature Flagging: Considere implementar um sistema simples de feature flags. Isso permite que você, no SaaS oficial, desabilite funcionalidades pesadas se o servidor estiver sobrecarregado,
sem precisar mudar o código.

Você tem a faca e o queijo na mão. A tecnologia você já domina (o código está excelente). O desafio agora é a resiliência da infraestrutura para aguentar o público.

Analyzing Licensing Strategy...
Aqui está a análise crítica solicitada, focada na sua visão de "SaaS Gratuito + Open Source Anti-Capitalista".

1. Licença: O "Buraco" do SaaS (Crítico)
   Estado Atual: Você está usando a GNU GPLv3.
   Veredito: ⚠️ Inadequada para seu objetivo.

A GPLv3 protege a distribuição do software (binários/instaladores). Se um banco pegar seu código, modificar e vender o software para instalar, eles precisam abrir o código.
PORÉM, se eles pegarem seu código, rodarem num servidor deles e venderem apenas o acesso (SaaS/Site), a GPLv3 não os obriga a liberar o código fonte. Isso é conhecido como o "SaaS Loophole" (Brecha do SaaS).

Ação Necessária:
Você precisa migrar para a GNU AGPLv3 (Affero GPL).
A AGPLv3 fecha essa brecha: se o software interage com usuários via rede (SaaS), o código fonte modificado deve ser disponibilizado para esses usuários. É a única licença que garante sua visão "anti-capitalista" para serviços web.

2. Configuração de Deploy: Ambiente de Dev vs. Prod
   Estado Atual: Seu docker-compose.yml e Dockerfile são excelentes para desenvolvimento, mas perigosos para um SaaS público.
   Veredito: ⚠️ Não está pronto para produção/SaaS.

Performance: O Dockerfile roda npm install e npm run start. Em produção, você deve usar npm ci (instalação limpa e rápida) e rodar o código compilado (node dist/main), não o modo dev do NestJS.
Segurança:
O banco de dados (db) está expondo a porta 5432 para a internet (ports: - '5432:5432'). Num SaaS, o banco deve estar isolado na rede interna do Docker, acessível apenas pelo backend.
O container roda como root (padrão). Se houver uma falha no Node.js, um atacante pode ter acesso root ao container.
SSL/HTTPS: Não há um proxy reverso (Nginx/Caddy/Traefik). Você não pode oferecer um SaaS financeiro sem HTTPS.
Ação Necessária:

Criar um docker-compose.prod.yml que não expõe portas do banco.
Adicionar um serviço de Caddy ou Traefik para gerenciar certificados SSL automaticamente (essencial para o "one-click deploy" da comunidade).
Ajustar o Dockerfile para "Multi-stage build" (compilar em um estágio, rodar apenas o JS final no outro), reduzindo o tamanho da imagem e melhorando performance. 3. Feature Flagging: Inexistente
Estado Atual: Não encontrei menção a feature flags no código (grep retornou vazio).
Veredito: ❌ Ausente.

Para um SaaS gratuito mantido por uma pessoa, isso é vital para sobrevivência.

Cenário: Seu servidor viraliza e a CPU vai a 100%.
Sem Flags: O servidor cai. Todos ficam sem acesso. Você corre para fazer deploy de um hotfix.
Com Flags: Você muda uma variável de ambiente ENABLE_HEAVY_REPORTS=false e o sistema desativa temporariamente os relatórios pesados, mantendo o resto funcionando.
Ação Necessária:
Implementar um serviço simples de FeatureFlagService que lê de variáveis de ambiente (.env) ou de uma tabela simples no banco (para mudar em tempo real sem reiniciar).

Resumo do Plano de Ação Imediato
Jurídico: Substituir o texto da LICENSE.md pela AGPLv3.
Infra: Criar docker-compose.prod.yml
com Caddy (HTTPS) e banco isolado. 3. **Código:** Criar umFeatureFlagServicesimples noSharedModule`.

Quer que eu comece pela troca da licença ou pela configuração do Docker de produção?
