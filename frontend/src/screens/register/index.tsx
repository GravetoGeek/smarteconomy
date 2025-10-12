import {useQuery} from "@apollo/client"
import {MaterialIcons} from "@expo/vector-icons"
import {useNavigation} from "@react-navigation/native"
import {
    Box,
    Button,
    CheckIcon,
    FormControl,
    Icon,
    Image,
    Input,
    ScrollView,
    Select,
    VStack,
} from "native-base"
import React,{useState} from "react"
import cover from '../../assets/cover.png'
import {GET_GENDERS,GET_PROFESSIONS} from "../../graphql/queries/lookup.queries"
import {useSignup} from "../../hooks/auth/useSignup"

export default function Register() {
    const navigation=useNavigation()
    const {signup,loading,error}=useSignup()

    // Buscar genders e professions
    const {data: gendersData,loading: gendersLoading}=useQuery(GET_GENDERS)
    const {data: professionsData,loading: professionsLoading}=useQuery(GET_PROFESSIONS)

    const [formData,setData]=useState({
        email: '',
        password: '',
        confirm_password: '',
        name: '',
        lastname: '',
        birthdate: '',
        genderId: '',
        professionId: '',
    })
    const [errors,setErrors]=useState<any>({})
    const [showPassword,setShowPassword]=useState(false)
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)

    function handleDashboard() {
        navigation.navigate("Dashboard" as never)
    }

    const validate=() => {
        let emailRegex=/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
        const newErrors: any={}

        if(!formData.email) {
            newErrors.email="Email é obrigatório"
        } else if(!emailRegex.test(formData.email)) {
            newErrors.email="Email inválido"
        }

        if(!formData.name) {
            newErrors.name="Nome é obrigatório"
        }

        if(!formData.lastname) {
            newErrors.lastname="Sobrenome é obrigatório"
        }

        if(!formData.birthdate) {
            newErrors.birthdate="Data de nascimento é obrigatória"
        }

        if(!formData.genderId) {
            newErrors.genderId="Gênero é obrigatório"
        }

        if(!formData.professionId) {
            newErrors.professionId="Profissão é obrigatória"
        }

        if(!formData.password) {
            newErrors.password="Senha é obrigatória"
        } else if(formData.password.length<8) {
            newErrors.password="Senha deve ter no mínimo 8 caracteres"
        }

        if(!formData.confirm_password) {
            newErrors.confirm_password="Confirmação de senha é obrigatória"
        } else if(formData.confirm_password.length<8) {
            newErrors.confirm_password="Confirmação de senha deve ter no mínimo 8 caracteres"
        }

        if(formData.password!==formData.confirm_password) {
            newErrors.confirm_password="Senhas não conferem"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length===0
    }

    const submit=async () => {
        if(validate()) {
            const {confirm_password,...signupData}=formData

            const result=await signup(signupData)

            if(result) {
                handleDashboard()
            }
        }
    }
    return (
        <ScrollView>
            <Box height="full" pb="10">
                <VStack width="full" p="5">
                    <Box width="full" height="200" alignItems="center" justifyContent="center">
                        <Image
                            size={"full"}
                            resizeMode="contain"
                            source={cover}
                            alt="Smart Economy"
                        />
                    </Box>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"name" in errors}
                        width="full"
                    >
                        <FormControl.Label>Nome</FormControl.Label>
                        <Input
                            placeholder="Seu nome"
                            value={formData.name}
                            onChangeText={(text) => setData({...formData,name: text})}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="person" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                        {errors.name&&(
                            <FormControl.ErrorMessage>
                                {errors.name}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"lastname" in errors}
                        width="full"
                    >
                        <FormControl.Label>Sobrenome</FormControl.Label>
                        <Input
                            placeholder="Seu sobrenome"
                            value={formData.lastname}
                            onChangeText={(text) => setData({...formData,lastname: text})}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="person" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                        {errors.lastname&&(
                            <FormControl.ErrorMessage>
                                {errors.lastname}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"email" in errors}
                        width="full"
                    >
                        <FormControl.Label>Email</FormControl.Label>
                        <Input
                            placeholder="exemplo@exemplo.com"
                            value={formData.email}
                            onChangeText={(text) => setData({...formData,email: text})}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="email" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                        {errors.email&&(
                            <FormControl.ErrorMessage>
                                {errors.email}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"birthdate" in errors}
                        width="full"
                    >
                        <FormControl.Label>Data de Nascimento</FormControl.Label>
                        <Input
                            placeholder="AAAA-MM-DD (ex: 1990-01-15)"
                            value={formData.birthdate}
                            onChangeText={(text) => setData({...formData,birthdate: text})}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="calendar-today" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                        />
                        {errors.birthdate&&(
                            <FormControl.ErrorMessage>
                                {errors.birthdate}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"genderId" in errors}
                        width="full"
                    >
                        <FormControl.Label>Gênero</FormControl.Label>
                        <Select
                            selectedValue={formData.genderId}
                            minWidth="200"
                            accessibilityLabel="Escolha seu gênero"
                            placeholder="Escolha seu gênero"
                            _selectedItem={{
                                bg: "purple.600",
                                endIcon: <CheckIcon size="5" />
                            }}
                            onValueChange={(itemValue) => setData({...formData,genderId: itemValue})}
                        >
                            {gendersData?.genders?.map((gender: any) => (
                                <Select.Item key={gender.id} label={gender.gender} value={gender.id} />
                            ))}
                        </Select>
                        {errors.genderId&&(
                            <FormControl.ErrorMessage>
                                {errors.genderId}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pb="2"
                        isRequired
                        isInvalid={"professionId" in errors}
                        width="full"
                    >
                        <FormControl.Label>Profissão</FormControl.Label>
                        <Select
                            selectedValue={formData.professionId}
                            minWidth="200"
                            accessibilityLabel="Escolha sua profissão"
                            placeholder="Escolha sua profissão"
                            _selectedItem={{
                                bg: "purple.600",
                                endIcon: <CheckIcon size="5" />
                            }}
                            onValueChange={(itemValue) => setData({...formData,professionId: itemValue})}
                        >
                            {professionsData?.professions?.map((profession: any) => (
                                <Select.Item key={profession.id} label={profession.profession} value={profession.id} />
                            ))}
                        </Select>
                        {errors.professionId&&(
                            <FormControl.ErrorMessage>
                                {errors.professionId}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pt="2"
                        pb="2"
                        isRequired
                        isInvalid={"password" in errors}
                        width="full"
                    >
                        <FormControl.Label>Senha</FormControl.Label>
                        <Input
                            placeholder="Senha (mínimo 8 caracteres)"
                            value={formData.password}
                            onChangeText={(text) => setData({...formData,password: text})}
                            type={showPassword? "text":"password"}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="lock" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                            InputRightElement={
                                <Icon
                                    as={
                                        <MaterialIcons
                                            name={showPassword? "visibility":"visibility-off"}
                                        />
                                    }
                                    size={5}
                                    mr="2"
                                    color="muted.400"
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                        {errors.password&&(
                            <FormControl.ErrorMessage>
                                {errors.password}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    <FormControl
                        pt="2"
                        pb="2"
                        isRequired
                        isInvalid={"confirm_password" in errors}
                        width="full"
                    >
                        <FormControl.Label>Confirmar Senha</FormControl.Label>
                        <Input
                            placeholder="Confirmar Senha"
                            value={formData.confirm_password}
                            onChangeText={(text) =>
                                setData({...formData,confirm_password: text})
                            }
                            type={showConfirmPassword? "text":"password"}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="lock" />}
                                    size={5}
                                    ml={2}
                                    color="muted.400"
                                />
                            }
                            InputRightElement={
                                <Icon
                                    as={
                                        <MaterialIcons
                                            name={showConfirmPassword? "visibility":"visibility-off"}
                                        />
                                    }
                                    size={5}
                                    mr="2"
                                    color="muted.400"
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                        />
                        {errors.confirm_password&&(
                            <FormControl.ErrorMessage>
                                {errors.confirm_password}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>

                    {error&&(
                        <Box bg="red.100" p="3" mb="3" borderRadius="md">
                            <FormControl.ErrorMessage>
                                {error}
                            </FormControl.ErrorMessage>
                        </Box>
                    )}

                    <Button
                        colorScheme="purple"
                        onPress={submit}
                        isLoading={loading}
                        isLoadingText="Cadastrando..."
                        isDisabled={gendersLoading||professionsLoading}
                    >
                        Cadastrar
                    </Button>
                </VStack>
            </Box>
        </ScrollView>
    )
}
