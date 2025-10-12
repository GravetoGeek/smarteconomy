# 📋 Plano de Migração: REST → GraphQL

## 📊 Análise do Estado Atual

### Backend GraphQL (Pronto)

- ✅ Schema GraphQL completo em `/backend/src/schema.gql`
- ✅ Queries: users, accounts, transactions, categories, dashboards, auth
- ✅ Mutations: createUser, createAccount, createTransaction, login, signup, etc.
- ✅ Tipos: User, Account, Transaction, Category, AuthResponse, etc.

### Frontend REST (Atual)

- ❌ 50+ chamadas `fetch()` diretas espalhadas pelos componentes
- ❌ Sem camada de abstração (services/API layer)
- ❌ Lógica de fetch duplicada em múltiplos arquivos
- ❌ Gerenciamento de estado manual (Context API)
- ❌ Sem cache otimizado
- ❌ Axios usado em apenas 2 lugares

### Arquivos com Chamadas REST Identificados

```text
Autenticação:
- src/screens/login/index.tsx (login, get profile)
- src/screens/register/index.tsx (signup, login)

Transações:
- src/screens/addTransaction/index.tsx (create, list accounts/categories)
- src/screens/listTransactions/index.tsx (filter transactions, categories, types)
- src/screens/manageTransaction/index.tsx (update, delete, list)
- src/components/ListTransactionByCategory/index.tsx (filter)
- src/components/Dashboard/balance/index.tsx (filter)

Contas:
- src/screens/addAccount/index.tsx (create account, list types)
- src/screens/listAccounts/index.tsx (list accounts)
- src/screens/dashboard/index.tsx (accounts by profile, dashboard data)

Usuários:
- src/screens/manageProfile/index.tsx (update profile)
- src/store/user/thunks.tsx (fetch user details)
```

---

## 🎯 Estratégia de Migração

### Fase 1: Setup e Infraestrutura (2-3 dias)

**Objetivo:** Preparar ambiente GraphQL no frontend

#### 1.1 Instalar Dependências Apollo Client

```bash
npm install @apollo/client graphql
```

#### 1.2 Configurar Apollo Client

**Arquivo:** `src/config/apollo-client.ts`

```typescript
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_HOST, BACKEND_PORT } from "@env";

const httpLink = createHttpLink({
    uri: `http://${BACKEND_HOST}:${BACKEND_PORT}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
    },
});
```

#### 1.3 Criar Provider Apollo

**Arquivo:** `src/contexts/ApolloProvider.tsx`

```typescript
import React from "react";
import { ApolloProvider as ApolloClientProvider } from "@apollo/client";
import { apolloClient } from "../config/apollo-client";

export const ApolloProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ApolloClientProvider client={apolloClient}>
            {children}
        </ApolloClientProvider>
    );
};
```

#### 1.4 Integrar no App.tsx

```typescript
import { ApolloProvider } from "./src/contexts/ApolloProvider";

// Wrap NavigationContainer
<ApolloProvider>
    <StoreProvider>
        <NavigationContainer>
            <Routes />
        </NavigationContainer>
    </StoreProvider>
</ApolloProvider>;
```

---

### Fase 2: Criar GraphQL Operations (3-4 dias)

**Objetivo:** Definir todas queries e mutations em arquivos separados

#### 2.1 Estrutura de Pastas

```text
src/
  graphql/
    queries/
      auth.queries.ts
      user.queries.ts
      account.queries.ts
      transaction.queries.ts
      category.queries.ts
      dashboard.queries.ts
    mutations/
      auth.mutations.ts
      user.mutations.ts
      account.mutations.ts
      transaction.mutations.ts
      category.mutations.ts
    fragments/
      user.fragment.ts
      account.fragment.ts
      transaction.fragment.ts
    types/
      index.ts (gerado ou manual)
