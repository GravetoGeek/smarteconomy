import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment";
import { Box, Button, Center, FormControl, Input, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Transaction } from "../../models";


const AddTransaction = () => {
    const locale = "pt-BR";
    const timeZone = "America/Sao_Paulo";

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(0);
    const [selectedDestinationAccount, setselectedDestinationAccount] = useState<number | null>(null);
    const [type, setType] = useState("");
    const [accountTypes, setAccountTypes] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);



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
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddTransaction = async () => {
        try {
            const newTransaction: Transaction = {
                amount: parseFloat(amount),
                description: description,
                type: type,
                date: moment(date).valueOf(),
                destination_account: type !== "Transferência" ? null : selectedDestinationAccount,
                account_id: selectedAccount,
                category_id: selectedCategory,
            };

            console.log('transaction:', newTransaction)
            const response = await axios.post(
                `http://${BACKEND_HOST}:${BACKEND_PORT}/transaction`,
                newTransaction
            )

            console.log(response.data);
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
        <Center height="full">
            <VStack width="full">
                <Box height="full">

                    <FormControl>
                        <FormControl.Label>Adicionar transação</FormControl.Label>


                        <Picker
                            selectedValue={type}
                            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                        >
                            <Picker.Item label="Renda" value="Renda" />
                            <Picker.Item label="Despesa" value="Despesa" />
                            <Picker.Item label="Transferência" value="Transferência" />
                        </Picker>

                        <TextInput
                            placeholder="Valor"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Descrição"
                            value={description}
                            onChangeText={setDescription}
                        />


                        <Picker
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

                        {type === "Transferência" && (
                            <Picker
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


                        <Input onPressIn={showDatepicker} value={moment(date).format("DD/MM/YYYY HH:mm:ss")} />

                    </FormControl>
                    <Button onPress={handleAddTransaction}>Adicionar transação</Button>


                </Box >
            </VStack>
        </Center >
    );
};

export default AddTransaction;
