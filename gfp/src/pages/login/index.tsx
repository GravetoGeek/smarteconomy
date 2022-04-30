import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./style";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  function handleHome() {
    navigation.navigate("Home");
  }
  const submit = () => {
    const signData = JSON.stringify( { email, password } );
    if (email === "" || password === "") {
      alert("Preencha todos os campos");
    } else {
      console.log(email, password);

      fetch("http://192.168.1.11:8000/auth/login", {
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
            if(responseJson.auth) {
              alert("Login realizado com sucesso");
              handleHome();
            }
            // setEmail("");
            // setPassword("");
          }
        })
        .catch((error) => {
          console.error(error);
        }
        );
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}

      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={handleHome}
      >
        <Text style={styles.txtWhite}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={submit}
      >
        <Text style={styles.txtWhite}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}