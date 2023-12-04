import { useNavigation } from "@react-navigation/native";
import { Box, Button, Center, Checkbox, HStack, Heading, Image, Text, VStack, } from "native-base";
import React from "react";
import cover from '../../assets/cover.png';

export default function Home() {
  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate("Login");
  }
  function handleRegister() {
    navigation.navigate("Register");
  }

  return (
    <Box width="full">
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
          {/*<Heading color="coolGray.700">Home</Heading>*/}


          <Button mt="7" colorScheme="purple" onPress={handleLogin}>
            Entrar
          </Button>
          <HStack mt="5">


          </HStack>
          <Button mt="7" colorScheme="purple" onPress={handleRegister}>
            Registrar
          </Button>


        </VStack>
      </Center>
    </Box >

  )
}
