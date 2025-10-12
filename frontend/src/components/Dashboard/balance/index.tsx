import {FontAwesome,MaterialIcons} from '@expo/vector-icons'
import {useFocusEffect} from "@react-navigation/native"
import moment from 'moment'
import {Box,Button,Center,Divider,HStack,Icon,Text,VStack} from "native-base"
import React,{useContext,useEffect,useState} from "react"
import {Store} from "../../../contexts/StoreProvider"
import {useBalance} from '../../../hooks/dashboard/useBalance'
import {Transaction} from '../../../models'

export default function Balance() {
    const moeda=Intl.NumberFormat('pt-BR',{style: 'currency',currency: 'BRL'})

    const {
        user,
        profile,
        startDate,
        endDate,
        setDespesaTotal,
        setReceitaTotal,
        setTransactions,
        mesAtual
    }=useContext(Store)

    // Use GraphQL hook to fetch balance data
    const {balanceData,loading,refetch}=useBalance(
        user?.id||profile?.user_id,
        startDate,
        endDate
    )

    // Update Store context with totals when data changes
    useEffect(() => {
        if(balanceData) {
            setDespesaTotal(balanceData.totalExpenses)
            setReceitaTotal(balanceData.totalIncome)
            setTransactions(balanceData.transactions)
        }
    },[balanceData])

    useFocusEffect(
        React.useCallback(() => {
            if(refetch) {
                refetch()
            }
        },[refetch])
    )

    return (
        <Box bg="white" p={4} borderRadius={8} shadow={2}>
            <Center>
                <Text fontSize="lg" fontWeight="bold" mb={3}>Balanço de {mesAtual}</Text>
                <Divider my={2} />
                <VStack space={0} alignItems="center">
                    <HStack alignItems="center" space={3}>
                        <Text fontSize="md">Saldo:</Text>
                        <Text fontSize="md" fontWeight="bold" color={balanceData.balance>=0? 'green.500':'red.500'}>
                            {moeda.format(balanceData.balance)}
                        </Text>
                    </HStack>
                    <Divider my={2} />
                    <HStack alignItems="center" space={2}>
                        <HStack alignItems="center" space={1}>
                            <FontAwesome name="arrow-circle-up" size={24} color="green" />
                            <Text fontSize="sm">Receita:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.500">
                                {moeda.format(balanceData.totalIncome)}
                            </Text>
                        </HStack>
                        <HStack alignItems="center" space={1}>
                            <FontAwesome name="arrow-circle-down" size={24} color="red" />
                            <Text fontSize="sm">Despesa:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="red.500">
                                {moeda.format(balanceData.totalExpenses)}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Center>
        </Box>
    )

}
