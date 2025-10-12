import {FontAwesome,MaterialIcons} from '@expo/vector-icons'
import {useNavigation} from "@react-navigation/native"
import {Box,Button,Center,FormControl,Icon,Input,Text,VStack} from "native-base"
import React,{useContext,useState} from "react"
import DropDownPicker from "react-native-dropdown-picker"
import FloatingBottomMenu from "../../components/FloatingBottomMenu"
import Header from "../../components/Header"
import {Store} from '../../contexts/StoreProvider'
import {useCreateAccount} from '../../hooks/accounts/useCreateAccount'

// Tipos de conta disponíveis (hardcoded pois não há endpoint GraphQL)
const ACCOUNT_TYPES=[
    {label: 'Conta Corrente',value: 'checking',icon: () => <MaterialIcons name="account-balance" size={18} color="black" />},
    {label: 'Poupança',value: 'savings',icon: () => <MaterialIcons name="savings" size={18} color="black" />},
    {label: 'Investimento',value: 'investment',icon: () => <MaterialIcons name="trending-up" size={18} color="black" />},
    {label: 'Cartão de Crédito',value: 'credit_card',icon: () => <MaterialIcons name="credit-card" size={18} color="black" />},
    {label: 'Dinheiro',value: 'cash',icon: () => <MaterialIcons name="money" size={18} color="black" />},
    {label: 'Outra',value: 'other',icon: () => <FontAwesome name="mars" size={18} color="black" />},
]

export default function AddAccount() {
    const {user,accounts,setAccounts}=useContext(Store)
    const {createAccount,loading,error}=useCreateAccount()
    const [name,setName]=useState("")
    const [description,setDescription]=useState("")
    const [type,setType]=useState<string>("checking")
    const [open,setOpen]=useState(false)
    const [items,setItems]=useState(ACCOUNT_TYPES)

    const navigation=useNavigation()

    const handleNavigateDashboard=() => {
        navigation.navigate('Dashboard' as never)
    }

    const submit=async () => {
        if(!name||!type) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }

        const result=await createAccount({
            name,
            type,
            balance: 0,
            userId: user.id
        })

        if(result) {
            setAccounts([...accounts,result])
            handleNavigateDashboard()
        }
    }



    return (
        <Box height="full" flex={1} bg='white'>
            <Header />
            <VStack width='full' p={5} flex={1}>
                <Center>
                    <Text>Adicionar Conta</Text>
                    <FormControl isRequired>
                        <FormControl.Label>Nome</FormControl.Label>
                        <Input
                            placeholder="Nome"
                            onChangeText={(value) => setName(value)}
                            value={name}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="account-balance" />}
                                    size="sm"
                                    ml="2"
                                />
                            }
                        />

                        <FormControl.Label>Descrição</FormControl.Label>
                        <Input
                            placeholder="Descrição"
                            onChangeText={(value) => setDescription(value)}
                            value={description}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="description" />}
                                    size="sm"
                                    ml="2"
                                />
                            }
                        />

                        <FormControl.Label>Tipo</FormControl.Label>
                        <DropDownPicker
                            mode='SIMPLE'
                            dropDownDirection="TOP"
                            closeAfterSelecting={true}
                            itemSeparator={false}
                            listMode="SCROLLVIEW"
                            modalAnimationType="slide"
                            language="PT"
                            items={items}
                            open={open}
                            value={type}
                            setOpen={setOpen}
                            setValue={setType}
                            setItems={setItems}
                            containerStyle={{height: 40}}
                            onSelectItem={item => setType(String(item.value))}
                        />

                        {error&&(
                            <Text color="red.500" mt={2}>
                                {error.message||'Erro ao criar conta'}
                            </Text>
                        )}

                        <Button
                            onPress={submit}
                            mt={4}
                            colorScheme="purple"
                            _text={{color: 'white'}}
                            isLoading={loading}
                            isLoadingText="Criando..."
                        >
                            Adicionar
                        </Button>


                    </FormControl>
                </Center>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    )

}
