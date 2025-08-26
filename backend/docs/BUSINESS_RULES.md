# 📋 **Regras de Negócio - SmartEconomy**

## 🎯 **Visão Geral**

Este documento define as regras de negócio fundamentais do sistema SmartEconomy, garantindo consistência e integridade dos dados e processos.

---

## 👤 **Módulo de Usuários**

### **Regras de Criação de Usuário**

#### **RN-001: Validação de Email**
- ✅ **Email deve ser único** no sistema
- ✅ **Formato válido** de email obrigatório
- ✅ **Domínios bloqueados**: Não permitir emails temporários (10minutemail, etc.)
- ✅ **Verificação de email** obrigatória para ativação

#### **RN-002: Validação de Senha**
- ✅ **Mínimo 8 caracteres**
- ✅ **Pelo menos 1 número** obrigatório
- ✅ **Pelo menos 1 letra maiúscula**
- ✅ **Pelo menos 1 caractere especial**
- ✅ **Hash bcrypt com 12 salt rounds**
- ❌ **Não permitir senhas comuns** (123456, password, etc.)

#### **RN-003: Validação de Idade**
- ✅ **Idade mínima: 13 anos** (COPPA compliance)
- ✅ **Idade máxima: 120 anos** (validação de sanidade)
- ✅ **Data de nascimento futura**: Não permitida

#### **RN-004: Validação de Nome**
- ✅ **Nome mínimo: 2 caracteres**
- ✅ **Nome máximo: 50 caracteres**
- ✅ **Sobrenome mínimo: 2 caracteres**
- ✅ **Sobrenome máximo: 50 caracteres**
- ✅ **Caracteres especiais**: Apenas acentos e hífens
- ✅ **Trim automático** de espaços

### **Regras de Status de Usuário**

#### **RN-005: Estados Válidos**
- ✅ **ACTIVE**: Usuário pode fazer login e usar o sistema
- ✅ **INACTIVE**: Usuário temporariamente desabilitado
- ✅ **SUSPENDED**: Usuário suspenso por violação de termos

#### **RN-006: Transições de Status**
- ✅ **ACTIVE → INACTIVE**: Permitido (desativação)
- ✅ **ACTIVE → SUSPENDED**: Permitido (suspensão)
- ✅ **INACTIVE → ACTIVE**: Permitido (reativação)
- ✅ **SUSPENDED → ACTIVE**: Apenas admins podem fazer
- ❌ **SUSPENDED → INACTIVE**: Não permitido

### **Regras de Papéis (Roles)**

#### **RN-007: Papéis Disponíveis**
- ✅ **USER**: Papel padrão para novos usuários
- ✅ **ADMIN**: Papel com permissões administrativas

#### **RN-008: Promoção/Demoção**
- ✅ **Apenas ADMIN** pode promover USER para ADMIN
- ✅ **Apenas ADMIN** pode demover ADMIN para USER
- ❌ **Não é possível** remover todos os ADMINs do sistema

---

## 💰 **Módulo de Contas Financeiras**

### **Regras de Criação de Conta**

#### **RN-009: Validação de Nome da Conta**
- ✅ **Nome mínimo: 3 caracteres**
- ✅ **Nome máximo: 100 caracteres**
- ✅ **Nome único** por usuário
- ✅ **Caracteres permitidos**: Letras, números, espaços, hífens

#### **RN-010: Tipos de Conta Válidos**
- ✅ **CHECKING**: Conta corrente
- ✅ **SAVINGS**: Conta poupança
- ✅ **CREDIT_CARD**: Cartão de crédito
- ✅ **INVESTMENT**: Conta de investimentos
- ✅ **CASH**: Dinheiro em espécie

#### **RN-011: Validação de Saldo**
- ✅ **Saldo inicial**: Pode ser 0 ou positivo
- ✅ **Saldo negativo**: Permitido apenas para CREDIT_CARD
- ✅ **Precisão decimal**: Máximo 2 casas decimais
- ✅ **Valor máximo**: R$ 999.999.999,99

### **Regras de Operações Financeiras**

#### **RN-012: Operações de Crédito**
- ✅ **Valor mínimo**: R$ 0,01
- ✅ **Valor máximo**: R$ 999.999,99 por operação
- ✅ **Atualizar updatedAt** automaticamente
- ✅ **Log de auditoria** obrigatório

#### **RN-013: Operações de Débito**
- ✅ **Verificar saldo suficiente** (exceto CREDIT_CARD)
- ✅ **Valor mínimo**: R$ 0,01
- ✅ **Cartão de crédito**: Permitir saldo negativo até limite
- ❌ **Não permitir** débito que resulte em saldo < -limite

#### **RN-014: Status de Conta**
- ✅ **ACTIVE**: Permite todas as operações
- ✅ **INACTIVE**: Apenas consultas permitidas
- ❌ **Contas INACTIVE**: Não podem receber/enviar dinheiro

---

## 🔐 **Módulo de Autenticação**

### **Regras de Login**

#### **RN-015: Tentativas de Login**
- ✅ **Máximo 5 tentativas** por email em 15 minutos
- ✅ **Bloqueio temporário** de 15 minutos após limite
- ✅ **Log de tentativas** obrigatório
- ✅ **Notificação por email** em tentativas suspeitas