```

#### 2.2 Exemplo: Auth Queries/Mutations

**Arquivo:** `src/graphql/mutations/auth.mutations.ts`

```typescript
import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
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
`;

export const SIGNUP_MUTATION = gql`
    mutation Signup($input: SignupInput!) {
        signup(input: $input) {
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
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout($input: LogoutInput!) {
        logout(input: $input) {
            success
            message
        }
    }
`;
```

**Arquivo:** `src/graphql/queries/transaction.queries.ts`

```typescript
import { gql } from "@apollo/client";

export const SEARCH_TRANSACTIONS = gql`
    query SearchTransactions(
        $userId: String!
        $input: SearchTransactionsInput
    ) {
        searchTransactions(userId: $userId, input: $input) {
            transactions {
                id
                description
                amount
                type
                status
                accountId
                categoryId
                destinationAccountId
                date
                createdAt
                updatedAt
            }
            total
            page
            limit
            totalPages
        }
    }
`;

export const TRANSACTION_SUMMARY = gql`
    query TransactionSummary(
        $accountId: String!
        $dateFrom: DateTime!
        $dateTo: DateTime!
    ) {
        transactionSummary(
            accountId: $accountId
            dateFrom: $dateFrom
            dateTo: $dateTo
        ) {
            totalIncome
            totalExpense
            totalTransfer
            balance
            period
        }
    }
`;
```

#### 2.3 Exemplo: Transaction Mutations

**Arquivo:** `src/graphql/mutations/transaction.mutations.ts`

```typescript
import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
    mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
            transaction {
                id
                description
                amount
                type
                status
                accountId
                categoryId
                destinationAccountId
                date
                createdAt
            }
            warnings
        }
    }
`;

export const UPDATE_TRANSACTION = gql`
    mutation UpdateTransaction($id: String!, $input: UpdateTransactionInput!) {
        updateTransaction(id: $id, input: $input) {
            id
            description
            status
            updatedAt
        }
    }
`;

export const REVERSE_TRANSACTION = gql`
    mutation ReverseTransaction(
        $transactionId: String!
        $reason: String!
        $requestedBy: String!
    ) {
        reverseTransaction(
            transactionId: $transactionId
            reason: $reason
            requestedBy: $requestedBy
        ) {
            id
            status
            updatedAt
        }
    }
`;
```

---

### Fase 3: Criar Custom Hooks (4-5 dias)

**Objetivo:** Abstrair lógica GraphQL em hooks reutilizáveis

#### 3.1 Estrutura

```text
src/
  hooks/
    auth/
      useLogin.ts
      useSignup.ts
      useLogout.ts
    users/
      useUsers.ts
      useUserById.ts
      useCreateUser.ts
      useUpdateUser.ts
    accounts/
      useAccounts.ts
      useAccountById.ts
      useCreateAccount.ts
    transactions/
      useTransactions.ts
      useCreateTransaction.ts
      useUpdateTransaction.ts
      useReverseTransaction.ts
      useTransactionSummary.ts
    categories/
      useCategories.ts
      useCreateCategory.ts
    dashboards/
      useDashboardMetrics.ts
      useFinancialTrends.ts
```

#### 3.2 Exemplo: useLogin Hook

**Arquivo:** `src/hooks/auth/useLogin.ts`

```typescript
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../graphql/mutations/auth.mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    login: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    };
}

export const useLogin = () => {
    const [loginMutation, { data, loading, error }] =
        useMutation<LoginResponse>(LOGIN_MUTATION);

    const login = async (email: string, password: string) => {
        try {
            const result = await loginMutation({
                variables: {
                    input: { email, password },
                },
            });

            if (result.data?.login) {
                const { accessToken, refreshToken, user } = result.data.login;

                // Salvar tokens
                await AsyncStorage.setItem("token", accessToken);
                await AsyncStorage.setItem("refreshToken", refreshToken);
                await AsyncStorage.setItem("user", JSON.stringify(user));

                return { success: true, user, accessToken };
            }

            return { success: false, error: "Login falhou" };
        } catch (err) {
            console.error("Login error:", err);
            return { success: false, error: err.message };
        }
    };

    return {
        login,
        loading,
        error,
        data: data?.login,
    };
};
```

#### 3.3 Exemplo: useTransactions Hook

**Arquivo:** `src/hooks/transactions/useTransactions.ts`

```typescript
import { useQuery, useLazyQuery } from "@apollo/client";
import { SEARCH_TRANSACTIONS } from "../../graphql/queries/transaction.queries";

interface SearchTransactionsInput {
    filters?: {
        accountId?: string;
        categoryId?: string;
        type?: string;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        minAmount?: number;
        maxAmount?: number;
        searchTerm?: string;
    };
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}

