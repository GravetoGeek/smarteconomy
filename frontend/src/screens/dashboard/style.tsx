import { StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F5FCFF',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    label: {
      fontWeight: 'bold',
      marginRight: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 5,
      flex: 1,
    },
    balanceContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    balanceLabel: {
      fontWeight: 'bold',
      marginBottom: 10,
    },
    balance: {
      fontSize: 20,
    },
    button: {
      marginTop: 20,
      backgroundColor: 'blue',
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });