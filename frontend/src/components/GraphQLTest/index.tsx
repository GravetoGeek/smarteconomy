import {Box,Spinner,Text,VStack} from 'native-base'
import React from 'react'
import {useHelloQuery} from '../../hooks/test/useHelloQuery'

/**
 * Componente de teste para validar conexão GraphQL
 *
 * Este componente faz uma query simples ao servidor GraphQL
 * e exibe o resultado. Use temporariamente para validar a configuração.
 */
export const GraphQLTest: React.FC=() => {
    const {hello,loading,error}=useHelloQuery()

    if(loading) {
        return (
            <Box bg="blue.100" p={4} borderRadius="md" mb={4}>
                <Spinner size="sm" />
                <Text fontSize="xs" color="blue.800" mt={2}>
                    Testando conexão GraphQL...
                </Text>
            </Box>
        )
    }

    if(error) {
        return (
            <Box bg="red.100" p={4} borderRadius="md" mb={4}>
                <Text fontSize="xs" color="red.800" fontWeight="bold">
                    ❌ Erro na conexão GraphQL
                </Text>
                <Text fontSize="xs" color="red.600" mt={1}>
                    {error.message}
                </Text>
            </Box>
        )
    }

    return (
        <Box bg="green.100" p={4} borderRadius="md" mb={4}>
            <Text fontSize="xs" color="green.800" fontWeight="bold">
                ✅ GraphQL conectado com sucesso!
            </Text>
            <Text fontSize="xs" color="green.600" mt={1}>
                Resposta: {hello}
            </Text>
        </Box>
    )
}
