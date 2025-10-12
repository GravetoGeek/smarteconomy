import {MaterialIcons} from "@expo/vector-icons"
import {useNavigation} from "@react-navigation/native"
import {
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    Icon,
    Image,
    Input,
    Text,
    VStack
} from "native-base"
import React,{useContext,useState} from "react"
import cover from '../../assets/cover.png'
import {Store} from "../../contexts/StoreProvider"
import {useLogin} from "../../hooks/auth/useLogin"
import {styles} from "./style"



export default function Login() {
    const {setUser,setToken,setProfile}=useContext(Store)
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [errorMessage,setErrorMessage]=useState("")

    const {login,loading,error}=useLogin()
    const navigation=useNavigation()

    function handleDashboard() {
        navigation.navigate('Dashboard')
    }

    function handleRegister() {
        navigation.navigate('Register')
    }

    const submit=async () => {
        if(!email||!password) {
            setErrorMessage("Preencha todos os campos")
            return
        }

        setErrorMessage("")

        try {
            const user=await login({email,password})

            if(user) {
                setUser(user)
                handleDashboard()
            } else {
                setErrorMessage("Email ou senha inválidos")
            }
        } catch(err) {
            console.error('[Login] Error:',err)
            setErrorMessage("Erro ao fazer login. Tente novamente.")
        }
    }


    return (

        <Box flex={1} bg="white">
            <Center height="full">
                <VStack width={"full"} p="5">
                    <Box width="full" height="40%" alignItems="center" justifyContent="center">
                        <Image
                            size={"full"}
                            resizeMode="contain"
                            source={cover}
                            alt="Smart Economy"
                        />
                    </Box>
                    <Box width="full">

                        <Heading color="coolGray.700">Entrar</Heading>

                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                                placeholder="seu@email.com"
                                onChangeText={(text) => setEmail(text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="person" />}
                                        size={5}
                                        ml={2}
                                        color="muted.400"
                                    />
                                }
                            />
                            <FormControl.Label>Senha</FormControl.Label>
                            <Input
                                secureTextEntry={true}
                                placeholder="sua senha"
                                onChangeText={(text) => setPassword(text)}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="password"
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="lock" />}
                                        size={5}
                                        ml={2}
                                        color="muted.400"
                                    />
                                }
                            />
                        </FormControl>

                        {errorMessage? (<Text color="red.500" mt="2">{errorMessage}</Text>):null}
                        {error? (<Text color="red.500" mt="2">{error.message}</Text>):null}

                        <Button mt="7" colorScheme="purple" onPress={submit} isLoading={loading}>
                            Entrar
                        </Button>
                        <Center>
                            <Text style={styles.txtLink} onPress={handleRegister} mt="7" color="muted.700" fontWeight={400}>Registrar</Text>
                        </Center>
                    </Box>

                </VStack>
            </Center>
        </Box>
    )
}
