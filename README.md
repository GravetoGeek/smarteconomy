# 🚀 SmartEconomy - Sistema de Gestão Financeira Pessoal

![Badge Backend](https://img.shields.io/badge/Backend-NestJS%2011-red?style=flat&logo=nestjs)
![Badge Frontend](https://img.shields.io/badge/Frontend-React%20Native-blue?style=flat&logo=react)
![Badge Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat&logo=postgresql)
![Badge GraphQL](https://img.shields.io/badge/API-GraphQL-pink?style=flat&logo=graphql)
![Badge Docker](https://img.shields.io/badge/Container-Docker-blue?style=flat&logo=docker)
![Problemas](https://img.shields.io/github/issues/GravetoGeek/smarteconomy)
![Forks](https://img.shields.io/github/forks/GravetoGeek/smarteconomy)
![Stars](https://img.shields.io/github/stars/GravetoGeek/smarteconomy)

> **Sistema completo de gestão financeira pessoal com arquitetura moderna e escalável**

## 🎯 **Visão Geral**

O **SmartEconomy** é uma plataforma completa para gestão de finanças pessoais, desenvolvido como **Trabalho de Conclusão de Curso**. O sistema oferece uma solução robusta e moderna para controle financeiro pessoal com foco na experiência do usuário e na qualidade do código.

### **🏗️ Arquitetura do Projeto**

```
smarteconomy/
├── 📁 backend/          # API NestJS com GraphQL
│   ├── 🏛️ Arquitetura Hexagonal
│   ├── 🎯 Domain-Driven Design (DDD)
│   ├── 📊 GraphQL + Prisma ORM
│   ├── 🐳 Docker + PostgreSQL
│   └── 🧪 Testes (Unit/Integration/E2E)
├── 📁 frontend/         # App React Native com Expo
│   ├── 📱 Interface Mobile Moderna
│   ├── 🎨 Design System Consistente
│   ├── 🔄 Context API + AsyncStorage
│   └── 🌐 Integração GraphQL
└── 📁 docs/            # Documentação Completa
```

### **✨ Principais Características**

#### **Backend (NestJS)**
- ✅ **Arquitetura Hexagonal** com separação clara de responsabilidades
- ✅ **Domain-Driven Design** com entidades ricas e regras de negócio
- ✅ **GraphQL API** com schema auto-gerado e validação robusta
- ✅ **PostgreSQL + Prisma** para persistência de dados
- ✅ **Autenticação JWT** com autorização baseada em roles
- ✅ **Docker** para ambiente de desenvolvimento e produção
- ✅ **Testes automatizados** (unitários, integração e E2E)
- ✅ **Logging estruturado** para auditoria e monitoramento

#### **Frontend (React Native)**
- ✅ **React Native + Expo** para desenvolvimento cross-platform
- ✅ **Interface moderna** e intuitiva
- ✅ **Navegação fluida** com React Navigation
- ✅ **Gerenciamento de estado** com Context API
- ✅ **Persistência local** com AsyncStorage
- ✅ **Integração GraphQL** para comunicação com API

### **💰 Módulos Implementados**

#### **👥 Gestão de Usuários**
- Cadastro e autenticação de usuários
- Perfis personalizados com gênero e profissão
- Busca avançada com filtros e paginação
- Operações CRUD completas

#### **💳 Gestão de Contas Financeiras** *(Novo!)*
- Múltiplos tipos de conta (Corrente, Poupança, Investimento, Cartão de Crédito, Carteira)
- Controle de saldos com validações de negócio
- Operações de crédito e débito
- Histórico completo de movimentações

#### **🏷️ Categorias e Classificações**
- Gêneros para perfil de usuário
- Profissões para segmentação
- Categorias para organização financeira

#### **🔐 Autenticação e Autorização**
- Sistema JWT robusto
- Controle de acesso baseado em roles
- Segurança de endpoints GraphQL

## 🚀 **Quick Start**

### **Pré-requisitos**
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) (para emulador Android)

### **1. Clone o Repositório**
```bash
git clone https://github.com/GravetoGeek/smarteconomy.git
cd smarteconomy
```

### **2. Configure e Inicie o Backend**
```bash
cd backend

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie todos os serviços com Docker
docker-compose up -d

# Verifique se os serviços estão rodando
docker-compose ps
```

**Serviços disponíveis:**
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

### **3. Configure e Inicie o Frontend**
```bash
cd ../frontend

# Instale as dependências
npm install

# Inicie o aplicativo
npm start

# Escaneie o QR Code com o app Expo Go ou use um emulador
```

## 📚 **Documentação Completa**

### **Backend**
- **[📖 README Backend](backend/README.md)** - Documentação completa da API
- **[🏗️ Arquitetura Hexagonal](backend/docs/architecture/hexagonal.md)** - Princípios e implementação
- **[🎯 Domain-Driven Design](backend/docs/architecture/ddd.md)** - Estratégias e táticas
- **[📊 API GraphQL](backend/docs/api/graphql.md)** - Schema e exemplos
- **[📝 Exemplos Práticos](backend/docs/api/examples.md)** - Casos de uso reais
- **[💰 Módulo Accounts](backend/src/accounts/README.md)** - Gestão de contas financeiras

### **Frontend**
- **[📱 README Frontend](frontend/README.md)** - Documentação do app mobile
- **[🎨 Design System](frontend/docs/design-system.md)** - Componentes e estilos
- **[🔄 Estado Global](frontend/docs/state-management.md)** - Context API e AsyncStorage

## 🧪 **Testando a API**

### **GraphQL Playground**
1. Acesse: http://localhost:3000/graphql
2. Explore o schema na aba "DOCS"
3. Teste as queries e mutations

### **Exemplos de Uso**

#### **Criar Usuário**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    lastname
    role
    createdAt
  }
}
```

#### **Criar Conta Financeira**
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

#### **Buscar Contas do Usuário**
```graphql
query AccountsByUser($userId: String!) {
  accountsByUser(userId: $userId) {
    id
    name
    type
    balance
    createdAt
  }
}
```

## 🛠️ **Tecnologias Utilizadas**

### **Backend**
- **[NestJS 11](https://nestjs.com/)** - Framework Node.js escalável
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem tipada
- **[GraphQL](https://graphql.org/)** - Query language para APIs
- **[Prisma](https://www.prisma.io/)** - ORM moderno
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Docker](https://www.docker.com/)** - Containerização
- **[Jest](https://jestjs.io/)** - Framework de testes

### **Frontend**
- **[React Native](https://reactnative.dev/)** - Framework mobile
- **[Expo](https://expo.dev/)** - Plataforma de desenvolvimento
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem tipada
- **[React Navigation](https://reactnavigation.org/)** - Navegação
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - Cliente GraphQL

## 📊 **Status do Projeto**

### **✅ Implementado**
- [x] Arquitetura hexagonal completa
- [x] Módulo de usuários com CRUD
- [x] Módulo de contas financeiras
- [x] Autenticação JWT
- [x] API GraphQL funcional
- [x] Testes unitários e integração
- [x] Docker para desenvolvimento
- [x] Frontend React Native básico
- [x] Documentação completa

### **🔄 Em Desenvolvimento**
- [ ] Módulo de transações financeiras
- [ ] Dashboard com gráficos
- [ ] Relatórios financeiros
- [ ] Notificações push
- [ ] Testes E2E completos

### **📋 Planejado**
- [ ] Módulo de metas financeiras
- [ ] Integração com bancos
- [ ] Análise de gastos com IA
- [ ] App web (React)
- [ ] Deploy em produção

## 🤝 **Como Contribuir**

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m '✨ feat: Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Commit**
Seguimos a [Convenção de Commits](backend/docs/COMMIT_CONVENTION.md) com emojis em português:

- `✨ feat: nova funcionalidade`
- `🐛 fix: correção de bug`
- `📚 docs: atualização de documentação`
- `🎨 style: formatação de código`
- `♻️ refactor: refatoração`
- `🧪 test: adição/correção de testes`

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## 👥 **Equipe**

- **[GravetoGeek](https://github.com/GravetoGeek)** - Desenvolvedor Principal

## 🆘 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/GravetoGeek/smarteconomy/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/GravetoGeek/smarteconomy/wiki)

---

**🚀 Desenvolvido com ❤️ para o futuro das finanças pessoais**

*Última atualização: Agosto 2025*

