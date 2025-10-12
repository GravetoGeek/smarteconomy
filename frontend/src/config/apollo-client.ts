import {ApolloClient,InMemoryCache,createHttpLink,from} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {BACKEND_HOST,BACKEND_PORT} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

// HTTP Link - conecta ao backend GraphQL
const httpLink=createHttpLink({
    uri: BACKEND_PORT==='443'
        ? `https://${BACKEND_HOST}/graphql`
        :`http://${BACKEND_HOST}:${BACKEND_PORT}/graphql`,
})

// Auth Link - adiciona token JWT nos headers
const authLink=setContext(async (_,{headers}) => {
    const token=await AsyncStorage.getItem('token')

    console.log('[Apollo Auth Link] Token from AsyncStorage:',token? `${token.substring(0,20)}...`:'NO TOKEN')

    return {
        headers: {
            ...headers,
            authorization: token? `Bearer ${token}`:'',
            'Content-Type': 'application/json',
        }
    }
})

// Error Link - tratamento global de erros
const errorLink=onError(({graphQLErrors,networkError,operation}) => {
    if(graphQLErrors) {
        graphQLErrors.forEach(({message,locations,path,extensions}) => {
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )

            // Tratar erros de autenticação
            if(extensions?.code==='UNAUTHENTICATED') {
                // Redirecionar para login ou renovar token
                console.log('Token inválido ou expirado')
            }
        })
    }

    if(networkError) {
        console.log(`[Network error]: ${networkError}`)
    }
})

// Apollo Client Instance
export const apolloClient=new ApolloClient({
    link: from([errorLink,authLink,httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    // Configuração de cache para paginação de transações
                    searchTransactions: {
                        keyArgs: ['userId','input',['filters']],
                        merge(existing,incoming,{args}) {
                            // Se é a primeira página ou não há dados anteriores, retorna os novos
                            if(!existing||args?.input?.page===1) {
                                return incoming
                            }

                            // Merge de paginação: adiciona novas transações às existentes
                            return {
                                ...incoming,
                                transactions: [...existing.transactions,...incoming.transactions]
                            }
                        }
                    },

                    // Cache para busca de usuários
                    searchUsers: {
                        keyArgs: ['input',['filter','sort','sortDirection']],
                        merge(existing,incoming,{args}) {
                            if(!existing||args?.input?.page===1) {
                                return incoming
                            }

                            return {
                                ...incoming,
                                items: [...existing.items,...incoming.items]
                            }
                        }
                    }
                }
            },

            // Type policies para normalização de cache
            Transaction: {
                keyFields: ['id'],
            },
            Account: {
                keyFields: ['id'],
            },
            User: {
                keyFields: ['id'],
            },
            Category: {
                keyFields: ['id'],
            },
            GenderModel: {
                keyFields: ['id'],
            },
            ProfessionModel: {
                keyFields: ['id'],
            }
        }
    }),

    // Configurações padrão de queries
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network', // Busca do cache primeiro, depois atualiza da rede
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
})
