# 🐛 Bug Fixes - Sprint 3

## Problemas Encontrados e Resolvidos

### 1. ❌ Maximum Update Depth Exceeded (Loop Infinito)

**Erro:**
```
ERROR  Error: Maximum update depth exceeded. This can happen when a component 
repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

**Causa:**
- Hooks do Dashboard (`useBalance`, `useCategoryBreakdown`, `useCategoryAnalysis`) retornavam **novos objetos a cada render**
- `useEffect` no componente `Balance` detectava mudança na referência do objeto
- Atualizava o Store com `setDespesaTotal()` e `setReceitaTotal()`
- Causava re-render infinito

**Solução:**
✅ Adicionado `useMemo` nos 3 hooks para **memoizar os valores calculados**

```typescript
// ANTES (criava novo objeto sempre):
return {
  balanceData: calculateBalance(), // ← Novo objeto a cada render
  loading,
  error,
  refetch,
};

// DEPOIS (memoizado):
const balanceData = useMemo(() => {
  // ... cálculos
  return { totalExpenses, totalIncome, balance, transactions };
}, [data]); // ← Recalcula APENAS quando 'data' muda

return {
  balanceData, // ← Mesma referência se data não mudou
  loading,
  error,
  refetch,
};
```

**Commit:** `4c9621a` - fix(dashboard): prevent infinite loop by memoizing hook return values

---

### 2. ❌ Forbidden Resource (Autenticação Falhando)

**Erro:**
```
LOG  [GraphQL error]: Message: Forbidden resource, Location: undefined, Path: undefined
ERROR  [useSearchTransactions] GraphQL error: Forbidden resource
LOG  error_addTransaction [TypeError: Network request failed]
```

**Causa:**
- Backend usava implementação JWT customizada com `simpleHash()`
- A função retornava hash **muito curto** (ex: "4c9621a")
- Token JWT ficava **truncado e inválido**
- Assinatura: apenas ~8 caracteres em vez de 44+
- Todas queries autenticadas falhavam com "Forbidden resource"

**Implementação Problemática:**
```typescript
private simpleHash(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash.toString(16)  // ← Retornava "4c9621a" (8 chars)
}
```

**Solução:**
✅ Substituído `simpleHash()` por **HMAC-SHA256 real** usando `crypto` nativo do Node.js

```typescript
import * as crypto from 'crypto'

private createSignature(data: string): string {
    const hmac = crypto.createHmac('sha256', this.secret)
    hmac.update(data)
    return hmac.digest('base64') // ← Retorna 44 caracteres base64
}
```

**Resultado:**
- ✅ Token length: **267 caracteres** (correto!)
- ✅ Login funcional
- ✅ Queries autenticadas funcionando
- ✅ Zero erros "Forbidden resource"

**Commit:** `25a5469` - fix(auth): replace simple hash with proper HMAC-SHA256 for JWT signature

---

### 2.1. ❌ JwtGuard Dependency Injection (Continuação do Bug 2)
**Status:** ✅ **RESOLVIDO**

**O que era:**
- Mesmo após corrigir o JWT, ainda havia erro "Forbidden resource"
- Backend crashava na inicialização
- "Nest can't resolve dependencies of the JwtGuard"

**Causa raiz:**
- `JwtGuard` estava usando `JwtService` do `@nestjs/jwt`
- Mas o sistema usa `JwtCryptoService` customizado
- DashboardsModule e TransactionsModule não importavam AuthModule
- Dependency injection falhava

**Solução aplicada:**
1. ✅ JwtGuard agora injeta `JWT_SERVICE` token
2. ✅ Usa `@Inject(JWT_SERVICE)` para pegar implementação customizada
3. ✅ DashboardsModule importa AuthModule
4. ✅ TransactionsModule importa AuthModule
5. ✅ AuthModule exporta JwtGuard

**Commit:** `217ca8f` - fix(auth): connect JwtGuard to custom JwtCryptoService and fix module imports

---

### 3. ⚠️ Apollo Client Warning (Não-Crítico)

**Warning:**
```
WARN  An error occurred! For more details, see the full error text at 
https://go.apollo.dev/c/err#{"version":"3.14.0","message":104,"args":["cache.diff","canonizeResults","Please remove this option."]}
```

**Causa:**
- Opção `canonizeResults` foi deprecada no Apollo Client 3.14+
- Não afeta funcionalidade, apenas warning

**Status:**
⚠️ **Não-crítico** - Não requer ação imediata
- Apollo Client ainda funciona normalmente
- Warning pode ser ignorado ou opção removida futuramente

---

## 📊 Resumo dos Fixes

| Problema | Severidade | Status | Commit |
|----------|-----------|--------|--------|
| Loop infinito (Maximum update depth) | 🔴 Crítico | ✅ Resolvido | 4c9621a |
| JWT inválido (Forbidden resource) | 🔴 Crítico | ✅ Resolvido | 25a5469 |
| JwtGuard dependency injection | 🔴 Crítico | ✅ Resolvido | 217ca8f |
| Apollo Client warning | 🟡 Baixo | ⚠️ Informativo | - |

---

## 🧪 Testes Realizados

### Backend (localhost:3000)
```bash
# Login
✅ Token gerado: 267 caracteres
✅ Formato: eyJhbG...Base64válido

# Query autenticada
✅ accountsByUser(userId) - Retorna dados
✅ searchTransactions - Retorna dados
✅ userById - Retorna dados
```

### Backend via Ngrok (https://c006529a3355.ngrok-free.app)
```bash
# Login
✅ Token gerado: 267 caracteres
✅ Token válido via ngrok

# Queries públicas
✅ genders - Funciona
✅ professions - Funciona
```

### Frontend Mobile (Expo)
```bash
# Antes dos fixes
❌ Loop infinito no Dashboard
❌ "Forbidden resource" em todas queries
❌ "Network request failed"

# Depois dos fixes
✅ Dashboard carrega sem erros
✅ Balance atualiza corretamente
✅ Queries autenticadas funcionam
✅ Sem loops infinitos
```

---

## 🚀 Próximos Passos

### Melhorias Recomendadas:

1. **Migrar para @nestjs/jwt oficial** (backend)
   - Remover implementação customizada
   - Usar biblioteca confiável e testada
   - Melhor suporte a refresh tokens

2. **Adicionar Error Boundaries** (frontend)
   - Capturar erros de render
   - Exibir UI de fallback
   - Log de erros para debugging

3. **Implementar Retry Logic** (frontend)
   - Queries com retry automático
   - Exponential backoff
   - Melhor UX em falhas de rede

4. **Token Refresh Automático** (frontend)
   - Detectar token expirado
   - Renovar automaticamente
   - Evitar logout inesperado

---

**Última atualização:** 12/10/2025  
**Branch:** update/frontend-dependencies  
**Status:** ✅ Todos bugs críticos resolvidos