export const useTransactions = (
    userId: string,
    input?: SearchTransactionsInput
) => {
    const { data, loading, error, refetch } = useQuery(SEARCH_TRANSACTIONS, {
        variables: { userId, input },
        skip: !userId,
    });

    return {
        transactions: data?.searchTransactions?.transactions || [],
        total: data?.searchTransactions?.total || 0,
        page: data?.searchTransactions?.page || 1,
        limit: data?.searchTransactions?.limit || 10,
        totalPages: data?.searchTransactions?.totalPages || 0,
        loading,
        error,
        refetch,
    };
};

export const useLazyTransactions = () => {
    const [fetchTransactions, { data, loading, error }] =
        useLazyQuery(SEARCH_TRANSACTIONS);

    const search = async (userId: string, input?: SearchTransactionsInput) => {
        return await fetchTransactions({ variables: { userId, input } });
    };

    return {
        search,
        transactions: data?.searchTransactions?.transactions || [],
        total: data?.searchTransactions?.total || 0,
        loading,
        error,
    };
};
```

#### 3.4 Exemplo: useCreateTransaction Hook

**Arquivo:** `src/hooks/transactions/useCreateTransaction.ts`

```typescript
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../../graphql/mutations/transaction.mutations";
import { SEARCH_TRANSACTIONS } from "../../graphql/queries/transaction.queries";

interface CreateTransactionInput {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE" | "TRANSFER";
    accountId: string;
    categoryId: string;
    destinationAccountId?: string;
    date?: Date;
}

export const useCreateTransaction = () => {
    const [createTransactionMutation, { data, loading, error }] = useMutation(
        CREATE_TRANSACTION,
        {
            // Atualizar cache após criação
            refetchQueries: [SEARCH_TRANSACTIONS],
            awaitRefetchQueries: true,
        }
    );

    const createTransaction = async (input: CreateTransactionInput) => {
        try {
            const result = await createTransactionMutation({
                variables: { input },
            });

            if (result.data?.createTransaction) {
                return {
                    success: true,
                    transaction: result.data.createTransaction.transaction,
                    warnings: result.data.createTransaction.warnings || [],
                };
            }

            return { success: false, error: "Falha ao criar transação" };
        } catch (err) {
            console.error("Create transaction error:", err);
            return { success: false, error: err.message };
        }
    };

    return {
        createTransaction,
        loading,
        error,
        data: data?.createTransaction,
    };
};
```

---

### Fase 4: Refatorar Componentes/Telas (5-7 dias)

**Objetivo:** Substituir fetch() por hooks GraphQL

#### 4.1 Exemplo: Login Screen (ANTES)

```typescript
// ANTES - REST com fetch
const handleLogin = async () => {
    const url = `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`;

    const loginResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (loginData.accessToken) {
        await AsyncStorage.setItem("token", loginData.accessToken);
        // ... resto da lógica
    }
};
```

#### 4.2 Exemplo: Login Screen (DEPOIS)

```typescript
// DEPOIS - GraphQL com hook
import { useLogin } from "../../hooks/auth/useLogin";

const LoginScreen = () => {
    const { login, loading, error } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const result = await login(email, password);

        if (result.success) {
            // Navegar para dashboard
            navigation.navigate("Dashboard");
        } else {
            // Mostrar erro
            Alert.alert("Erro", result.error);
        }
    };

    return (
        // JSX com loading e error states
        <Button onPress={handleLogin} isLoading={loading}>
            Login
        </Button>
    );
};
```

#### 4.3 Exemplo: AddTransaction Screen (DEPOIS)

```typescript
// DEPOIS - GraphQL
import { useCreateTransaction } from "../../hooks/transactions/useCreateTransaction";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { useCategories } from "../../hooks/categories/useCategories";

