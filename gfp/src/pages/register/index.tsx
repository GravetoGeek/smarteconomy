import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./style";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_HOST, BACKEND_PORT } from "react-native-dotenv";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const navigation = useNavigation();

  function handleHome() {
    navigation.navigate("Home");
  }
  const submit = () => {
    const user = { email, password, username, name, lastName, phone }
    const signData = JSON.stringify({user});
    if (email === "" || password === "" || username === "" || name === "" || lastName === "" || phone === "") {
      alert("Preencha todos os campos");
    }
    else {
      if (password === confirmPassword) {
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
              handleHome();
            }
            // setEmail("");
            // setPassword("");
            // setUsername("");
            // setName("");
            // setLastName("");
            // setPhone("");
          }
        })
        .catch((error) => {
          console.error(error);
        }
        );
      }
      else {
        alert("As senhas não conferem");
      }
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        onChangeText={(text) => setPhone(text)}
        value={phone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <TouchableOpacity style={styles.btnRegister} onPress={submit}>
        <Text style={styles.txtWhite}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}