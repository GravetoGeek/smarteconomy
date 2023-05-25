import { BACKEND_HOST, BACKEND_PORT } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from 'axios';
import moment from 'moment';
import { Box, Button, Center, FormControl, Icon, Input, ScrollView, Text, VStack } from "native-base";
import React, { useContext, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import FloatingBottomMenu from '../../components/FloatingBottomMenu';
import Header from '../../components/Header';
import { Store } from '../../contexts/StoreProvider';
import { Profile } from '../../models';



export default function ManageProfile() {
    const { user, profile, setProfile } = useContext(Store);
    const [name, setName] = useState(profile.name);
    const [lastname, setLastName] = useState(profile.lastName);
    const [birthday, setBirthday] = useState(profile?.birthday == null ? moment().format("YYYY-MM-DD") : moment(profile.birthday).format("YYYY-MM-DD"));
    const [monthly_income, setMonthly_income] = useState(profile.monthly_income);
    const [profession, setProfession] = useState(profile.profession);
    const [gender_id, setGender_id] = useState(profile.gender_id)
    const [gender_items, setGender_items] = useState([
        { label: 'Masculino', value: '2', icon: () => <FontAwesome name="mars" size={18} color="black" /> },
        { label: 'Feminino', value: '1', icon: () => <FontAwesome name="venus" size={18} color="black" /> },
        { label: 'Fluído', value: '3', icon: () => <FontAwesome name="transgender" size={18} color="black" /> },
    ]);
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setBirthday(moment(currentDate).format("YYYY-MM-DD"));
    };


    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: moment(birthday).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        });
    };


    const submit = async () => {
        const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/profile/${profile.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                lastname,
                birthday,
                monthly_income,
                profession,
                gender_id: Number(gender_id),
                user_id: user.id
            })
        }).then(res => res.json())

        if (response) {
            setProfile(response)
            navigation.navigate('Dashboard')
        }
    }

    const fetchProfile = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        try {
            const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/profile/byUser/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())

            if (response) {
                setName(response.name)
                setLastName(response.lastname)
                setBirthday(response?.birthday == null ? moment().format("YYYY-MM-DD") : moment(response.birthday).format("YYYY-MM-DD"))
                setMonthly_income(response.monthly_income)
                setProfession(response.profession)
                setGender_id(String(response.gender_id))
                setProfile(response)
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error in fetchProfile:', error);
            }
        }

        return () => {
            abortController.abort();
        };
    }


    useFocusEffect(
        React.useCallback(() => {
            const cleanup = fetchProfile();
            return async () => {
                (await cleanup)();
            };
        }, [])
    );

    return (
        <Box bg="white" height='full'>
            <Header />
            <VStack width='full' paddingLeft={5} paddingRight={5}>

                <ScrollView>

                    <FormControl isRequired>

                        <Text fontSize="sm" fontWeight="bold">Gerenciar Perfil</Text>
                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Nome</FormControl.Label>
                        <Input placeholder="Nome" value={name} onChangeText={setName} InputLeftElement={<Icon
                            as={<FontAwesome name="user" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />


                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Sobrenome</FormControl.Label>
                        <Input placeholder="Sobrenome" value={lastname} onChangeText={setLastName} InputLeftElement={<Icon
                            as={<FontAwesome name="user" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />

                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Data de Nascimento</FormControl.Label>
                        <Input onPressIn={showDatepicker} placeholder="Data de Nascimento" value={moment(birthday).format("DD/MM/YYYY")} InputLeftElement={<Icon
                            as={<FontAwesome name="calendar" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />


                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Renda Mensal</FormControl.Label>
                        <Input placeholder="Renda Mensal" value={monthly_income} onChangeText={setMonthly_income} InputLeftElement={<Icon
                            as={<FontAwesome name="money" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />

                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }}>Profissão</FormControl.Label>
                        <Input placeholder="Profissão" value={profession} onChangeText={setProfession} InputLeftElement={<Icon
                            as={<FontAwesome name="briefcase" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />
                        <FormControl.Label _text={{ fontSize: 'sm', fontWeight: 'bold' }} >Gênero</FormControl.Label>
                        <DropDownPicker
                            mode='SIMPLE'
                            dropDownDirection="TOP"
                            closeAfterSelecting={true}
                            itemSeparator={false}
                            listMode="SCROLLVIEW"
                            modalAnimationType="slide"
                            language="PT"
                            items={gender_items}
                            open={open}
                            value={gender_id}
                            setOpen={setOpen}
                            setValue={setGender_id}
                            setItems={setGender_items}
                            placeholder="Selecione o gênero"
                            onSelectItem={item => setGender_id(String(item.value))}
                        />



                        <Button onPress={submit} mt={3} colorScheme="purple" _text={{ color: 'white' }}>Atualizar</Button>
                    </FormControl>


                </ScrollView>
            </VStack>
            <FloatingBottomMenu />
        </Box>

    )

}