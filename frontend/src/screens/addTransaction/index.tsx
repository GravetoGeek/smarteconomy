import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import { Box, Button, Center, FormControl, Icon, Input, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, } from "react-native";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import { Transaction } from "../../models";
import { styles } from './style';



const AddTransaction = () => {
    const locale = "pt-BR";
    const timeZone = "America/Sao_Paulo";
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(0);
    const [selectedDestinationAccount, setselectedDestinationAccount] = useState<number | null>(null);
    const [type_id, setTypeId] = useState(0);
    const [types, setTypes] = useState([]);
    const [accountTypes, setAccountTypes] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Obter as categorias
            const responseCategories = await axios.get(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/category`
            );

            console.log(responseCategories.data);
            setCategories(responseCategories.data);

            // Obter as contas
            const responseAccounts = await axios.get(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/account`
            );

            console.log(responseAccounts.data);
            setAccounts(responseAccounts.data);

            // Obter os tipos de contas
            const responseAccountTypes = await axios.get(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/accounttypes`
            );

            console.log(responseAccountTypes.data);
            setAccountTypes(responseAccountTypes.data);

            // Obter os tipos de transações
            const responseTransactionTypes = await axios.get(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/transactiontypes`
            );

            console.log(responseTransactionTypes.data);
            setTypes(responseTransactionTypes.data);

        } catch (error) {
            console.error(error)
        }
    };

    const handleAddTransaction = async () => {
        if (!validateFields()) return
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

            console.log('transaction:', newTransaction)
            const response = await axios.post(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/transaction`,
                newTransaction
            )

            console.log(response.data);
            handleDashboard()
        } catch (error) {
            console.error(error);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <Center height="full">
                    <VStack width="full" p="5">
                        <Box height="500px">
                            <FormControl>
                                <FormControl.Label>Tipo de transação</FormControl.Label>
                                <Picker
                                    style={styles.pickerTypeTransaction}
                                    selectedValue={type_id}
                                    onValueChange={(itemValue, itemIndex) => setTypeId(itemValue)}
                                >
                                    {types.map((type: any) => (
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


                                <Picker
                                    style={styles.pickerCategoryTransaction}
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedCategory(itemValue)
                                    }
                                >
                                    {categories.map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.category}
                                            value={item.id}
                                        />
                                    ))}
                                </Picker>

                                <Picker
                                    style={styles.pickerAccountTransaction}
                                    selectedValue={selectedAccount}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedAccount(itemValue)
                                    }
                                >
                                    {accounts.map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.id}
                                        />
                                    ))}
                                </Picker>

                                {type_id === 3 && (
                                    <Picker
                                        style={styles.pickerAccountTransaction}
                                        selectedValue={selectedDestinationAccount}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setselectedDestinationAccount(itemValue)
                                        }
                                    >
                                        {accounts.filter((item) => item.id !== selectedAccount).map((item) => (
                                            <Picker.Item
                                                key={item.id}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        ))}
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
                            <Button style={styles.btnAddTransaction} colorScheme="purple" onPress={handleAddTransaction}>Adicionar transação</Button>
                        </Box >
                    </VStack>
                </Center >
            </ScrollView>
            <FloatingBottomMenu />
        </KeyboardAvoidingView >
    );
};

export default AddTransaction;
