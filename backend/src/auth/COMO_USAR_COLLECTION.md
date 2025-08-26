# 📋 Como Usar a Collection do Postman - Módulo Auth

## 🚀 Pré-requisitos

1. **Postman instalado** no seu computador
2. **Servidor rodando**: `docker compose up -d`
3. **Usuário criado**: Use o módulo Users para criar um usuário primeiro

## 📥 Importando a Collection

### **1. Abrir o Postman**
- Abra o aplicativo Postman
- Faça login na sua conta (opcional, mas recomendado)

### **2. Importar a Collection**
- Clique em **"Import"** no canto superior esquerdo
- Selecione o arquivo: `SmartEconomy_Auth_Collection.json`
- Clique em **"Import"**

### **3. Verificar a Importação**
- A collection **"SmartEconomy - Auth Module"** deve aparecer na lista
- Verifique se as variáveis estão configuradas:
  - `baseUrl`: `http://localhost:3000`
  - `accessToken`: (vazio inicialmente)
  - `refreshToken`: (vazio inicialmente)

## 🧪 Testando a Collection

### **📁 Estrutura da Collection**

```
SmartEconomy - Auth Module
├── 🔐 Auth - Login
│   ├── Login - Sucesso
│   ├── Login - Credenciais Inválidas
│   ├── Login - Usuário Não Encontrado
│   ├── Login - Email Inválido
│   └── Login - Senha Muito Curta
├── 🔄 Auth - Refresh Token
│   ├── Refresh Token - Sucesso
│   └── Refresh Token - Token Inválido
├── 🚪 Auth - Logout
│   └── Logout - Sucesso
├── ✅ Auth - Validate Token
│   ├── Validate Token - Token Válido
│   ├── Validate Token - Token Inválido
│   └── Validate Token - Token Revogado
└── 🧪 Auth - Fluxo Completo
    ├── 1. Login para obter tokens
    ├── 2. Validar token obtido
    ├── 3. Refresh token
    ├── 4. Validar token renovado
    ├── 5. Logout
    └── 6. Tentar validar token após logout
```

## 🎯 Como Testar

### **Opção 1: Teste Individual**
1. **Selecione uma requisição** da collection
2. **Clique em "Send"**
3. **Verifique a resposta** no painel inferior
4. **Analise os logs** no console do Postman (aba "Console")

### **Opção 2: Fluxo Completo (Recomendado)**
1. **Abra a pasta "🧪 Auth - Fluxo Completo"**
2. **Execute as requisições em sequência** (1 a 6)
3. **Observe como os tokens são gerenciados** automaticamente

### **Opção 3: Runner do Postman**
1. **Clique com botão direito** na collection
2. **Selecione "Run collection"**
3. **Configure as opções**:
   - Delay: 1000ms (1 segundo entre requisições)
   - Iterations: 1
   - Log responses: ✅
4. **Clique em "Run SmartEconomy - Auth Module"**

## 🔧 Configurações Importantes

### **Variáveis da Collection**
- **`baseUrl`**: URL base da API (padrão: `http://localhost:3000`)
- **`accessToken`**: Token de acesso (preenchido automaticamente)
- **`refreshToken`**: Token de renovação (preenchido automaticamente)

### **Scripts Automáticos**
A collection possui scripts que:
- ✅ **Salvam tokens** automaticamente após login
- ✅ **Atualizam tokens** após refresh
- ✅ **Limpam tokens** após logout
- ✅ **Exibem logs** informativos no console

## 📊 Exemplos de Respostas

### **Login - Sucesso**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400,
      "tokenType": "Bearer",
      "user": {
        "id": "a69d755a-6de1-4eaf-aaad-3123462ef281",
        "email": "joao.carlos@example.com",
        "role": "USER"
      }
    }
  }
}
```

### **Login - Erro**
```json
{
  "errors": [
    {
      "message": "Invalid email or password",
      "extensions": {
        "code": "INVALID_CREDENTIALS"
      }
    }
  ],
  "data": null
}
```

### **Validate Token - Sucesso**
```json
{
  "data": {
    "validateToken": {
      "valid": true,
      "user": {
        "id": "a69d755a-6de1-4eaf-aaad-3123462ef281",
        "email": "joao.carlos@example.com",
        "role": "USER"
      }
    }
  }
}
```

## 🔍 Verificando os Logs

### **Console do Postman**
1. **Abra o console**: `View > Show Postman Console`
2. **Execute uma requisição**
3. **Verifique os logs**:
   ```
   ✅ Login realizado com sucesso
   User ID: a69d755a-6de1-4eaf-aaad-3123462ef281
   User Email: joao.carlos@example.com
   User Role: USER
   Tokens salvos nas variáveis da collection
   ```

### **Logs do Servidor**
```bash
# Ver logs em tempo real
docker compose logs -f backend

# Exemplo de logs esperados
[AuthResolver] Login attempt for email: joao.carlos@example.com
[AuthResolver] Login successful for user: a69d755a-6de1-4eaf-aaad-3123462ef281
[AuthResolver] Token validation result: true
[AuthResolver] Logout successful
```

## 🚨 Solução de Problemas

### **Erro: "Cannot connect to server"**
- ✅ Verifique se o servidor está rodando: `docker compose ps`
- ✅ Verifique se a porta 3000 está livre
- ✅ Reinicie os containers: `docker compose restart`

### **Erro: "User not found"**
- ✅ Crie um usuário primeiro usando o módulo Users
- ✅ Use as credenciais corretas: `joao.carlos@example.com` / `password123`

### **Erro: "Invalid token"**
- ✅ Execute o fluxo completo em sequência
- ✅ Verifique se as variáveis estão sendo preenchidas
- ✅ Faça login novamente para obter novos tokens

### **Tokens não estão sendo salvos**
- ✅ Verifique se os scripts estão habilitados
- ✅ Execute a requisição "Login - Sucesso" primeiro
- ✅ Verifique o console do Postman para logs

## 🎯 Dicas de Uso

### **1. Teste o Fluxo Completo Primeiro**
- Execute a pasta "🧪 Auth - Fluxo Completo" em sequência
- Isso garante que tudo está funcionando

### **2. Use o Console do Postman**
- Mantenha o console aberto para ver os logs
- Ajuda a debugar problemas

### **3. Verifique as Variáveis**
- Clique em "Variables" na collection
- Verifique se `accessToken` e `refreshToken` estão sendo preenchidos

### **4. Teste Cenários de Erro**
- Execute as requisições de erro para verificar validações
- Confirme que as mensagens de erro estão corretas

## 📝 Personalização

### **Alterar Credenciais**
1. **Abra uma requisição de login**
2. **Altere as variáveis** no body:
   ```json
   {
     "input": {
       "email": "seu-email@example.com",
       "password": "sua-senha"
     }
   }
   ```

### **Alterar URL Base**
1. **Clique em "Variables"** na collection
2. **Altere `baseUrl`** para sua URL
3. **Exemplo**: `https://api.smarteconomy.com`

### **Adicionar Headers**
1. **Abra uma requisição**
2. **Vá para a aba "Headers"**
3. **Adicione headers customizados** se necessário

## 🎉 Conclusão

Esta collection permite testar **todas as funcionalidades** do módulo Auth de forma **automática e organizada**. Use-a para:

- ✅ **Desenvolvimento**: Testar durante o desenvolvimento
- ✅ **QA**: Validar funcionalidades antes do deploy
- ✅ **Documentação**: Demonstrar como usar a API
- ✅ **Debugging**: Identificar problemas rapidamente

**Boa sorte com os testes! 🚀**
