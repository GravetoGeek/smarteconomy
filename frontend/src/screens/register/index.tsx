import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_HOST, BACKEND_PORT } from "react-native-dotenv";
import {
  Box,
  Button,
  Center,
  FormControl,
  Icon,
  Input,
  VStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  function handleHome() {
    navigation.navigate("Home");
  }
  function handleDashboard() {
    navigation.navigate("Dashboard");
  }

  const validate = () => {
    let emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    if (!formData?.email) {
      setErrors({ ...errors, required: "Email é obrigatório" });
      return false;
    }
    if (!emailRegex.test(formData?.email)) {
      setErrors({ ...errors, invalid: "Email inválido" });
      return false;
    }
    if (!formData?.password) {
      setErrors({ ...errors, password: "Senha é obrigatória" });
      return false;
    }
    if (formData?.password?.length < 8) {
      setErrors({
        ...errors,
        password_length: "Senha deve ter no mínimo 8 caracteres",
      });
      return false;
    }
    if (!formData?.confirm_password) {
      setErrors({
        ...errors,
        confirm_password: "Confirmação de senha é obrigatória",
      });
      return false;
    }
    if (formData?.confirm_password?.length < 8) {
      setErrors({
        ...errors,
        confirm_password_length:
          "Confirmação de senha deve ter no mínimo 8 caracteres",
      });
      return false;
    }
    if (formData?.password != formData?.confirm_password) {
      console.log("deu certo");
      setErrors({ ...errors, diferent: "Senhas não conferem" });
      return false;
    }
    return true;
  };

  const submit = () => {
    delete errors?.required;
    delete errors?.invalid;
    delete errors?.password;
    delete errors?.password_length;
    delete errors?.confirm_password;
    delete errors?.confirm_password_length;
    delete errors?.diferent;

    if (validate()) {
      delete formData.confirm_password;
      const signData = JSON.stringify(formData);
      fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/auth/signup`, {
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
              alert("Cadastro realizado com sucesso");
              handleDashboard();
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      console.log(formData);
    } else {
      console.log("errors", errors);
    }
  };
  return (
    <Box height="full">
      <VStack width="full" p="5">
        <FormControl
          pb="2"
          isRequired
          isInvalid={"required" in errors || "invalid" in errors}
          width="full"
        >
          <FormControl.Label>Email</FormControl.Label>
          <Input
            placeholder="exemplo@exemplo.com"
            value={formData?.email}
            onChangeText={(text) => setData({ ...formData, email: text })}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml={2}
                color="muted.400"
              />
            }
          />
          {"required" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.required}
            </FormControl.ErrorMessage>
          ) : null}
          {"invalid" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.invalid}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>

        <FormControl
          pt="2"
          pb="2"
          isRequired
          isInvalid={"password" in errors || "password_length" in errors}
          width="full"
        >
          <FormControl.Label>Senha</FormControl.Label>
          <Input
            placeholder="Senha"
            value={formData?.password}
            onChangeText={(text) => setData({ ...formData, password: text })}
            type={showPassword ? "text" : "password"}
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
                    name={showPassword ? "visibility" : "visibility-off"}
                  />
                }
                size={5}
                mr="2"
                color="muted.400"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {"password" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.password}
            </FormControl.ErrorMessage>
          ) : null}
          {"password_length" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.password_length}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>

        <FormControl
          pt="2"
          pb="2"
          isRequired
          isInvalid={
            "confirm_password" in errors ||
            "confirm_password_length" in errors ||
            "diferent" in errors
          }
          width="full"
        >
          <FormControl.Label>Confirmar Senha</FormControl.Label>
          <Input
            placeholder="Confirmar Senha"
            value={formData?.confirm_password}
            onChangeText={(text) =>
              setData({ ...formData, confirm_password: text })
            }
            type={showConfirmPassword ? "text" : "password"}
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
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                  />
                }
                size={5}
                mr="2"
                color="muted.400"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {"confirm_password" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.confirm_password}
            </FormControl.ErrorMessage>
          ) : null}
          {"confirm_password_length" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.confirm_password_length}
            </FormControl.ErrorMessage>
          ) : null}
          {"diferent" in errors ? (
            <FormControl.ErrorMessage>
              {errors?.diferent}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>

        <Button colorScheme="purple" onPress={submit}>
          Cadastrar
        </Button>
      </VStack>
    </Box>
  );
}
