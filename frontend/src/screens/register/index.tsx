import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import {
  Box,
  Button,
  FormControl,
  Icon,
  Image,
  Input,
  VStack,
} from "native-base";
import React, { useContext, useState } from "react";
import cover from '../../assets/cover.png';
import { Store } from "../../contexts/StoreProvider";

export default function Register() {
  const { user, setUser, token, setToken } = useContext(Store);
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
  function handleAddTransaction() {
    navigation.navigate("AddTransaction");
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
        .then(async (responseJson) => {
          if (responseJson.error) {
            alert(responseJson.error);
          } else {
            if (responseJson.auth) {
              alert("Cadastro realizado com sucesso");
              let url = `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/login`;
              let result = await axios.post(url, signData, {
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((response) => {

                //aqui usa-se o dispatch

                if (response.status === 200) {
                  let { access_token, auth, refresh_token } = response.data;
                  setToken({ access_token, auth, refresh_token });
                  const decodedToken = jwtDecode(access_token)
                  let { id, email, exp, iat } = decodedToken;
                  setUser({ id, email })
                  handleDashboard()
                }
              }
              ).catch((error) => {
                console.log('error_register', error);
              }
              );
            }
          }

        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("error_register2", errors);
    }
  };
  return (
    <Box height="full">
      <VStack width="full" p="5">
        <Box width="full" height="40%" alignItems="center" justifyContent="center">
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
