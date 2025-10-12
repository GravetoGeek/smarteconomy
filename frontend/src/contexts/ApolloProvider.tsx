import {ApolloProvider as ApolloClientProvider} from '@apollo/client'
import React from 'react'
import {apolloClient} from '../config/apollo-client'

interface ApolloProviderProps {
    children: React.ReactNode
}

/**
 * ApolloProvider - Fornece o Apollo Client para toda a aplicação
 *
 * Este provider deve envolver toda a árvore de componentes que precisam
 * acessar o GraphQL. Geralmente é colocado no nível mais alto da aplicação (App.tsx).
 *
 * @example
 * ```tsx
 * <ApolloProvider>
 *   <StoreProvider>
 *     <NavigationContainer>
 *       <Routes />
 *     </NavigationContainer>
 *   </StoreProvider>
 * </ApolloProvider>
 * ```
 */
export const ApolloProvider: React.FC<ApolloProviderProps>=({children}) => {
    return (
        <ApolloClientProvider client={apolloClient}>
            {children}
        </ApolloClientProvider>
    )
}
