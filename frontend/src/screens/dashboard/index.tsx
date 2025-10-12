import {useQuery} from '@apollo/client'
import {MaterialIcons} from '@expo/vector-icons'
import {useFocusEffect,useNavigation} from "@react-navigation/native"
import {Box,HStack,Icon,List,ScrollView,Spacer,Text,VStack} from "native-base"
import React,{useEffect,useState} from "react"
import {TouchableOpacity} from "react-native"
import {VictoryPie} from 'victory-native'
import CategoryIcon from "../../components/Dashboard/Icons/CategoryIcon"
import Balance from "../../components/Dashboard/balance"
import FloatingBottomMenu from "../../components/FloatingBottomMenu"
import Header from "../../components/Header"
import {Icons} from '../../components/Icons/Icons'
import ListTransactionByCategory from '../../components/ListTransactionByCategory'
import {useStore} from '../../hooks/useStore'
import {GET_ACCOUNTS_BY_USER} from '../../graphql/queries/accounts.queries'
import {GET_USER_BY_ID} from '../../graphql/queries/users.queries'
import {useCategoryBreakdown} from '../../hooks/dashboard/useCategoryBreakdown'

// Transaction types mapping (hardcoded)
const TRANSACTION_TYPES=[
    {id: 1,type: 'EXPENSE'},
    {id: 2,type: 'INCOME'},
    {id: 3,type: 'TRANSFER'}
]

interface ApiData {
    amount: number
    category: string
    id: number
}

interface DataCategory {
    x: string
    y: number
    category: string
    id?: number
    color: string
    iconName: string
}

