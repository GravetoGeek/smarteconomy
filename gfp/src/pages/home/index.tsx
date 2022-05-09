import React from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { styles } from "./style";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate("Login");
  }
  function handleRegister() {
    navigation.navigate("Register");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*<Text style={styles.title}>Home</Text>*/}
      <TouchableOpacity style={styles.btnDefault} onPress={handleLogin}>
        <Text style={styles.txtWhite}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnDefault} onPress={handleRegister}>
        <Text style={styles.txtWhite}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
