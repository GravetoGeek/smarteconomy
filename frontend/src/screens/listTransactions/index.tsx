import {useQuery} from "@apollo/client"
import {MaterialIcons} from "@expo/vector-icons"
import {useFocusEffect,useNavigation} from "@react-navigation/native"
import moment from "moment"
import {Avatar,Box,Center,Divider,HStack,Icon,List,ScrollView,Spacer,Spinner,Text,VStack} from "native-base"
import React,{useEffect,useState} from "react"
import {GestureResponderEvent,TouchableOpacity} from "react-native"
import CategoryIcon from "../../components/Dashboard/Icons/CategoryIcon"
import FloatingBottomMenu from "../../components/FloatingBottomMenu"
import Header from "../../components/Header"
import {Icons} from "../../components/Icons/Icons"
import {useStore} from "../../hooks/useStore"
import {GET_CATEGORIES} from "../../graphql/queries/categories.queries"
import {useSearchTransactions} from "../../hooks/transactions/useSearchTransactions"
import {Category,Transaction,TransactionTypes} from "../../models"

// Transaction types hardcoded (no GraphQL endpoint)
const TRANSACTION_TYPES=[
    {id: 1,type: 'EXPENSE',label: 'Despesa'},
    {id: 2,type: 'INCOME',label: 'Receita'},
    {id: 3,type: 'TRANSFER',label: 'Transferência'}
]

const ListTransactions=() => {
    const {user,startDate,endDate,receitaTotal,despesaTotal}=useStore()
    const navigation=useNavigation()

    // Buscar transações usando GraphQL
    const {transactions,loading: transactionsLoading,refetch: refetchTransactions}=useSearchTransactions(
        user?.id?.toString()||'',
        {
            filters: {
                dateFrom: startDate,
                dateTo: endDate
            },
            sortBy: 'date',
            sortOrder: 'DESC'
        }
    )

    // Buscar categorias usando GraphQL
    const {data: categoriesData,loading: categoriesLoading}=useQuery(GET_CATEGORIES)
    const categories=categoriesData?.categories||[]

    const isLoading=transactionsLoading||categoriesLoading
    const moeda=Intl.NumberFormat('pt-BR',{style: 'currency',currency: 'BRL'})

    useFocusEffect(
        React.useCallback(() => {
            refetchTransactions()
        },[startDate,endDate])
    )


    function handleManageTransaction(item: any): void {
        // Converter GraphQL transaction para formato legacy
        const transaction: Transaction={
            id: item.id,
            amount: item.amount,
            destination_account: item.destinationAccountId,
            description: item.description,
            date: item.date,
            type_id: item.type==='EXPENSE'? 1:(item.type==='INCOME'? 2:3),
            account_id: item.accountId,
            category_id: item.categoryId
        }

        navigation.navigate('ManageTransaction',transaction as any)
    }

    // Helper para mapear tipo GraphQL para legacy
    const getTypeId=(type: string): number => {
        return type==='EXPENSE'? 1:(type==='INCOME'? 2:3)
    }

    // Helper para obter label do tipo
    const getTypeLabel=(type: string): string => {
        const typeObj=TRANSACTION_TYPES.find(t => t.type===type)
        return typeObj?.label||type
    }

    return (
        <Box flex={1} bg="white">
            <Header />
            <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Transações</Text>
            <VStack mb={100} >
                <ScrollView height="85%">
                    {isLoading? (
                        <Center flex={1}>
                            <Spinner />
                        </Center>
                    ):(
                        transactions.map((transacao: any,index) => {
                            const category=categories.find((cat: any) => cat.id===transacao.categoryId)
                            const icon=Icons.find((icone) => icone.category===category?.category)
                            const typeId=getTypeId(transacao.type)
                            const typeLabel=getTypeLabel(transacao.type)

                            return (
                                <TouchableOpacity key={index} onPress={() => handleManageTransaction(transacao)}>
                                    <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                                        <HStack space={2} alignItems="center" divider={<Divider />}>

                                            <CategoryIcon color={icon?.color} category={category?.category} size={5} />

                                            <VStack flex={1} space={2} alignItems="center">
                                                <HStack space={2} alignItems="center">
                                                    <Text color={icon?.color}>{category?.category}</Text>
                                                    <Spacer />
                                                    <Text color={typeId===1? "red.500":(typeId===2? "green.500":"gray.500")}>
                                                        {typeLabel}
                                                    </Text>
                                                </HStack>
                                                <HStack space={2} alignItems="center">
                                                    <Text color="gray.500">{moment(transacao.date).format('DD/MM/YYYY')}</Text>
                                                    <Spacer />
                                                    <Text bold color="gray.500">
                                                        {typeId===1? (100*transacao.amount/despesaTotal).toFixed(2):(typeId===2? (100*transacao.amount/receitaTotal).toFixed(2):"")}%
                                                        {moeda.format(transacao.amount)}
                                                    </Text>
                                                </HStack>
                                                <Divider />
                                                <Text bold color="black">{transacao.description}</Text>
                                            </VStack>
                                        </HStack>
                                    </List>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </ScrollView>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    )
}


export default ListTransactions
