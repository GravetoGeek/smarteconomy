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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  function handleHome() {
    navigation.navigate("Home");
  }
  const submit = () => {
    const signData = JSON.stringify({ email, password });
    if (email === "" || password === "") {
      alert("Preencha todos os campos");
    } else {
      fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: signData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) {
            alert(responseJson.error);
          } else {
            console.log(responseJson);
            if (responseJson.auth) {
              alert("Login realizado com sucesso");
              handleHome();
            }
            // setEmail("");
            // setPassword("");
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
          <Button mt="7" colorScheme="purple" onPress={submit}>
            Entrar
          </Button>
          <HStack mt="5">
          <Checkbox value="agree">
            <Text ml="3">Concordo com a politica de segurança</Text>
          </Checkbox>
          
        </HStack>
        </Box>
        
      </VStack>
    </Center>
  );
}
