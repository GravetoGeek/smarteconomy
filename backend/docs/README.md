# 📚 Documentação SmartEconomy Backend

> **Documentação Completa e Organizada do Sistema**

## 📋 **Índice da Documentação**

### 🏗️ **Arquitetura e Padrões**

- **[🏗️ Arquitetura Hexagonal](architecture/hexagonal.md)** - Implementação da arquitetura hexagonal (Ports & Adapters)
- **[🎯 Domain-Driven Design](architecture/ddd.md)** - Estratégias e táticas DDD implementadas
- **[🔌 Ports & Adapters](architecture/ports-adapters.md)** - Contratos e implementações (em desenvolvimento)

### 📊 **APIs e Interfaces**

- **[📊 API GraphQL](api/graphql.md)** - Documentação completa da API GraphQL
- **[🚀 API Endpoints](api/endpoints.md)** - Endpoints disponíveis (em desenvolvimento)
- **[📝 Exemplos de Uso](api/examples.md)** - Exemplos práticos (em desenvolvimento)

### 🔧 **Módulos e Funcionalidades**

- **[👥 Módulo Users](../../src/users/README.md)** - Módulo de usuários com arquitetura hexagonal
- **[� Módulo Accounts](../../src/accounts/README.md)** - Módulo de contas financeiras com DDD
- **[�🔧 Guia de Adapters](../../src/users/infrastructure/adapters/README.md)** - Como estender e adicionar novos adapters
- **[📋 Guia Postman](../../GUIA_POSTMAN.md)** - Guia completo para testar a API

### 🚀 **Desenvolvimento e Deploy**

- **[🐳 Docker](deployment/docker.md)** - Configuração e uso do Docker (em desenvolvimento)
- **[🧪 Testes](testing/overview.md)** - Estratégias de teste (em desenvolvimento)
- **[🔒 Segurança](security/overview.md)** - Implementações de segurança (em desenvolvimento)

### 📈 **Monitoramento e Operações**

- **[📊 Logs](monitoring/logs.md)** - Estratégias de logging (em desenvolvimento)
- **[📈 Métricas](monitoring/metrics.md)** - Monitoramento de performance (em desenvolvimento)
- **[🔍 Troubleshooting](operations/troubleshooting.md)** - Solução de problemas (em desenvolvimento)

## 🎯 **Como Usar Esta Documentação**

### **Para Desenvolvedores**

1. **Comece pela [Arquitetura Hexagonal](architecture/hexagonal.md)** para entender os princípios
2. **Leia o [Domain-Driven Design](architecture/ddd.md)** para compreender as estratégias
3. **Explore a [API GraphQL](api/graphql.md)** para usar a API
4. **Consulte o [Módulo Users](../../src/users/README.md)** como referência de implementação
5. **Veja o [Módulo Accounts](../../src/accounts/README.md)** para gestão financeira

### **Para DevOps**

1. **Configure o ambiente** com [Docker](deployment/docker.md)
2. **Monitore a aplicação** com as ferramentas de [monitoramento](monitoring/overview.md)
3. **Resolva problemas** com o [troubleshooting](operations/troubleshooting.md)

### **Para QA/Testes**

1. **Use o [Guia Postman](../../GUIA_POSTMAN.md)** para testes manuais
2. **Implemente testes automatizados** seguindo as [estratégias de teste](testing/overview.md)
3. **Valide a API** com os [exemplos GraphQL](api/graphql.md)

## 🚀 **Quick Start**

### **1. Configuração Rápida**

```bash
# Clone o repositório
git clone <repository-url>
cd smarteconomy/backend

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie com Docker
docker-compose up -d
```

### **2. Acesse a Aplicação**

- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: http://localhost:5555

### **3. Teste a API**

```bash
# Teste as queries GraphQL
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"query { users { id name email } }"}'

# Teste as mutations
curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -d '{"query":"mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name } }","variables":{"input":{"email":"test@example.com","name":"Test","lastname":"User","birthdate":"1990-01-01","role":"USER","genderId":"gender-id","professionId":"profession-id","password":"password123"}}}'
```

## 📖 **Documentação por Nível de Experiência**

### **🟢 Iniciante**

