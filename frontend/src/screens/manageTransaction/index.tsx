import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Box, Button, Divider, FormControl, HStack, Icon, Input, NativeBaseProvider, ScrollView, Select, Spacer, Text, VStack } from "native-base";
import React, { useContext, useState } from "react";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from "../../contexts/StoreProvider";
import { Transaction } from "../../models";

export default function ManageTransaction({ route }) {
    const { profile, setProfile, categories, accounts, transaction_types, } = useContext(Store);
    const [transaction, setTransaction] = useState<Transaction>(route.params);
    const [date, setDate] = useState(moment(transaction.date).format("YYYY-MM-DD HH:mm:ss"));
    const navigation = useNavigation();
    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    useFocusEffect(
        React.useCallback(() => {
            fetchTransaction();
        }, [transaction])
    )

    async function fetchTransaction() {
        console.log('manageTransaction', transaction)
    }

    async function updateTransaction() {
        try {
            await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transaction/${transaction.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
            navigation.navigate('ListTransactions');
        } catch (error) {
            console.error(error);
        }
    }

    function handleInputChange(field, value) {
        setTransaction({ ...transaction, [field]: value });
    }


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(moment(currentDate).format("YYYY-MM-DD HH:mm:ss"));
    };

    const showDatepicker = () => {
        handleInputChange('date', date)
        DateTimePickerAndroid.open({
            value: moment(date).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        });
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
                                value={moment(transaction.date).format("DD/MM/YYYY HH:mm:ss")}
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="calendar-today" />}
                                        size={5}
                                        ml={2}
                                        color="muted.400"
                                    />
                                }
                            />

                            {transaction?.destination_account ? (
                                <><FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Conta de destino</FormControl.Label><Input
                                    value={transaction.destination_account}
                                    onChangeText={(value) => handleInputChange('destination_account', value)} /></>
                            ) : null}

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Tipo</FormControl.Label>
                            <Select
                                selectedValue={transaction.type_id}
                                onValueChange={(value) => handleInputChange('type_id', value)}
                            >
                                {transaction_types ? transaction_types.map((type) => (
                                    <Select.Item key={type.id} label={type.type} value={type.id} />
                                )) : null}
                            </Select>

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Conta</FormControl.Label>
                            <Select
                                selectedValue={transaction.account_id}
                                onValueChange={(value) => handleInputChange('account_id', value)}
                            >
                                {accounts ? accounts.map((account) => (
                                    <Select.Item key={account.id} label={account.name} value={account.id} />
                                )) : null}
                            </Select>

                            <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Categoria</FormControl.Label>
                            <Select
                                selectedValue={transaction.category_id}
                                onValueChange={(value) => handleInputChange('category_id', value)}
                            >
                                {categories ? categories.map((category) => (
                                    <Select.Item key={category.id} label={category.name} value={category.id} />
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
