import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Avatar, Box, Center, Divider, HStack, Icon, List, ScrollView, Spacer, Spinner, Text, VStack } from "native-base";
import React, { useContext, useState } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import CategoryIcon from "../../components/Dashboard/Icons/CategoryIcon";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Icons } from "../../components/Icons/Icons";
import { Store } from "../../contexts/StoreProvider";
import { Category, Transaction, TransactionTypes } from "../../models";

const ListTransactions = ({ route }) => {
    const { setTransactionTypes, user, setUser, token, setToken, profile, setProfile, startDate, endDate, transactions, setTransactions, receitaTotal, categories, setCategories, despesaTotal, transaction_types } = useContext(Store);
    // const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    useFocusEffect(
        React.useCallback(() => {
            fetchTransactions();
            fetchCategories();
            fetchTransactionTypes
        }, [])
    );


    const fetchTransactions = async () => {
        try {
            const responseTransacion = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transaction/filter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profileId: profile.id,
                    startDate: startDate,
                    endDate: endDate
                }),
            }).then((response) => response.json());
            responseTransacion.sort((a, b) => (a.date < b.date) ? 1 : -1);
            setTransactions(responseTransacion);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const responseCategories = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/category`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());
            setCategories(responseCategories);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransactionTypes = async () => {
        try {
            const responseTransactionTypes = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transactiontypes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());
            setTransactionTypes(responseTransactionTypes);
        } catch (error) {
            console.error(error);
        }
    };


    function handleManageTransaction(item: Transaction): void {
        let { id, amount, destination_account, description, date, type_id, account_id, category_id } = item;
        let transaction: Transaction = { id, amount, destination_account, description, date, type_id, account_id, category_id };

        navigation.navigate('ManageTransaction', transaction);
    }

    return (
        <Box flex={1} bg="white">
            <Header />
            <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Transações</Text>
            <VStack mb={100} >
                <ScrollView height="85%">
                    {isLoading ? (
                        <Center flex={1}>
                            <Spinner />
                        </Center>
                    ) : (
                        transactions.map((transacao: Transaction, index) => (
                            <TouchableOpacity key={index} onPress={() => handleManageTransaction(transacao)}>
                                <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                                    <HStack space={2} alignItems="center" divider={<Divider />}>

                                        <CategoryIcon color={Icons.filter((icone) => icone.category == categories.filter((categoria: Category) => transacao.category_id == categoria.id)[0]?.category)[0]?.color} category={categories.filter((categoria: Category) => transacao.category_id == categoria.id)[0]?.category} size={5} />

                                        <VStack flex={1} space={2} alignItems="center">
                                            <HStack space={2} alignItems="center">
                                                <Text color={Icons.filter((icone) => icone.category == categories.filter((categoria: Category) => transacao.category_id == categoria.id)[0]?.category)[0]?.color} >{categories.filter((categoria: Category) => transacao.category_id == categoria.id)[0]?.category}</Text>
                                                <Spacer />
                                                <Text color={transacao.type_id == 1 ? "red.500" : (transacao.type_id == 2 ? "green.500" : "gray.500")}>{transaction_types.filter((item: TransactionTypes) => item.id == transacao.type_id)[0].type}</Text>
                                            </HStack>
                                            <HStack space={2} alignItems="center">
                                                <Text color="gray.500">{moment(transacao.date).format('DD/MM/YYYY')}</Text>
                                                <Spacer />
                                                <Text bold color="gray.500">{transacao.type_id == 1 ? (100 * transacao.amount / despesaTotal).toFixed(2) : (transacao.type_id == 2 ? (100 * transacao.amount / receitaTotal).toFixed(2) : "")}%    {moeda.format(transacao.amount)}</Text>
                                            </HStack>
                                            <Divider />
                                            <Text bold color="black">{transacao.description}</Text>
                                        </VStack>
                                    </HStack>

                                </List>
                            </TouchableOpacity>
                        )))
                    }
                </ScrollView>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    );
};


export default ListTransactions;