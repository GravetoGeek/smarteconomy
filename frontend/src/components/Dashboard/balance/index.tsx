import { BACKEND_HOST, BACKEND_PORT } from '@env';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import moment from 'moment';
import { Box, Button, Center, Divider, HStack, Icon, Text, VStack } from "native-base";
import React, { useContext, useState } from "react";
import { Store } from "../../../contexts/StoreProvider";
import { Transaction } from '../../../models';

export default function Balance() {
    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    // const moeda = Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

    const {
        user,
        profile,
        setProfile,
        accounts,
        setAccounts,
        transactions,
        setTransactions,
        hoje,
        setHoje,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        despesaTotal,
        setDespesaTotal,
        receitaTotal,
        setReceitaTotal,
        mesAtual
    } = useContext(Store);

    const fetchData = async () => {
        try {

            const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transaction/filter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    startDate: startDate,
                    endDate: endDate
                })
            })




            setTransactions(transactions);
            let despesaTotal = 0;
            let receitaTotal = 0;
            transactions.forEach((transaction: any) => {
                if (transaction.type_id === 1) {
                    despesaTotal += transaction.amount
                }
                if (transaction.type_id === 2) {
                    receitaTotal += transaction.amount
                }
            })
            setDespesaTotal(despesaTotal);
            setReceitaTotal(receitaTotal);

        }
        catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
        }, [])
    )

    return (
        <Box bg="white" p={4} borderRadius={8} shadow={2}>
            <Center>
                <Text fontSize="lg" fontWeight="bold" mb={3}>Balanço de {mesAtual}</Text>
                <Divider my={2} />
                <VStack space={0} alignItems="center">
                    <HStack alignItems="center" space={3}>
                        {/* <FontAwesome name="balance-scale" size={24} color="black" /> */}
                        <Text fontSize="md">Saldo:</Text>
                        <Text fontSize="md" fontWeight="bold" color={(receitaTotal - despesaTotal) >= 0 ? 'green.500' : 'red.500'}>
                            {moeda.format(receitaTotal - despesaTotal)}
                        </Text>
                    </HStack>
                    <Divider my={2} />
                    <HStack alignItems="center" space={2}>
                        <HStack alignItems="center" space={1}>
                            <FontAwesome name="arrow-circle-up" size={24} color="green" />
                            <Text fontSize="sm">Receita:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.500">
                                {moeda.format(receitaTotal)}
                            </Text>
                        </HStack>
                        <HStack alignItems="center" space={1}>
                            <FontAwesome name="arrow-circle-down" size={24} color="red" />
                            <Text fontSize="sm">Despesa:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="red.500">
                                {moeda.format(despesaTotal)}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Center>
        </Box>
    )

}