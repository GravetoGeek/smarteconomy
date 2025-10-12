import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Box, Button, FormControl, Icon, Input, VStack } from "native-base";
import React, { useContext, useState, useEffect } from "react";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from "../../contexts/StoreProvider";
import { styles } from './style';
import { useGetAccountsByUser } from "../../hooks/accounts/useGetAccountsByUser";
import { useGetCategoriesByType } from "../../hooks/categories/useGetCategoriesByType";
import { useCreateTransaction } from "../../hooks/transactions/useCreateTransaction";

// Mapeamento de tipos de transação (mesmo padrão do backend)
const TRANSACTION_TYPES=[
    {id: 1, type: 'EXPENSE', label: 'Despesa'},
    {id: 2, type: 'INCOME', label: 'Receita'},
    {id: 3, type: 'TRANSFER', label: 'Transferência'}
]

const AddTransaction = () => {
    const { user, profile } = useContext(Store);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [selectedDestinationAccount, setSelectedDestinationAccount] = useState<string>("");
    const [type_id, setTypeId] = useState<number>(1); // 1 = EXPENSE por padrão
    const [date, setDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    const navigation = useNavigation();

    // GraphQL hooks
    const { accounts, loading: loadingAccounts } = useGetAccountsByUser(user?.id);
    const { categories, loading: loadingCategories, refetch: refetchCategories } = useGetCategoriesByType(
        TRANSACTION_TYPES.find(t => t.id === type_id)?.type || ''
    );
    const { createTransaction, loading: creatingTransaction } = useCreateTransaction();

    // Define conta padrão quando carregar
    useEffect(() => {
        if (accounts.length > 0 && !selectedAccount) {
            setSelectedAccount(accounts[0].id);
        }
    }, [accounts]);

    // Recarrega categorias ao mudar tipo
    useEffect(() => {
        const transactionType = TRANSACTION_TYPES.find(t => t.id === type_id)?.type;
        if (transactionType) {
            refetchCategories({ type: transactionType });
        }
    }, [type_id]);

    // Define categoria padrão quando carregar
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories]);

    function handleDashboard() {
        navigation.navigate('Dashboard');
    }

    const handleAddTransaction = async () => {
        try {
            const transactionType = TRANSACTION_TYPES.find(t => t.id === type_id)?.type;
            
            if (!transactionType) {
                console.error('Tipo de transação inválido');
                return;
            }

            // Remove campos undefined para não enviar
            const input: any = {
                amount: parseFloat(amount),
                description: description,
                type: transactionType as 'EXPENSE' | 'INCOME' | 'TRANSFER',
                accountId: selectedAccount,
                date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            };

            // Adiciona categoryId apenas se não for transferência
            if (type_id !== 3 && selectedCategory) {
                input.categoryId = selectedCategory;
            }

            // Adiciona destinationAccountId apenas se for transferência
            if (type_id === 3 && selectedDestinationAccount) {
                input.destinationAccountId = selectedDestinationAccount;
            }

            const result = await createTransaction(input);

            if (result) {
                console.log('Transação criada:', result.transaction.id);
                handleDashboard();
            }
        } catch (error) {
            console.error('Erro ao criar transação:', error);
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
            <VStack width="full" p="5">
                <Box>
                    <FormControl>
                        <FormControl.Label>Tipo de transação</FormControl.Label>
                        <Picker
                            style={styles.pickerTypeTransaction}
                            selectedValue={type_id}
                            onValueChange={(itemValue) => {
                                setTypeId(itemValue);
                                setSelectedCategory(""); // Limpa categoria ao mudar tipo
                            }}
                        >
                            {TRANSACTION_TYPES.map((type) => (
                                <Picker.Item key={type.id} label={type.label} value={type.id} />
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
                            <>
                                <FormControl.Label>Categoria</FormControl.Label>
                                <Picker
                                    style={styles.pickerCategoryTransaction}
                                    selectedValue={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    enabled={!loadingCategories}
                                >
                                    {categories.map((item) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.category}
                                            value={item.id}
                                        />
                                    ))}
                                </Picker>
                            </>
                        )}

                        <FormControl.Label>Conta de origem</FormControl.Label>
                        <Picker
                            style={styles.pickerAccountTransaction}
                            selectedValue={selectedAccount}
                            onValueChange={setSelectedAccount}
                            enabled={!loadingAccounts}
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
                            <>
                                <FormControl.Label>Conta de destino</FormControl.Label>
                                <Picker
                                    style={styles.pickerAccountTransaction}
                                    selectedValue={selectedDestinationAccount}
                                    onValueChange={setSelectedDestinationAccount}
                                    enabled={!loadingAccounts}
                                >
                                    {accounts
                                        .filter((item) => item.id !== selectedAccount)
                                        .map((item) => (
                                            <Picker.Item
                                                key={item.id}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        ))}
                                </Picker>
                            </>
                        )}

                        <FormControl.Label>Data da transação</FormControl.Label>
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
                    
                    <Button 
                        style={styles.btnAddTransaction} 
                        mt='5' 
                        colorScheme="purple" 
                        onPress={handleAddTransaction}
                        isLoading={creatingTransaction}
                        isDisabled={creatingTransaction || loadingAccounts || loadingCategories}
                    >
                        Adicionar transação
                    </Button>
                </Box>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    );
};

export default AddTransaction;