import React from "react";
import {Text, Image, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import { styles } from "./style";
import { useNavigation } from "@react-navigation/native";




export default function Home() {
  const navigation = useNavigation();

function handleLogin() {
  navigation.navigate("Login");
}

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    
    >
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={handleLogin}
      >
        <Text style={styles.txtWhite}>Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

