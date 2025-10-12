import {useQuery} from "@apollo/client"
import {FontAwesome5,MaterialIcons} from "@expo/vector-icons"
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker"
import {useFocusEffect,useNavigation} from "@react-navigation/native"
import moment from "moment"
import {Box,Button,Divider,FormControl,HStack,Icon,Input,NativeBaseProvider,ScrollView,Select,Spacer,Text,VStack} from "native-base"
import React,{useEffect,useState} from "react"
import DropDownPicker from "react-native-dropdown-picker"
import FloatingBottomMenu from "../../components/FloatingBottomMenu"
import Header from "../../components/Header"
import {useStore} from "../../hooks/useStore"
import {GET_ACCOUNTS_BY_USER} from "../../graphql/queries/accounts.queries"
import {GET_CATEGORIES} from "../../graphql/queries/categories.queries"
import {useUpdateTransaction} from "../../hooks/transactions/useUpdateTransaction"
import {Account,Category,Transaction} from "../../models"

// Transaction types mapping (GraphQL doesn't have a transactionTypes endpoint)
const TRANSACTION_TYPES=[
    {id: 1,type: 'EXPENSE'},
    {id: 2,type: 'INCOME'},
    {id: 3,type: 'TRANSFER'}
]

export default function ManageTransaction({route}) {
    const {profile}=useStore()
    const [transaction,setTransaction]=useState<Transaction>(route.params)
    const [date,setDate]=useState(moment(transaction.date).format("YYYY-MM-DD HH:mm:ss"))
    const [categoryByTransactionTypes,setCategoryByTransactionTypes]=useState<Category[]>([] as Category[])

    const navigation=useNavigation()

    // GraphQL queries
    const {data: accountsData,loading: accountsLoading}=useQuery(GET_ACCOUNTS_BY_USER,{
        variables: {userId: profile?.id},
        skip: !profile?.id,
    })

    const {data: categoriesData,loading: categoriesLoading}=useQuery(GET_CATEGORIES)

    // GraphQL mutation
    const {updateTransaction: updateTransactionMutation,loading: updateLoading}=useUpdateTransaction()

    const accounts=accountsData?.accountsByUser||[]
    const allCategories=categoriesData?.categories||[]
    const moeda=Intl.NumberFormat('pt-BR',{style: 'currency',currency: 'BRL'})

    // Filter categories based on transaction type
    useEffect(() => {
        if(allCategories.length>0&&transaction.type_id) {
            const filtered=allCategories.filter(
                (cat: any) => cat.transactionTypeId===transaction.type_id
            )
            setCategoryByTransactionTypes(filtered)
        }
    },[allCategories,transaction.type_id])

    useFocusEffect(
        React.useCallback(() => {
            console.log(transaction)
        },[transaction])
    )

    async function updateTransaction() {
        try {
            await updateTransactionMutation({
                id: String(transaction.id),
                description: transaction.description,
                amount: transaction.amount,
                date: String(transaction.date),
                transactionTypeId: transaction.type_id,
                accountId: String(transaction.account_id),
                categoryId: String(transaction.category_id),
                destinationAccountId: transaction.destination_account? String(transaction.destination_account):undefined,
            })

            navigation.navigate('Dashboard' as never)
        } catch(error) {
            console.log(error)
        }
    }


    async function handleInputChange(field,value) {
        setTransaction({...transaction,[field]: value})
        console.log('handleInputChange')
    }


    const onChange=(event: any,selectedDate: any) => {
        const currentDate=selectedDate
        setDate(moment(currentDate).format("YYYY-MM-DD HH:mm:ss"))
        handleInputChange('date',moment(currentDate).format("YYYY-MM-DD HH:mm:ss"))
        console.log('onChange')
    }

    const showDatepicker=() => {

        DateTimePickerAndroid.open({
            value: moment(date).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        })
        console.log('showDatepicker')
    }

    return (
        <NativeBaseProvider>
            <Box flex={1} bg="white" height="full">
                <Header />
                <Text fontSize="sm" fontWeight="bold">Gerenciar transação</Text>
                <VStack paddingLeft={5} paddingRight={5} width="full">
                    <ScrollView>
                        <FormControl isRequired>
                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Descrição</FormControl.Label>
                            <Input
                                value={transaction.description}
                                onChangeText={(value) => handleInputChange('description',value)}
                            />

                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Valor</FormControl.Label>
                            <Input
                                value={transaction.amount.toString()}
                                keyboardType="numeric"
                                onChangeText={(value) => handleInputChange('amount',parseFloat(value))}
                            />

                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Data</FormControl.Label>
                            <Input
                                onPressIn={showDatepicker}
                                value={moment(transaction.date).format("DD/MM/YYYY")}
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="calendar-today" />}
                                        size={5}
                                        ml={2}
                                        color="muted.400"
                                    />
                                }
                            />

                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Tipo</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.type_id}`}
                                onValueChange={(value) => handleInputChange('type_id',value)}
                            >
                                {TRANSACTION_TYPES.map((type) => (
                                    <Select.Item key={`${type.id}`} label={type.type} value={`${type.id}`} />
                                ))}
                            </Select>

                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Conta</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.account_id}`}
                                onValueChange={(value) => handleInputChange('account_id',value)}
                            >
                                {accounts.map((account: any) => (
                                    <Select.Item key={`${account.id}`} label={account.name} value={`${account.id}`} />
                                ))}
                            </Select>

                            {transaction?.type_id==3? (
                                <><FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Conta de destino</FormControl.Label>
                                    <Select
                                        selectedValue={`${transaction.destination_account}`}
                                        onValueChange={(value) => handleInputChange('destination_account',value)}
                                    >
                                        {accounts.map((account: any) => (
                                            <Select.Item key={`${account.id}`} label={account.name} value={`${account.id}`} />
                                        ))}
                                    </Select>
                                </>
                            ):null}




                            <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Categoria</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.category_id}`}
                                onValueChange={(value) => handleInputChange('category_id',value)}
                            >
                                {categoryByTransactionTypes? categoryByTransactionTypes.map((category) => (
                                    <Select.Item key={`${category.id}`} label={category.category} value={`${category.id}`} />
                                )):null}
                            </Select>
                            <Button
                                onPress={updateTransaction}
                                colorScheme="purple"
                                mt={5}
                                mb={250}
                                isLoading={updateLoading||accountsLoading||categoriesLoading}
                                isDisabled={updateLoading||accountsLoading||categoriesLoading}
                            >
                                Salvar
                            </Button>
                        </FormControl>
                    </ScrollView>
                </VStack>
                <FloatingBottomMenu />
            </Box>
        </NativeBaseProvider>
    )
}
