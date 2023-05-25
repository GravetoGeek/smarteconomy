import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Box, Button, Divider, HStack, Spacer, Text, VStack } from "native-base";
import React, { useContext, useState } from "react";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from "../../contexts/StoreProvider";


export default function ManageTransaction({ route }) {
    const { profile, setProfile } = useContext(Store);

    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const { id, amount, destination_account, description, date, type_id, account_id, category_id } = route.params;
    const transaction = { id, amount, destination_account, description, date, type_id, account_id, category_id }
    useFocusEffect(
        React.useCallback(() => {
            fetchTransaction();
        }, [transaction])
    )

    function fetchTransaction() {
        console.log('manageTransaction', transaction)
    }

    return (
        <Box flex={1} bg="white">
            <Header />
            <Text>Gerenciar transação</Text>
            <VStack width="full">
                <Text bold>{transaction.description}</Text>
                <Text fontSize="xs" color="gray.500">
                    {moeda.format(transaction.amount)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                    {moment(transaction.date).format("DD/MM/YYYY")}
                </Text>

                <Text fontSize="xs" color="gray.500">
                    {transaction.destination_account}
                </Text>

                <Text fontSize="xs" color="gray.500">
                    {transaction.type_id}
                </Text>

                <Text fontSize="xs" color="gray.500">
                    {transaction.account_id}
                </Text>

                <Text fontSize="xs" color="gray.500">
                    {transaction.category_id}
                </Text>

                <Button onPress={() => { console.log('editar') }} colorScheme="purple" >Editar</Button>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    )
}


