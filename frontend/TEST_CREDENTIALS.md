# 🔐 Credenciais de Teste - SmartEconomy

## ✅ Usuário de Teste Criado

### Dados de Login:

```
Email: teste@smarteconomy.com
Senha: Teste@123
```

### Dados Completos:

```json
{
    "id": "402fc787-db91-4af9-946b-49af900dac21",
    "email": "teste@smarteconomy.com",
    "name": "Usuario",
    "lastname": "Teste",
    "birthdate": "1990-01-01",
    "role": "USER",
    "genderId": "550e8400-e29b-41d4-a716-446655440001",
    "professionId": "660e8400-e29b-41d4-a716-446655440001"
}
```

### Gênero:

-   ID: `550e8400-e29b-41d4-a716-446655440001`
-   Nome: Masculino

### Profissão:

-   ID: `660e8400-e29b-41d4-a716-446655440001`
-   Nome: Desenvolvedor de Software

## 🧪 Testes Realizados

### ✅ Signup GraphQL

```graphql
mutation Signup($input: SignupInput!) {
    signup(input: $input) {
        accessToken
        user {
            id
            email
            role
        }
    }
}
```

**Status**: ✅ Sucesso

### ✅ Login GraphQL

```graphql
mutation Login($input: LoginInput!) {
    login(input: $input) {
        accessToken
        refreshToken
        expiresIn
        tokenType
        user {
            id
            email
            role
        }
    }
}
```

**Status**: ✅ Sucesso

### Tokens Gerados:

-   **Access Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDJmYzc4Ny1kYjkxLTRhZjktOTQ2Yi00OWFmOTAwZGFjMjEi...`
-   **Refresh Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDJmYzc4Ny1kYjkxLTRhZjktOTQ2Yi00OWFmOTAwZGFjMjEi...`
-   **Expires In**: 86400 segundos (24 horas)
-   **Token Type**: Bearer

## 📱 Como Testar no App

1. **Iniciar o app**:

    ```bash
    cd frontend
    npm start
    ```

2. **Abrir no Android/iOS**:

    - Pressione `a` para Android
    - Ou escaneie o QR code com Expo Go

3. **Fazer Login**:

    - Email: `teste@smarteconomy.com`
    - Senha: `Teste@123`

4. **Verificar**:
    - Token deve ser salvo no AsyncStorage
    - Navegação para Dashboard deve funcionar
    - Logout deve limpar tokens

## 🎯 Checklist de Testes

-   [x] Signup GraphQL funciona
-   [x] Login GraphQL funciona
-   [x] Tokens são gerados corretamente
-   [ ] Login no app mobile funciona
-   [ ] Token persiste no AsyncStorage
-   [ ] Navegação pós-login funciona
-   [ ] Logout limpa tokens

## 📝 Notas

-   Usuário criado em: 12/10/2025
-   Backend: http://localhost:3000/graphql
-   Backend ngrok: https://c006529a3355.ngrok-free.app/graphql
-   Ambiente: Desenvolvimento

---

**⚠️ IMPORTANTE**: Este usuário é apenas para testes. Não usar em produção.
