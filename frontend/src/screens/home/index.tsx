import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, Button, Center, Checkbox, Heading, HStack, VStack,Text } from "native-base";

export default function Home() {
  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate("Login");
  }
  function handleRegister() {
    navigation.navigate("Register");
  }

  return (
    <Center height="full">
      <VStack width={"full"} p="5">
        <Box width="full">
          <Heading color="coolGray.700">Home</Heading>


          <Button mt="7" colorScheme="purple" onPress={handleLogin}>
            Entrar
          </Button>
          <HStack mt="5">


        </HStack>
          <Button mt="7" colorScheme="purple" onPress={handleRegister}>
            Registrar
          </Button>
        </Box>

      </VStack>
    </Center>

  )
}