const AddTransactionScreen = () => {
    const { user } = useContext(Store);
    const { createTransaction, loading: creating } = useCreateTransaction();
    const { accounts, loading: loadingAccounts } = useAccounts(user.id);
    const { categories, loading: loadingCategories } = useCategories();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE" | "TRANSFER">(
        "EXPENSE"
    );

    const handleSubmit = async () => {
        const result = await createTransaction({
            description,
            amount: parseFloat(amount),
            type,
            accountId: selectedAccount,
            categoryId: selectedCategory,
            date: new Date(),
        });

        if (result.success) {
            Alert.alert("Sucesso", "Transação criada!");
            navigation.goBack();
        } else {
            Alert.alert("Erro", result.error);
        }
    };

    if (loadingAccounts || loadingCategories) {
        return <Spinner />;
    }

    return (
        // JSX com dados carregados
        <Select
            selectedValue={selectedAccount}
            onValueChange={setSelectedAccount}
        >
            {accounts.map((acc) => (
                <Select.Item key={acc.id} label={acc.name} value={acc.id} />
            ))}
        </Select>
    );
};
```

#### 4.4 Exemplo: ListTransactions Screen (DEPOIS)

```typescript
import { useTransactions } from "../../hooks/transactions/useTransactions";

const ListTransactionsScreen = () => {
    const { user } = useContext(Store);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);

    const { transactions, total, loading, error, refetch } = useTransactions(
        user.id,
        {
            filters,
            page,
            limit: 20,
            sortBy: "date",
            sortOrder: "DESC",
        }
    );

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleRefresh = () => {
        refetch();
    };

    if (loading) return <Spinner />;
    if (error) return <Text>Erro: {error.message}</Text>;

    return (
        <FlatList
            data={transactions}
            renderItem={({ item }) => <TransactionItem transaction={item} />}
            onRefresh={handleRefresh}
            refreshing={loading}
            onEndReached={() => setPage((p) => p + 1)}
        />
    );
};
```

---

### Fase 5: Otimizações e Cache (2-3 dias)

**Objetivo:** Melhorar performance com cache Apollo

#### 5.1 Configurar Type Policies

```typescript
// apollo-client.ts
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                searchTransactions: {
                    keyArgs: ["userId", "input", ["filters"]],
                    merge(existing, incoming, { args }) {
                        if (!existing || args?.input?.page === 1) {
                            return incoming;
                        }
                        return {
                            ...incoming,
                            transactions: [
                                ...existing.transactions,
                                ...incoming.transactions,
                            ],
                        };
                    },
                },
            },
        },
        Transaction: {
            keyFields: ["id"],
        },
        Account: {
            keyFields: ["id"],
        },
        User: {
            keyFields: ["id"],
        },
    },
});
```

#### 5.2 Otimistic Updates

```typescript
export const useUpdateTransaction = () => {
    const [updateMutation] = useMutation(UPDATE_TRANSACTION, {
        optimisticResponse: (vars) => ({
            updateTransaction: {
                __typename: "Transaction",
                id: vars.id,
                ...vars.input,
                updatedAt: new Date().toISOString(),
            },
        }),
        update: (cache, { data }) => {
            const transactionId = data.updateTransaction.id;
            cache.modify({
                id: cache.identify({
                    __typename: "Transaction",
                    id: transactionId,
                }),
                fields: {
                    description: () => data.updateTransaction.description,
                    status: () => data.updateTransaction.status,
                },
            });
        },
    });

    return { updateTransaction: updateMutation };
};
```

---

### Fase 6: Remover Código REST (1-2 dias)

**Objetivo:** Limpar código legado

#### 6.1 Remover Imports Não Utilizados

- Remover `fetch()` não utilizados
- Remover `axios` se não for mais necessário
- Limpar variáveis `BACKEND_HOST`, `BACKEND_PORT` duplicadas

#### 6.2 Atualizar Context Store

- Remover lógica de fetch do Context
- Manter apenas estado local necessário
- Delegar queries para Apollo Cache

---

## 📈 Benefícios da Migração

### Performance

- ✅ **Cache Inteligente**: Apollo Client gerencia cache automaticamente
- ✅ **Deduplicação**: Requisições duplicadas são automaticamente combinadas
- ✅ **Optimistic UI**: Updates instantâneos na UI antes da confirmação do servidor
- ✅ **Pagination**: Suporte nativo para paginação infinita

### Developer Experience

- ✅ **Type Safety**: Types gerados automaticamente do schema GraphQL
- ✅ **Reusabilidade**: Hooks reutilizáveis em todo o app
- ✅ **Debugging**: Ferramentas Apollo DevTools
- ✅ **Code Organization**: Separação clara de queries/mutations/hooks

### Manutenibilidade

- ✅ **Single Source of Truth**: Schema GraphQL documenta toda API
- ✅ **Refactoring Seguro**: TypeScript + GraphQL previne erros
- ✅ **Testing**: Mocking facilitado com Apollo MockedProvider

---

## 🚀 Roadmap de Implementação

### Sprint 1 (1 semana)

- [ ] Setup Apollo Client
- [ ] Criar estrutura de pastas GraphQL
- [ ] Definir queries/mutations de Auth
- [ ] Criar hooks de Auth (useLogin, useSignup)
- [ ] Refatorar tela de Login
- [ ] Refatorar tela de Register

### Sprint 2 (1 semana)

- [ ] Definir queries/mutations de Transactions
- [ ] Criar hooks de Transactions
- [ ] Refatorar AddTransaction screen
- [ ] Refatorar ListTransactions screen
- [ ] Refatorar ManageTransaction screen

### Sprint 3 (1 semana)

- [ ] Definir queries/mutations de Accounts
- [ ] Criar hooks de Accounts
- [ ] Refatorar AddAccount screen
- [ ] Refatorar ListAccounts screen
- [ ] Refatorar Dashboard (accounts)

### Sprint 4 (1 semana)

- [ ] Definir queries de Dashboard
- [ ] Criar hooks de Dashboard
- [ ] Refatorar Dashboard metrics
- [ ] Refatorar Financial Trends
- [ ] Implementar cache policies

### Sprint 5 (3-5 dias)

- [ ] Implementar Optimistic Updates
- [ ] Configurar error handling global
- [ ] Implementar retry policies
- [ ] Testes de integração

### Sprint 6 (2-3 dias)

- [ ] Remover código REST legado
- [ ] Code review e refactoring
- [ ] Documentação
- [ ] Deploy e validação

---

## 🛠️ Ferramentas Auxiliares

### GraphQL Code Generator (Opcional)

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

**codegen.yml:**

```yaml
schema: http://localhost:8000/graphql
documents: "src/graphql/**/*.ts"
generates:
    src/graphql/types/generated.ts:
        plugins:
            - typescript
            - typescript-operations
            - typescript-react-apollo
        config:
            withHooks: true
            withComponent: false