export default function Dashboard() {
    const {user,profile,setProfile,startDate,endDate,despesaTotal,receitaTotal,setTransactionTypes}=useStore()
    const [selectedCategory,setSelectedCategory]=useState<string[]>([])

    const navigation=useNavigation()

    // GraphQL queries
    const {data: userData,loading: userLoading}=useQuery(GET_USER_BY_ID,{
        variables: {id: user?.id},
        skip: !user?.id,
    })

    const {data: accountsData,loading: accountsLoading}=useQuery(GET_ACCOUNTS_BY_USER,{
        variables: {userId: user?.id},
        skip: !user?.id,
    })

    const {categoryBreakdown,loading: categoryLoading,refetch}=useCategoryBreakdown(
        user?.id?.toString()||'',
        startDate,
        endDate
    )

    const handleNavigateAddTransaction=() => {
        navigation.navigate('AddTransaction' as never)
    }
    const handleNavigateAddAccount=() => {
        navigation.navigate('AddAccount' as never)
    }
    const handleNavigateManageProfile=() => {
        navigation.navigate('ManageProfile' as never)
    }

    const moeda=Intl.NumberFormat('pt-BR',{style: 'currency',currency: 'BRL'})

    // Check profile completeness and navigate if needed
    useEffect(() => {
        if(userData?.userById) {
            const fetchedUser=userData.userById
            if(!fetchedUser.name||!fetchedUser.birthdate||!fetchedUser.lastname) {
                handleNavigateManageProfile()
            }
        }
    },[userData])

    // Check if user has accounts
    useEffect(() => {
        if(accountsData?.accountsByUser&&accountsData.accountsByUser.length===0) {
            handleNavigateAddAccount()
        }
    },[accountsData])

    // Set transaction types in Store
    // Note: TRANSACTION_TYPES is not compatible with Transaction[] type
    // This is hardcoded data, not actual transactions
    // useEffect(() => {
    //     setTransactionTypes(TRANSACTION_TYPES)
    // },[])

    useFocusEffect(
        React.useCallback(() => {
            if(refetch) {
                refetch()
            }
        },[refetch])
    )

    const getCategoryIcon=(categoryName: string): string => Icons.filter((item) => item.category===categoryName)[0]?.icon||"help"
    const getCategoryColor=(categoryName: string): string => Icons.filter((item) => item.category===categoryName)[0]?.color||"#9e9e9e"
    const listCategoryColor=(): string[] => Icons.map((item) => {return item.color})

    let chartDataDespesas: DataCategory[]=categoryBreakdown.expenses.map((item) => ({
        x: item.category,
        y: item.amount,
        category: item.category,
        id: item.id,
        color: getCategoryColor(item.category),
        iconName: getCategoryIcon(item.category),
    }))

    if(chartDataDespesas.length===0) {
        chartDataDespesas=[{
            x: 'Sem despesas',
            y: 0.001,
            category: 'Sem despesas',
            color: '#a4a3a3',
            iconName: 'help',
        }]
    }

    let chartDataRendas: DataCategory[]=categoryBreakdown.income.map((item) => ({
        x: item.category,
        y: item.amount,
        category: item.category,
        id: item.id,
        color: getCategoryColor(item.category),
        iconName: getCategoryIcon(item.category),
    }))

    if(chartDataRendas.length===0) {
        chartDataRendas=[{
            x: 'Sem rendas',
            y: 0.001,
            category: 'Sem rendas',
            color: '#a4a3a3',
            iconName: 'help',
        }]
    }

    function handleListTransactionByCategory(categoria: DataCategory): void {
        let {x,y,category,id,color,iconName}=categoria
        console.log("ListTransactionByCategory",categoria)
        navigation.navigate('ListTransactionByCategory',{x,y,category,id,color,iconName})
    }

    return (
        <Box flex={1} bg="white" height="full">
            <Header />
            <VStack width="full">

                <ScrollView height="85%">
                    <Balance />
                    <Box width="full" mt={1} mb={1}>
                        <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Despesas por categoria</Text>

                        <Box mb={1} borderRadius={2} shadow={1} >
                            <VictoryPie
                                events={[{
                                    target: "data",
                                    eventHandlers: {
                                        onPressIn: () => {
                                            return [
                                                {
                                                    target: "data",
                                                    mutation: ({radius,datum}) => {
                                                        let newRadius=radius
                                                        if(selectedCategory.includes(datum.x)) {
                                                            setSelectedCategory(selectedCategory.filter((item) => item!==datum.x))
                                                            newRadius=radius-10
                                                        }
                                                        else {
                                                            setSelectedCategory([...selectedCategory,datum.x])
                                                            newRadius=radius+10
                                                        }
                                                        return {radius: newRadius}
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }]}
                                data={chartDataDespesas}
                                colorScale={listCategoryColor()}
                                innerRadius={50}
                                labelRadius={120}
                                padding={100}
                                labels={({datum}: any) => `${despesaTotal===0? '':(100*datum.y/despesaTotal).toFixed(2)+'%'}\n${datum.x}\n${despesaTotal===0? '':moeda.format(datum.y)}`}
                                animate={{easing: 'exp'}}
                                style={{
                                    labels: {
                                        fill: ({datum}: any) => datum.color,
                                    },
                                    data: {
                                        fill: ({datum}: any) => datum.color,
                                    }
                                }}

                            >
                            </VictoryPie>
                            <Box mb={100} >
                                {
                                    chartDataDespesas.map((item,index) => (
                                        <TouchableOpacity key={index} onPress={() => handleListTransactionByCategory(item)}>
                                            <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                                                <HStack space={2} alignItems="center">
                                                    <CategoryIcon color={item.color} category={item.category} size={5} />
                                                    <Text bold color={item.color}>{item.x}</Text>
                                                    <Spacer />
                                                    <Text bold color={item.color}>{(100*item.y/despesaTotal).toFixed(2)}%    {moeda.format(item.y)}</Text>
                                                </HStack>
                                            </List>
                                        </TouchableOpacity>
                                    ))
                                }
                            </Box>

                        </Box>

                        <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Rendas por categoria</Text>

                        <Box mb={1} borderRadius={2} shadow={1} >
                            <VictoryPie
                                events={[{
                                    target: "data",
                                    eventHandlers: {
                                        onPressIn: () => {
                                            return [
                                                {
                                                    target: "data",
                                                    mutation: ({radius,datum}) => {
                                                        let newRadius=radius
                                                        if(selectedCategory.includes(datum.x)) {
                                                            setSelectedCategory(selectedCategory.filter((item) => item!==datum.x))
                                                            newRadius=radius-10
                                                        }
                                                        else {
                                                            setSelectedCategory([...selectedCategory,datum.x])
                                                            newRadius=radius+10
                                                        }
                                                        return {radius: newRadius}
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }]}
                                data={chartDataRendas}
                                colorScale={listCategoryColor()}
                                innerRadius={50}
                                labelRadius={120}
                                padding={100}
                                labels={({datum}: any) => `${receitaTotal===0? '':(100*datum.y/receitaTotal).toFixed(2)+'%'}\n${datum.x}\n${receitaTotal===0? '':moeda.format(datum.y)}`}
                                animate={{easing: 'exp'}}
                                style={{
                                    labels: {
                                        fill: ({datum}: any) => datum.color,
                                    },
                                    data: {
                                        fill: ({datum}: any) => datum.color,
                                    }
                                }}

                            >
                            </VictoryPie>
                            <Box mb={100} >
                                {
                                    chartDataRendas.map((item,index) => (
                                        <TouchableOpacity key={index} onPress={() => handleListTransactionByCategory(item)}>
                                            <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                                                <HStack space={2} alignItems="center">
                                                    <CategoryIcon color={item.color} category={item.category} size={5} />
                                                    <Text bold color={item.color}>{item.x}</Text>
                                                    <Spacer />
                                                    <Text bold color={item.color}>{(100*item.y/receitaTotal).toFixed(2)}%    {moeda.format(item.y)}</Text>
                                                </HStack>
                                            </List>
                                        </TouchableOpacity>
                                    ))
                                }
                            </Box>

                        </Box>
                    </Box>
                </ScrollView >
            </VStack>
            <FloatingBottomMenu />
        </Box >
    )
}
