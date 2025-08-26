# Guia da Collection Postman - SmartEconomy API

## 📋 Visão Geral

Esta collection Postman foi desenvolvida para oferecer uma cobertura completa da API GraphQL do SmartEconomy, incluindo todos os módulos implementados e fluxos de trabalho essenciais.

## 🏗️ Estrutura da Collection

### 1. 🎯 Basic
- **Hello World**: Teste básico de conectividade

### 2. 🔐 Authentication
- **Login**: Autenticação de usuário com obtenção de tokens
- **Refresh Token**: Renovação automática de tokens
- **Validate Token**: Validação de tokens de acesso
- **Logout**: Encerramento de sessão

### 3. 👥 Users
- **Get All Users**: Lista todos os usuários
- **Get User by ID**: Busca usuário específico
- **Get User by Email**: Busca por email
- **Search Users**: Busca avançada com filtros
- **Create User**: Criação de novos usuários
- **Update User**: Atualização de dados
- **Delete User**: Remoção de usuários

### 4. 💰 Accounts
- **Get Accounts by User**: Lista contas do usuário
- **Get Account by ID**: Busca conta específica
- **Create Checking Account**: Conta corrente
- **Create Savings Account**: Conta poupança
- **Create Investment Account**: Conta de investimentos
- **Create Credit Card**: Cartão de crédito
- **Create Wallet**: Carteira digital

### 5. 🏷️ Gender
- **Get All Genders**: Lista todos os gêneros
- **Get Gender by ID**: Busca gênero específico
- **Create Gender**: Criação de novos gêneros

### 6. 💼 Profession
- **Get All Professions**: Lista todas as profissões
- **Get Profession by ID**: Busca profissão específica
- **Create Profession**: Criação de novas profissões

### 7. 📂 Categories
- **Get All Categories**: Lista todas as categorias
- **Get Category by ID**: Busca categoria específica
- **Create Category**: Criação de novas categorias

### 8. 🎯 Complete Workflow Examples
- **Setup: Get Support Data**: Obter dados de apoio
- **Complete User Journey**: Dados completos do usuário
- **Financial Overview**: Visão geral financeira

## 🔧 Funcionalidades Avançadas

### Variáveis Automáticas
A collection gerencia automaticamente as seguintes variáveis:

```javascript
- base_url: URL base da API
- graphql_endpoint: Endpoint GraphQL
- access_token: Token de acesso (auto-gerenciado)
- refresh_token: Token de renovação (auto-gerenciado)
- user_id: ID do usuário (auto-gerenciado)
- account_id: ID da conta (auto-gerenciado)
```

### Scripts de Teste Automáticos
- **Extração automática de tokens** após login
- **Validação de responses** GraphQL
- **Logging de erros** para debugging
- **Gerenciamento de variáveis** entre requests

## 🚀 Como Usar

### 1. Configuração Inicial
1. Importe a collection no Postman
2. Verifique se `base_url` está correto (padrão: http://localhost:3000)
3. Execute "Hello World" para testar conectividade

### 2. Fluxo de Autenticação
1. Execute "Setup: Get Support Data" para obter IDs necessários
2. Execute "Login" com credenciais válidas
3. Os tokens serão automaticamente salvos para uso posterior

### 3. Testando Módulos
1. **Users**: Execute as operações de usuário
2. **Accounts**: Teste criação de diferentes tipos de conta
3. **Support Data**: Teste gêneros, profissões e categorias

### 4. Workflows Completos
Use os exemplos de workflow para testar cenários reais:
- Jornada completa do usuário
- Visão geral financeira
- Configuração de dados de apoio

## 📊 Estatísticas da Collection

- **Total de Operações**: 29
- **Módulos Cobertos**: 7
- **Tipos de Conta**: 5 (Corrente, Poupança, Investimento, Cartão, Carteira)
- **Fluxos de Autenticação**: 4
- **Exemplos de Workflow**: 3

## 🔍 Troubleshooting

### Problemas Comuns

1. **Token Expirado**
   - Execute "Refresh Token" ou faça novo login

2. **IDs Inválidos**
   - Execute "Get All [Módulo]" para obter IDs válidos
   - Verifique as variáveis da collection

3. **Erros de Validação**
   - Verifique os dados obrigatórios no schema
   - Consulte a documentação da API

### Logs e Debugging
- Verifique o console do Postman para logs detalhados
- Erros GraphQL são automaticamente logados
- Use os scripts de teste para debugging

## 📚 Recursos Adicionais

- **Schema GraphQL**: `/graphql` (modo introspection)
- **Documentação da API**: `docs/api/`
- **Exemplos de Uso**: `docs/api/examples.md`

## 🔄 Atualizações

Esta collection é mantida sincronizada com:
- Novas operações GraphQL
- Mudanças no schema
- Novos módulos implementados
- Melhorias nos fluxos de teste

---

**Versão**: 2.0.0
**Última Atualização**: Janeiro 2024
**Módulos**: Authentication, Users, Accounts, Gender, Profession, Categories
**Compatibilidade**: NestJS 11 + GraphQL + Prisma 5