- **[README Principal](../../README.md)** - Visão geral do projeto
- **[Guia Postman](../../GUIA_POSTMAN.md)** - Como testar a API
- **[Quick Start](architecture/hexagonal.md#-quick-start)** - Primeiros passos

### **🟡 Intermediário**

- **[Arquitetura Hexagonal](architecture/hexagonal.md)** - Princípios e implementação
- **[API GraphQL](api/graphql.md)** - Como usar a API
- **[Módulo Users](../../src/users/README.md)** - Exemplo de implementação

### **🔴 Avançado**

- **[Domain-Driven Design](architecture/ddd.md)** - Estratégias e táticas
- **[Guia de Adapters](../../src/users/infrastructure/adapters/README.md)** - Como estender o sistema
- **[Implementação de Testes](testing/overview.md)** - Estratégias avançadas

## 🔍 **Busca na Documentação**

### **Por Funcionalidade**

- **Usuários**: [Módulo Users](../../src/users/README.md), [API GraphQL](api/graphql.md)
- **Contas Financeiras**: [Módulo Accounts](../../src/accounts/README.md), [API GraphQL](api/graphql.md)
- **Autenticação**: [Segurança](security/overview.md), [API GraphQL](api/graphql.md#-autenticação)
- **Banco de Dados**: [Arquitetura Hexagonal](architecture/hexagonal.md), [DDD](architecture/ddd.md)

### **Por Tecnologia**

- **NestJS**: [Arquitetura Hexagonal](architecture/hexagonal.md), [API GraphQL](api/graphql.md)
- **GraphQL**: [API GraphQL](api/graphql.md), [Módulo Users](../../src/users/README.md)
- **Prisma**: [Arquitetura Hexagonal](architecture/hexagonal.md), [DDD](architecture/ddd.md)

### **Por Padrão**

- **Arquitetura Hexagonal**: [Arquitetura Hexagonal](architecture/hexagonal.md)
- **DDD**: [Domain-Driven Design](architecture/ddd.md)
- **Clean Architecture**: [Arquitetura Hexagonal](architecture/hexagonal.md)

## 📝 **Contribuindo com a Documentação**

### **Como Adicionar Nova Documentação**

1. **Crie o arquivo** na pasta apropriada
2. **Siga o padrão** de formatação existente
3. **Atualize este índice** com o novo link
4. **Mantenha consistência** com o estilo existente

### **Padrões de Formatação**

- **Use emojis** para categorização visual
- **Mantenha índices** organizados
- **Inclua exemplos práticos** sempre que possível
- **Link para outras documentações** relacionadas

### **Estrutura Recomendada**

```markdown
# 🎯 Título da Documentação

> **Descrição breve**

## 📋 **Índice**

## 🎯 **Visão Geral**

## 🚀 **Implementação**

## 📚 **Exemplos**

## 🎯 **Conclusão**
```

## 🔗 **Links Úteis**

### **Documentação Externa**

- **[NestJS Documentation](https://docs.nestjs.com/)** - Framework principal
- **[Prisma Documentation](https://www.prisma.io/docs/)** - ORM do banco de dados
- **[GraphQL Documentation](https://graphql.org/learn/)** - Query language
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - Servidor GraphQL

### **Ferramentas**

- **[GraphQL Playground](http://localhost:3000/graphql)** - Teste da API
- **[Prisma Studio](http://localhost:5555)** - Gerenciamento do banco
- **[Postman Collection](../../postman_collection.json)** - Testes da API

## 📊 **Status da Documentação**

| Área | Status | Completude |
|------|--------|------------|
| **Arquitetura Hexagonal** | ✅ Completo | 100% |
| **Domain-Driven Design** | ✅ Completo | 100% |
| **API GraphQL** | ✅ Completo | 100% |
| **Módulo Users** | ✅ Completo | 100% |
| **Módulo Accounts** | ✅ Completo | 100% |
| **Guia Postman** | ✅ Completo | 100% |
| **Ports & Adapters** | 🔄 Em Desenvolvimento | 30% |
| **API Endpoints** | 🔄 Em Desenvolvimento | 20% |
| **Docker** | 🔄 Em Desenvolvimento | 40% |
| **Testes** | 🔄 Em Desenvolvimento | 25% |
| **Segurança** | 🔄 Em Desenvolvimento | 15% |

## 🎯 **Próximos Passos**

### **Documentação Prioritária**

1. **[🔌 Ports & Adapters](architecture/ports-adapters.md)** - Completar guia de extensão
2. **[🚀 API Endpoints](api/endpoints.md)** - Documentar todos os endpoints
3. **[🐳 Docker](deployment/docker.md)** - Guia completo de deploy
4. **[🧪 Testes](testing/overview.md)** - Estratégias de teste

### **Melhorias Planejadas**

- **Diagramas visuais** para arquitetura
- **Vídeos tutoriais** para funcionalidades complexas
- **Exemplos interativos** com playground
- **Guia de troubleshooting** detalhado

## 🤝 **Suporte e Contribuição**

### **Como Obter Ajuda**

- **📖 Documentação**: Esta é sua primeira fonte
- **🔍 Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussões**: [GitHub Discussions](https://github.com/your-repo/discussions)

### **Como Contribuir**

1. **Leia a documentação** existente
2. **Identifique gaps** ou melhorias
3. **Crie um issue** ou pull request
4. **Siga os padrões** estabelecidos

---

**📚 Esta documentação é mantida pela equipe SmartEconomy**

*Última atualização: Janeiro 2025*
