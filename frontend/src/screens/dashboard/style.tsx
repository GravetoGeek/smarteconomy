import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollViewContent: {
    marginBottom: 20, // Ajuste esse valor conforme o tamanho da sua barra inferior
  },
  bottomBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});