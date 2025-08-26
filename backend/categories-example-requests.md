# 📋 Exemplos de Requisições para o Módulo Categories

## 🚀 **Criar Categoria**

### **cURL:**
```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "mutation { createCategory(input: { category: \"Tecnologia\" }) { id category createdAt updatedAt } }",
  "variables": {}
}'
```

### **Postman:**
- **Method:** POST
- **URL:** `http://localhost:3000/graphql`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "query": "mutation { createCategory(input: { category: \"Tecnologia\" }) { id category createdAt updatedAt } }",
  "variables": {}
}
```

## 📋 **Listar Todas as Categorias**

### **cURL:**
```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query { categories { id category createdAt updatedAt } }",
  "variables": {}
}'
```

### **Postman:**
- **Method:** POST
- **URL:** `http://localhost:3000/graphql`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "query": "query { categories { id category createdAt updatedAt } }",
  "variables": {}
}
```

## 🔍 **Buscar Categoria por ID**

### **cURL:**
```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query { category(id: \"CATEGORY_ID_HERE\") { id category createdAt updatedAt } }",
  "variables": {}
}'
```

### **Postman:**
- **Method:** POST
- **URL:** `http://localhost:3000/graphql`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "query": "query { category(id: \"CATEGORY_ID_HERE\") { id category createdAt updatedAt } }",
  "variables": {}
}
```

## 📝 **Exemplos de Categorias para Teste**

```bash
# Criar categoria "Tecnologia"
mutation { createCategory(input: { category: "Tecnologia" }) { id category createdAt updatedAt } }

# Criar categoria "Finanças"
mutation { createCategory(input: { category: "Finanças" }) { id category createdAt updatedAt } }

# Criar categoria "Saúde"
mutation { createCategory(input: { category: "Saúde" }) { id category createdAt updatedAt } }

# Criar categoria "Educação"
mutation { createCategory(input: { category: "Educação" }) { id category createdAt updatedAt } }

# Criar categoria "Entretenimento"
mutation { createCategory(input: { category: "Entretenimento" }) { id category createdAt updatedAt } }
```

## ⚠️ **Casos de Erro Esperados**

### **Categoria Já Existe:**
```json
{
  "errors": [
    {
      "message": "Category with name Tecnologia already exists",
      "extensions": {
        "code": "CATEGORY_ALREADY_EXISTS"
      }
    }
  ],
  "data": null
}
```

### **Nome de Categoria Inválido:**
```json
{
  "errors": [
    {
      "message": "Invalid category name: A",
      "extensions": {
        "code": "CATEGORY_INVALID_NAME"
      }
    }
  ],
  "data": null
}
```

### **Categoria Não Encontrada:**
```json
{
  "errors": [
    {
      "message": "Category with id INVALID_ID not found",
      "extensions": {
        "code": "CATEGORY_NOT_FOUND"
      }
    }
  ],
  "data": null
}
```

## 🎯 **Resposta de Sucesso Esperada**

```json
{
  "data": {
    "createCategory": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "category": "Tecnologia",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```