#### **RN-016: Validação de Credenciais**
- ✅ **Email e senha** obrigatórios
- ✅ **Usuário deve estar ACTIVE** para fazer login
- ❌ **SUSPENDED ou INACTIVE**: Login negado
- ✅ **Verificação de email** deve estar confirmada

### **Regras de JWT Token**

#### **RN-017: Geração de Token**
- ✅ **Expiração padrão**: 24 horas
- ✅ **Refresh token**: 30 dias
- ✅ **Algoritmo**: HS256
- ✅ **Claims obrigatórias**: userId, email, role

#### **RN-018: Validação de Token**
- ✅ **Verificar assinatura** obrigatório
- ✅ **Verificar expiração** obrigatório
- ✅ **Verificar se usuário ainda existe** e está ativo
- ❌ **Tokens inválidos**: Retornar 401 Unauthorized

### **Regras de Logout**

#### **RN-019: Logout Seguro**
- ✅ **Invalidar refresh token** no banco
- ✅ **Log de logout** obrigatório
- ✅ **Limpar contexto** de autenticação

---

## 👤 **Módulo de Gênero**

### **Regras de Gênero**

#### **RN-020: Gêneros Suportados**
- ✅ **Masculino**
- ✅ **Feminino**
- ✅ **Não-binário**
- ✅ **Prefiro não informar**
- ✅ **Agênero**
- ✅ **Outros** (campo livre)

#### **RN-021: Validação de Gênero**
- ✅ **Obrigatório** na criação de usuário
- ✅ **Pode ser alterado** pelo usuário
- ✅ **Gênero único** no sistema (não duplicar)

---

## 💼 **Módulo de Profissão**

### **Regras de Profissão**

#### **RN-022: Validação de Profissão**
- ✅ **Nome mínimo**: 3 caracteres
- ✅ **Nome máximo**: 100 caracteres
- ✅ **Profissão única** no sistema
- ✅ **Compatível com CBO** quando possível

#### **RN-023: Criação de Profissão**
- ✅ **Apenas ADMIN** pode criar novas profissões
- ✅ **Validar se já existe** antes de criar
- ✅ **Normalizar nome** (trim, case-insensitive)

---

## 🔒 **Regras de Segurança Geral**

### **Proteção de Dados**

#### **RN-024: LGPD Compliance**
- ✅ **Consentimento explícito** para coleta de dados
- ✅ **Direito de acesso** aos próprios dados
- ✅ **Direito de exclusão** (soft delete)
- ✅ **Portabilidade de dados** em formato JSON

#### **RN-025: Auditoria**
- ✅ **Log todas operações** críticas
- ✅ **IP tracking** para login
- ✅ **Timestamp UTC** para todos logs
- ✅ **Retenção de logs**: 1 ano

### **Rate Limiting**

#### **RN-026: Limites de API**
- ✅ **100 requisições/minuto** por IP para endpoints públicos
- ✅ **1000 requisições/minuto** por usuário autenticado
- ✅ **10 tentativas/hora** para reset de senha
- ✅ **429 Too Many Requests** quando exceder

---

## 🎯 **Regras de Validação Cross-Module**

### **Integridade Referencial**

#### **RN-027: Relacionamentos Obrigatórios**
- ✅ **User.genderId**: Deve existir na tabela Gender
- ✅ **User.professionId**: Deve existir na tabela Profession
- ✅ **Account.userId**: Deve existir na tabela User
- ❌ **Não permitir** exclusão se existir dependências

#### **RN-028: Soft Delete**
- ✅ **Usuários excluídos**: Manter registros com flag deleted
- ✅ **Contas excluídas**: Manter histórico com status INACTIVE
- ✅ **Dados relacionados**: Preservar integridade

---

## 📊 **Regras de Performance**

### **Otimização de Consultas**

#### **RN-029: Índices Obrigatórios**
- ✅ **User.email**: Índice único
- ✅ **Account.userId**: Índice de consulta
- ✅ **User.status**: Índice para filtros
- ✅ **Account.type**: Índice para relatórios

#### **RN-030: Paginação**
- ✅ **Máximo 100 itens** por página
- ✅ **Padrão 20 itens** por página
- ✅ **Offset-based pagination** para listas simples
- ✅ **Cursor-based pagination** para grandes volumes

---

## 📝 **Implementação das Regras**

### **Onde as Regras são Aplicadas**

1. **Domain Layer**: Regras de negócio fundamentais nas entidades
2. **Application Layer**: Regras de processo nos use cases
3. **Infrastructure Layer**: Regras de persistência e performance
4. **Interface Layer**: Regras de validação de entrada

### **Monitoramento de Compliance**

- ✅ **Testes automatizados** para cada regra
- ✅ **Métricas de violação** em produção
- ✅ **Alertas automáticos** para regras críticas
- ✅ **Revisão mensal** das regras de negócio

---

**📅 Última atualização:** Agosto 2025
**👤 Responsável:** Equipe de Desenvolvimento SmartEconomy
**🔄 Versão:** 1.0.0
