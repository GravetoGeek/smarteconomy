import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Box, Button, Center, FormControl, Icon, Input, Text, VStack } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Store } from '../../contexts/StoreProvider';

export default function AddAccount() {
    const { user, profile, setProfile, accounts, setAccounts } = useContext(Store);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type_id, setType_id] = useState<number | string>(1);
    const [profile_id, setProfile_id] = useState(profile.id);
    const [open, setOpen] = useState(false);
    const [items, setType_Items] = useState([
        { label: 'Outra', value: '1', icon: () => <FontAwesome name="mars" size={18} color="black" /> },
    ])


    const navigation = useNavigation();

    const handleNavigateDashboard = () => {
        navigation.navigate('Dashboard');
    }

    const fetchData = async () => {
        const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/accounttypes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });


        const data = await response.json();
        let itemList = data.map((item: any) => {
            return {
                label: item.type, value: item.id, icon: () => <MaterialIcons name="account-balance" size={18} color="black" />
            }
        })
        setType_Items(itemList)
    }

    const submit = async () => {
        try {
            const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    type_id: Number(type_id),
                    profile_id: Number(profile_id)
                })
            })
            if (response.status === 200) {
                const data = await response.json();
                setAccounts([...accounts, data])
                // console.log('accounts', accounts)
                handleNavigateDashboard()

            }

        } catch (error) {
            console.log('error_addAcount', error)
        }
    }


    useEffect(() => {
        fetchData();
    }, []);


    return (
        <Box height="full" flex={1} bg='white'>
            <Header />
            <VStack width='full' p={5} flex={1}>
                <Center>
                    <Text>Adicionar Conta</Text>
                    <FormControl isRequired>
                        <FormControl.Label>Nome</FormControl.Label>
                        <Input
                            placeholder="Nome"
                            onChangeText={(value) => setName(value)}
                            value={name}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="account-balance" />}
                                    size="sm"
                                    ml="2"
                                />
                            }
                        />

                        <FormControl.Label>Descrição</FormControl.Label>
                        <Input
                            placeholder="Descrição"
                            onChangeText={(value) => setDescription(value)}
                            value={description}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="description" />}
                                    size="sm"
                                    ml="2"
                                />
                            }
                        />

                        <FormControl.Label>Tipo</FormControl.Label>
                        <DropDownPicker
                            mode='SIMPLE'
                            dropDownDirection="TOP"
                            closeAfterSelecting={true}
                            itemSeparator={false}
                            listMode="SCROLLVIEW"
                            modalAnimationType="slide"
                            language="PT"
                            items={items}
                            open={open}
                            value={type_id}
                            setOpen={setOpen}
                            setValue={setType_id}
                            setItems={setType_Items}
                            containerStyle={{ height: 40 }}
                            onSelectItem={item => setType_id(String(item.value))}
                        />


                        <Button onPress={submit} mt={4} colorScheme="purple" _text={{ color: 'white' }}>
                            Adicionar
                        </Button>


                    </FormControl>
                </Center>
            </VStack>
            <FloatingBottomMenu />
        </Box>
    )

}
