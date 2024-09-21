import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import moment from "moment";
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
import cover from '../../assets/cover.png';
import { Store } from "../../contexts/StoreProvider";
import { Account, Category, Gender, Profile, Transaction, User } from "../../models";
import { styles } from "./style";

// import { useDispatch } from "react-redux";
// import { setUser } from "../../store/user/thunks";



export default function Login() {
    const { user, setUser, token, setToken, setProfile } = useContext(Store);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    // let hoje = moment().format('YYYY-MM-DD')

    // setHoje(hoje)
    // setStartDate(moment(hoje).startOf('month').format('YYYY-MM-DD'));
    // setEndDate(moment(hoje).endOf('month').format('YYYY-MM-DD'));
    // setMesAtual(meses[moment(hoje).month()]?.month)

    const navigation = useNavigation();
    // const dispatch = useDispatch();

    function handleDashboard() {
        navigation.navigate('Dashboard');
    }
    function handleRegister() {
        navigation.navigate('Register');
    }


    const submit = async () => {
        if (!email || !password) {
            alert("Preencha todos os campos");
            return;
        }

        const url = `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`;
        const signData = JSON.stringify({ email, password });

        try {
            const loginResponse = await fetch(url, {
                method: 'POST',
                body: signData,
                headers: { "Content-Type": "application/json" },
            });

            // if (!loginResponse.ok) {
            //     throw new Error('Erro no Login');
            // }


            const { access_token, auth, refresh_token } = await loginResponse.json();

            setToken({ access_token, auth, refresh_token });

            const { id, email, exp, iat } = jwtDecode(access_token);
            setUser({ id, email });

            let profileResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/profile/byUser/${id}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
            })

            if (!profileResponse.ok) {
                throw new Error('Erro ao buscar perfil');
            }

            profileResponse = await profileResponse.json();


            setProfile(profileResponse);

            handleDashboard();

        } catch (error) {
            console.log(error);
            const status = error.response ? error.response.status : 500;

            if ([404, 401].includes(status)) {
                setErrors({ ...errors, emailOrPassword: "Email ou senha inválido" });
            } else if (status === 408) {
                setErrors({ ...errors, requestTimeout: "Tempo de requisição expirado." });
            } else {
                setErrors({ ...errors, unknown: "Um erro desconhecido ocorreu." });
            }
        }
    };


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
