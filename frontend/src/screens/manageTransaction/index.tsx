import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Box, Button, Divider, FormControl, HStack, Icon, Input, NativeBaseProvider, ScrollView, Select, Spacer, Text, VStack } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from "../../contexts/StoreProvider";
import { Account, Category, Transaction } from "../../models";

export default function ManageTransaction({ route }) {
    const { profile, setProfile, categories, accounts, transaction_types, setCategories, setAccounts } = useContext(Store);
    const [transaction, setTransaction] = useState<Transaction>(route.params);
    const [date, setDate] = useState(moment(transaction.date).format("YYYY-MM-DD HH:mm:ss"));
    const [categoryByTransactionTypes, setCategoryByTransactionTypes] = useState<Category[]>([] as Category[]);


    const navigation = useNavigation();
    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });


    useFocusEffect(
        React.useCallback(() => {
            fetchAccountByProfile();
            fetchCategoriesByTransactionTypes();
            console.log(transaction)
        }, [transaction])
    )

    async function fetchAccountByProfile() {
        try {
            const accountResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/account/byProfile/${profile.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            const accountJson = await accountResponse.json();
            setAccounts(accountJson);
            // console.log('manageTransaction', transaction)
            console.log('fetchAccountByProfile')

        }
        catch (error) {
            console.error(error);
        }
    }


    async function fetchCategoriesByTransactionTypes() {
        try {
            let categoryByTransactionTypesResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/category/filter`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ transactionType: transaction.type_id })
                })

            let itens: Category[] = await categoryByTransactionTypesResponse.json()
            // console.log('categoryByTransactionTypesResponse', itens)
            setCategoryByTransactionTypes(itens)
            console.log('fetchCategoriesByTransactionTypes')
        }
        catch (error) {
            console.error(error);
        }
    }


    async function updateTransaction() {
        try {

            await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transaction/${transaction.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            }).then((response) => response.json())

            navigation.navigate('Dashboard')
        } catch (error) {
            console.log(error);
        }
    }


    async function handleInputChange(field, value) {
        setTransaction({ ...transaction, [field]: value });
        // if (field == 'type_id') {
        //     fetchCategoriesByTransactionTypes();
        // }
        console.log('handleInputChange')

    }


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(moment(currentDate).format("YYYY-MM-DD HH:mm:ss"));
        handleInputChange('date', moment(currentDate).format("YYYY-MM-DD HH:mm:ss"))
        // console.log('onChange', moment(currentDate).format("YYYY-MM-DD HH:mm:ss"))
        console.log('onChange')
    };

    const showDatepicker = () => {

        DateTimePickerAndroid.open({
            value: moment(date).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        });
        console.log('showDatepicker')
    };

    return (
        <NativeBaseProvider>
            <Box flex={1} bg="white" height="full">
                <Header />
                <Text fontSize="sm" fontWeight="bold">Gerenciar transação</Text>
                <VStack paddingLeft={5} paddingRight={5} width="full">
                    <ScrollView>
                        <FormControl isRequired>
                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Descrição</FormControl.Label>
                            <Input
                                value={transaction.description}
                                onChangeText={(value) => handleInputChange('description', value)}
                            />

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Valor</FormControl.Label>
                            <Input
                                value={transaction.amount.toString()}
                                keyboardType="numeric"
                                onChangeText={(value) => handleInputChange('amount', parseFloat(value))}
                            />

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Data</FormControl.Label>
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

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Tipo</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.type_id}`}
                                onValueChange={(value) => handleInputChange('type_id', value)}
                            >
                                {transaction_types ? transaction_types.map((type) => (
                                    <Select.Item key={`${type.id}`} label={type.type} value={`${type.id}`} />
                                )) : null}
                            </Select>

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Conta</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.account_id}`}
                                onValueChange={(value) => handleInputChange('account_id', value)}
                            >
                                {accounts ? accounts.map((account) => (
                                    <Select.Item key={`${account.id}`} label={account.name} value={`${account.id}`} />
                                )) : null}
                            </Select>

                            {transaction?.type_id == 3 ? (
                                <><FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Conta de destino</FormControl.Label>
                                    <Select
                                        selectedValue={`${transaction.destination_account}`}
                                        onValueChange={(value) => handleInputChange('destination_account', value)}
                                    >
                                        {accounts ? accounts.map((account) => (
                                            <Select.Item key={`${account.id}`} label={account.name} value={`${account.id}`} />
                                        )) : null}
                                    </Select>
                                </>
                            ) : null}





                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Categoria</FormControl.Label>
                            <Select
                                selectedValue={`${transaction.category_id}`}
                                onValueChange={(value) => handleInputChange('category_id', value)}
                            >
                                {categoryByTransactionTypes ? categoryByTransactionTypes.map((category) => (
                                    <Select.Item key={`${category.id}`} label={category.category} value={`${category.id}`} />

                                )) : null}
                            </Select>
                            <Button onPress={updateTransaction} colorScheme="purple" mt={5} mb={250}>Salvar</Button>
                        </FormControl>
                    </ScrollView>
                </VStack>
                <FloatingBottomMenu />
            </Box>
        </NativeBaseProvider>
    )
}
