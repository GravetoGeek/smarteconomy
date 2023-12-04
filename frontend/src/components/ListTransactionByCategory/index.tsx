import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Box, Center, Divider, HStack, Icon, List, Spacer, Spinner, Text, VStack } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Store } from "../../contexts/StoreProvider";
import CategoryIcon from "../Dashboard/Icons/CategoryIcon";
import FloatingBottomMenu from "../FloatingBottomMenu";
import Header from "../Header";

const ListTransactionByCategory = ({ route }) => {
    const { user, setUser, token, setToken, profile, setProfile, startDate, endDate, transactions, setTransactions, receitaTotal, categories } = useContext(Store);
    // const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });


    const { x, y, category, id, color, iconName } = route.params;

    useEffect(() => {
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
                        endDate: endDate,
                        categoryId: id,
                    }),
                }).then((response) => response.json());
                setTransactions(responseTransacion);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransactions();
    }, [category]);

    const renderItem = ({ item }) => (
        <Box>
            <Divider />

            <HStack space={3} alignItems="center" my={2} divider={<Divider />}>
                <Icon as={MaterialIcons} name={iconName} size={5} color={color} />
                <VStack>
                    <Text bold>{item.description}</Text>

                    <Text fontSize="xs" color="gray.500">
                        {moeda.format(item.amount)}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );

    return (
        <Box flex={1} bg="white" height="full" width="full">
            <Header />
            <Center>


                <Text fontSize="xl" mb={4} bold>
                    {category}
                </Text>
            </Center>
            <Box p={4}>
                <VStack space={3} mb={4} divider={<Divider />}>
                    {isLoading ? (
                        <Center flex={1}>
                            <Spinner />
                        </Center>
                    ) : (


                        <FlatList
                            data={transactions}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                        />

                    )}

                </VStack>
            </Box>
            <FloatingBottomMenu />
        </Box>
    );
};

export default ListTransactionByCategory;
