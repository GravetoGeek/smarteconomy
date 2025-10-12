import {useQuery} from '@apollo/client'
import {FontAwesome} from '@expo/vector-icons'
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker'
import {useFocusEffect,useNavigation} from "@react-navigation/native"
import moment from 'moment'
import {Box,Button,Center,FormControl,Icon,Input,ScrollView,Text,VStack} from "native-base"
import React,{useContext,useEffect,useState} from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import FloatingBottomMenu from '../../components/FloatingBottomMenu'
import Header from '../../components/Header'
import {Store} from '../../contexts/StoreProvider'
import {GET_USER_BY_ID} from '../../graphql/queries/users.queries'
import {useUpdateUser} from '../../hooks/users/useUpdateUser'
import {Profile} from '../../models'

// Gender constants (hardcoded since GraphQL doesn't have a dedicated endpoint)
const GENDER_OPTIONS=[
    {label: 'Masculino',value: '2',icon: () => <FontAwesome name="mars" size={18} color="black" />},
    {label: 'Feminino',value: '1',icon: () => <FontAwesome name="venus" size={18} color="black" />},
    {label: 'Fluído',value: '3',icon: () => <FontAwesome name="transgender" size={18} color="black" />},
]



export default function ManageProfile() {
    const {user,profile,setProfile}=useContext(Store)
    const [name,setName]=useState(profile?.name||'')
    const [lastname,setLastName]=useState(profile?.lastName||'')
    const [birthday,setBirthday]=useState(profile?.birthday==null? moment().format("YYYY-MM-DD"):moment(profile.birthday).format("YYYY-MM-DD"))
    const [monthly_income,setMonthly_income]=useState(profile?.monthly_income||'')
    const [profession,setProfession]=useState(profile?.profession||'')
    const [gender_id,setGender_id]=useState(profile?.gender_id? String(profile.gender_id):'')
    const [gender_items,setGender_items]=useState(GENDER_OPTIONS)
    const [open,setOpen]=useState(false)
    const navigation=useNavigation()

    // GraphQL query to fetch user data
    const {data: userData,loading: userLoading,refetch}=useQuery(GET_USER_BY_ID,{
        variables: {id: user?.id},
        skip: !user?.id,
    })

    // GraphQL mutation to update user
    const {updateUser,loading: updateLoading}=useUpdateUser()

    // Update form fields when user data is loaded
    useEffect(() => {
        if(userData?.userById) {
            const fetchedUser=userData.userById
            setName(fetchedUser.name||'')
            setLastName(fetchedUser.lastname||'')
            setBirthday(fetchedUser.birthdate? moment(fetchedUser.birthdate).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"))
            setGender_id(fetchedUser.genderId||'')
            // Note: monthly_income and profession are not in User type, they might be in a separate Profile
        }
    },[userData])


    const onChange=(event: any,selectedDate: any) => {
        const currentDate=selectedDate
        setBirthday(moment(currentDate).format("YYYY-MM-DD"))
    }


    const showDatepicker=() => {
        DateTimePickerAndroid.open({
            value: moment(birthday).toDate(),
            onChange,
            mode: "date",
            is24Hour: true,
        })
    }


    const submit=async () => {
        try {
            // Note: Backend requires password, but we're not changing it
            // This might need adjustment based on backend validation
            const result=await updateUser(user.id,{
                name,
                lastname,
                birthdate: birthday,
                genderId: gender_id,
                professionId: '1', // TODO: Map profession string to professionId
                password: 'unchanged', // Placeholder - backend should handle this
            })

            if(result?.success) {
                // Update local profile state if needed
                navigation.navigate('Dashboard' as never)
            }
        } catch(error) {
            console.error('Error updating profile:',error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if(refetch) {
                refetch()
            }
        },[refetch])
    )

    return (
        <Box bg="white" height='full'>
            <Header />
            <VStack width='full' paddingLeft={5} paddingRight={5}>

                <ScrollView>

                    <FormControl isRequired>

                        <Text fontSize="sm" fontWeight="bold">Gerenciar Perfil</Text>
                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Nome</FormControl.Label>
                        <Input placeholder="Nome" value={name} onChangeText={setName} InputLeftElement={<Icon
                            as={<FontAwesome name="user" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />


                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Sobrenome</FormControl.Label>
                        <Input placeholder="Sobrenome" value={lastname} onChangeText={setLastName} InputLeftElement={<Icon
                            as={<FontAwesome name="user" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />

                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Data de Nascimento</FormControl.Label>
                        <Input onPressIn={showDatepicker} placeholder="Data de Nascimento" value={moment(birthday).format("DD/MM/YYYY")} InputLeftElement={<Icon
                            as={<FontAwesome name="calendar" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />


                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Renda Mensal</FormControl.Label>
                        <Input placeholder="Renda Mensal" value={monthly_income} onChangeText={setMonthly_income} InputLeftElement={<Icon
                            as={<FontAwesome name="money" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />

                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}}>Profissão</FormControl.Label>
                        <Input placeholder="Profissão" value={profession} onChangeText={setProfession} InputLeftElement={<Icon
                            as={<FontAwesome name="briefcase" size={18} color="black" />}
                            size={5}
                            ml={2}
                            color="muted.400"
                        />} />
                        <FormControl.Label _text={{fontSize: 'sm',fontWeight: 'bold'}} >Gênero</FormControl.Label>
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



                        <Button
                            onPress={submit}
                            mt={3}
                            colorScheme="purple"
                            _text={{color: 'white'}}
                            isLoading={updateLoading||userLoading}
                            isDisabled={updateLoading||userLoading}
                        >
                            Atualizar
                        </Button>
                    </FormControl>


                </ScrollView>
            </VStack>
            <FloatingBottomMenu />
        </Box>

    )

}
