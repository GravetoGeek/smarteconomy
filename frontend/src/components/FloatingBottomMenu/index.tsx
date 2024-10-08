import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Center, HStack, Icon, NativeBaseProvider, Pressable, Text, } from "native-base";
import React, { useContext } from "react";
import { Store } from '../../contexts/StoreProvider';


export default function FloatingBottomMenu() {
    const { bottomMenuSelected, setBottomMenuSelected } = useContext(Store)

    const navigation = useNavigation();

    function handleDashboard() {
        navigation.navigate("Dashboard");
    }
    const handleAddTransaction = () => {
        navigation.navigate('AddTransaction');
    }
    const handleAddAccount = () => {
        navigation.navigate('AddAccount');
    }
    const handleExtrato = () => {
        navigation.navigate('ListTransactions');
    }
    function handleManageProfile() {
        navigation.navigate("ManageProfile");
    }




    return (
        <Box bottom={0} position="absolute" bg="white" width="full">
            <HStack bg="#790ea3" alignItems="center" safeAreaBottom shadow={6}>

                <Pressable cursor="pointer" opacity={bottomMenuSelected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => {
                    setBottomMenuSelected(0)
                    handleDashboard()
                }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={bottomMenuSelected === 0 ? 'home' : 'home-outline'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Início
                        </Text>
                    </Center>
                </Pressable>


                <Pressable cursor="pointer" opacity={bottomMenuSelected === 1 ? 1 : 0.6} py="2" flex={1} onPress={() => {
                    setBottomMenuSelected(1)
                    handleAddTransaction()
                }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={bottomMenuSelected === 1 ? 'transfer' : 'transfer'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Transação
                        </Text>
                    </Center>
                </Pressable>


                <Pressable cursor="pointer" opacity={bottomMenuSelected === 2 ? 1 : 0.5} py="3" flex={1} onPress={() => {
                    setBottomMenuSelected(2)
                    handleAddAccount()
                }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={bottomMenuSelected === 2 ? 'wallet' : 'wallet'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Carteira
                        </Text>
                    </Center>
                </Pressable>


                <Pressable cursor="pointer" opacity={bottomMenuSelected === 3 ? 1 : 0.5} py="3" flex={1} onPress={() => {
                    setBottomMenuSelected(3)
                    handleExtrato()
                }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={bottomMenuSelected === 3 ? 'finance' : 'finance'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Extrato
                        </Text>
                    </Center>
                </Pressable>


                <Pressable cursor="pointer" opacity={bottomMenuSelected === 4 ? 1 : 0.5} py="2" flex={1} onPress={() => {
                    setBottomMenuSelected(4)
                    handleManageProfile()
                }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={bottomMenuSelected === 4 ? 'account' : 'account'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Perfil
                        </Text>
                    </Center>
                </Pressable>


            </HStack>
        </Box>
    )
}