```

### Apollo DevTools

- Instalar extensão Chrome/Firefox
- Debugar queries em tempo real
- Inspecionar cache Apollo

---

## 📝 Checklist de Migração por Tela

### ✅ Autenticação

- [ ] Login screen → useLogin hook
- [ ] Register screen → useSignup hook
- [ ] Logout → useLogout hook

### ✅ Transações

- [ ] AddTransaction → useCreateTransaction, useAccounts, useCategories
- [ ] ListTransactions → useTransactions
- [ ] ManageTransaction → useUpdateTransaction, useReverseTransaction
- [ ] TransactionDetails → useTransactionById

### ✅ Contas

- [ ] AddAccount → useCreateAccount
- [ ] ListAccounts → useAccounts
- [ ] AccountDetails → useAccountById

### ✅ Dashboard

- [ ] Dashboard metrics → useDashboardMetrics
- [ ] Financial trends → useFinancialTrends
- [ ] Balance component → useTransactionSummary
- [ ] Category analysis → useCategoryAnalysis

### ✅ Perfil

- [ ] ManageProfile → useUpdateUser, useUserById

---

## 🎯 Métricas de Sucesso

### Melhoria de Performance

- [ ] Redução de 40-60% no tempo de carregamento
- [ ] Redução de 50-70% em requisições de rede (cache)
- [ ] UI instantâneo com optimistic updates

### Código

- [ ] Redução de 30-40% em linhas de código
- [ ] Zero duplicação de lógica de fetch
- [ ] 100% type safety com TypeScript

### Qualidade

- [ ] 0 chamadas REST diretas
- [ ] Cobertura de testes > 80%
- [ ] Documentação completa de hooks

---

## 📚 Recursos e Referências

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [React Native + Apollo](https://www.apollographql.com/docs/react/integrations/react-native/)
- [Schema Backend](../backend/src/schema.gql)

---

**Data de Criação:** 12/10/2025
**Autor:** GitHub Copilot
**Status:** 📋 Planejamento
