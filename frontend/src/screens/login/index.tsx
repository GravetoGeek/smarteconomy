import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import jwtDecode from 'jwt-decode';
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
} from "native-base";
import React, { useContext, useState } from "react";
import { Store } from "../../contexts/StoreProvider";
import { styles } from "./style";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../store/user/thunks";



export default function Login() {
    const { user, setUser, token, setToken } = useContext(Store);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigation = useNavigation();
    // const dispatch = useDispatch();

    function handleDashboard() {
        navigation.navigate('Dashboard');
    }
    function handleRegister() {
        navigation.navigate('Register');
    }
    const submit = async () => {
        const signData = JSON.stringify({ email, password });
        console.log('iniciando login', signData)
        if (email === '' || password === '') {
            alert("Preencha todos os campos");
        } else {
            let url = `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`;
            console.log('url', url)
            let result = await axios.post(url, signData, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                console.log('responseLogin', JSON.stringify(response, undefined, 2));

                //aqui usa-se o dispatch

                if (response.status === 200) {
                    let { access_token, auth, refresh_token } = response.data;
                    setToken({ access_token, auth, refresh_token });
                    const decodedToken = jwtDecode(access_token)
                    let { id, email, exp, iat } = decodedToken;
                    setUser({ id, email })

                    // console.log('decodedToken', decodedToken)



                    handleDashboard();
                }
            })
                .catch((error) => {
                    // console.log(JSON.stringify(error, undefined, 2));
                    // alert(error.response.status);
                    if ([404, 401].includes(error.response.status)) {
                        setErrors({ ...errors, emailOrPassword: "Email ou senha inválido" });
                    }
                    if (error.response.status === 408) {
                        setErrors({ ...errors, requestTimeout: "Tempo de requisição expirado." });
                    }
                });

            console.log(JSON.stringify(result, undefined, 2));
        }
    };
    return (
        <Box flex={1} bg="white">
            <Center height="full">
                <Image
                    size={150}
                    resizeMode="contain"
                    source={{ uri: 'https://github.com/gravetogeek.png' }}
                    alt="Foto do Usuário"
                />
                <VStack width={"full"} p="5">
                    <Box width="full">
                        <Heading color="coolGray.700">Entrar</Heading>

                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                                placeholder="seu@email.com"
                                onChangeText={(text) => setEmail(text)}
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
                        {'emailOrPassword' in errors ? (<Text color="red.500">{errors.emailOrPassword}</Text>) : null}
                        {'requestTimeout' in errors ? (<Text color="red.500">{errors.requestTimeout}</Text>) : null}
                        <Button mt="7" colorScheme="purple" onPress={submit}>
                            Entrar
                        </Button>
                        <Center>
                            <Text style={styles.txtLink} onPress={handleRegister} mt="7" color="muted.700" fontWeight={400}>Registrar</Text>
                        </Center>
                    </Box>

                </VStack>
            </Center>
        </Box>
    );
}
