import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Center,
  Heading,
  Input,
  FormControl,
  VStack,
  Icon,
  Button,
  Checkbox,
  HStack,
  Text,
  Image,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_HOST, BACKEND_PORT } from "react-native-dotenv";
import { styles } from "./style";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  function handleDashboard() {
    navigation.navigate("Dashboard");
  }
  function handleRegister() {
    navigation.navigate("Register");
  }
  const submit = async () => {
    const signData = JSON.stringify({ email, password });
    console.log('iniciando login',signData)
    if (email === "" || password === "") {
      alert("Preencha todos os campos");
    } else {
      let url = `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`;
      let result = await axios.post(url, signData, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log(JSON.stringify(response,undefined,2));

        

        if (response.status === 200) {
          handleDashboard();
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error,undefined,2));
        // alert(error.response.status);
        if([404,401].includes(error.response.status)){
          setErrors({ ...errors, emailOrPassword: "Email ou senha inválido" });
        }
        if(error.response.status === 408){
          setErrors({ ...errors, requestTimeout: "Tempo de requisição expirado." });
        }
      });

      console.log(JSON.stringify(result,undefined,2));
    }
  };
  return (
    <Center height="full">
      <Image
      size={150}
      resizeMode="contain"
      source={{uri:'https://github.com/gravetogeek.png'}}
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
          {'emailOrPassword' in errors ? ( <Text color="red.500">{errors.emailOrPassword}</Text> ) : null}
          {'requestTimeout' in errors ? ( <Text color="red.500">{errors.requestTimeout}</Text> ) : null}
          <Button mt="7" colorScheme="purple" onPress={submit}>
            Entrar
          </Button>
          <Center>
          <Text style={styles.txtLink} onPress={handleRegister} mt="7" color="muted.700" fontWeight={400}>Registrar</Text>
          </Center>
        </Box>
        
      </VStack>
    </Center>
  );
}
