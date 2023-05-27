import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import { Box, Button, Center, FormControl, Icon, Input, VStack } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, } from "react-native";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from "../../contexts/StoreProvider";
import { Account, Category, Transaction, TransactionTypes } from "../../models";
import { styles } from './style';



const AddTransaction = () => {
    const { user, profile, categories, accounts, account_types, transaction_types, setCategories, setAccounts, setAccountTypes, setTransactionTypes } = useContext(Store);
    const locale = "pt-BR";
    const timeZone = "America/Sao_Paulo";
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
    const [selectedDestinationAccount, setselectedDestinationAccount] = useState<number | null>(null);
    const [type_id, setTypeId] = useState<number>(1);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
    const [errors, setErrors] = useState<Transaction>({} as Transaction);

    const navigation = useNavigation();
    function handleDashboard() {
        navigation.navigate('Dashboard');
    }


    const validateFields = (): boolean => {
        const newErrors: typeof errors = {};

        if (!type_id) {
            newErrors.type_id = 'Por favor, selecione um tipo de transação.';
        }

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Por favor, insira um valor válido maior que zero.';
        }

        if (!description || description.trim().length > 200) {
            newErrors.description = 'Por favor, insira uma descrição válida com no máximo 200 caracteres.';
        }

        if (!selectedCategory) {
            newErrors.selectedCategory = 'Por favor, selecione uma categoria.';
        }

        if (!selectedAccount) {
            newErrors.selectedAccount = 'Por favor, selecione uma conta.';
        }

        if (type_id === 3 && !selectedDestinationAccount) {
            newErrors.selectedDestinationAccount = 'Por favor, selecione uma conta de destino.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);


    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {


            // Obter as contas
            const res_accounts = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/account/byProfile/${profile?.id}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
            setAccounts(res_accounts);
            setSelectedAccount(res_accounts[0].id);

            // Obter os tipos de contas
            const res_accountTypes = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/accounttypes`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
            setAccountTypes(res_accountTypes);

            // // Obter os tipos de transações
            // const res_transactionTypes = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transactiontypes`, {
            //     method: 'get',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // }).then((response) => response.json())
            // setTransactionTypes(res_transactionTypes);
            // setTypeId(res_transactionTypes[0].id);


            // Obter as categorias
            const res_categories = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/category/filter`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionType: type_id,
                })
            }).then((response) => response.json())
            setCategories(res_categories);
            // setSelectedCategory(res_categories[0].id);


        } catch (error) {
            console.log('error_addTransaction', error)
            console.error(error)
            return error
        }
    };

    const handleSelectType = async (itemValue: number) => {
        // Obter as categorias
        const res_categories = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/category/filter`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionType: itemValue,
            })
        }).then((response) => response.json())

        setCategories(res_categories);
        console.log('res_categories', res_categories)
    };


    const handleAddTransaction = async () => {
        // if (!validateFields()) return
        try {
            const newTransaction: Transaction = {
                amount: parseFloat(amount),
                description: description,
                type_id: type_id,
                date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                destination_account: type_id !== 3 ? null : selectedDestinationAccount,
                account_id: selectedAccount,
                category_id: selectedCategory,
            };

            const response = await axios.post(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/transaction`,
                newTransaction
            )

            handleDashboard()
        } catch (error) {
            console.log('AddTransaction2', error);
        }
    };



    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(moment(currentDate).format("YYYY-MM-DD HH:mm:ss"));
    };

    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: moment(date).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        });
    };

    return (
        <Box flex={1} bg='white'>
            <Header />
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            > */}

            <VStack width="full" p="5">
                {/* <Box height="500px"> */}
                <Box>
                    <FormControl>

                        <FormControl.Label>Tipo de transação</FormControl.Label>
                        <Picker

                            style={styles.pickerTypeTransaction}
                            selectedValue={type_id}
                            onValueChange={(itemValue, itemIndex) => {
                                setTypeId(itemValue)
                                handleSelectType(itemValue)
                            }}
                        >
                            {transaction_types?.map((type: TransactionTypes) => (
                                <Picker.Item key={type.id} label={type.type} value={type.id} />
                            ))}
                        </Picker>

                        <FormControl.Label>Valor da transação</FormControl.Label>
                        <Input
                            placeholder="Valor"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            InputLeftElement={
                                <Icon
                                    as={<FontAwesome5 name="coins" size={5} color="black" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                        <FormControl.Label>Descrição da transação</FormControl.Label>
                        <Input
                            placeholder="Descrição"
                            value={description}
                            onChangeText={setDescription}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="description" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />

                        {type_id !== 3 && (
                            <Picker
                                style={styles.pickerCategoryTransaction}
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedCategory(itemValue)
                                }
                            >
                                {categories?.map((item: Category) => (
                                    <Picker.Item
                                        key={item.id}
                                        label={item.category}
                                        value={item.id}
                                    />
                                ))}
                            </Picker>
                        )}

                        <Picker

                            style={styles.pickerAccountTransaction}
                            selectedValue={selectedAccount}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedAccount(itemValue)
                            }
                            }
                        >
                            {accounts.map((item: Account) => (

                                < Picker.Item
                                    key={item.id}
                                    label={item.name}
                                    value={item.id}
                                />
                            ))}
                        </Picker>

                        {type_id === 3 && accounts.length === 1 && (
                            <Picker
                                style={styles.pickerAccountTransaction}
                                selectedValue={selectedDestinationAccount}
                                onValueChange={(itemValue, itemIndex) =>
                                    setselectedDestinationAccount(itemValue)
                                }
                            >
                                {
                                    accounts?.map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.id}
                                        />
                                    ))
                                }
                            </Picker>
                        )}

                        {type_id === 3 && accounts.length > 1 && (
                            <Picker
                                style={styles.pickerAccountTransaction}
                                selectedValue={selectedDestinationAccount}
                                onValueChange={(itemValue, itemIndex) =>
                                    setselectedDestinationAccount(itemValue)
                                }
                            >
                                {accounts.length > 1 && (
                                    accounts?.filter((item) => item.id !== selectedAccount).map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.id}
                                        />
                                    ))
                                )}



                            </Picker>
                        )}




                        <Input
                            onPressIn={showDatepicker}
                            value={moment(date).format("DD/MM/YYYY HH:mm:ss")}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="calendar-today" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                    </FormControl>
                    <Button style={styles.btnAddTransaction} mt='5' colorScheme="purple" onPress={handleAddTransaction}>Adicionar transação</Button>
                </Box >
            </VStack>


            {/* </KeyboardAvoidingView > */}
            <FloatingBottomMenu />
        </Box>
    );
};

export default AddTransaction;
