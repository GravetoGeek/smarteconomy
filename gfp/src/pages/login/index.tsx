import React, {useState} from "react";
import {View, Text,TextInput, TouchableOpacity} from "react-native";
import { styles } from "./style";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sendData = (email:string,password:string) => {
    console.clear()
    console.log("Enviando dados...");
    console.log("Email: " + email);
    console.log("Senha: " + password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} onChangeText={email=>setEmail(email)} placeholder="Email" />
        <TextInput style={styles.input} onChangeText={password=>setPassword(password)} secureTextEntry={true} placeholder="Senha" />
        
        <TouchableOpacity style={styles.btnLogin} onPress={()=>sendData(email,password)}>
          <Text style={styles.txtWhite}>Cadastrar</Text>
        </TouchableOpacity>
    </View>
  );
}

