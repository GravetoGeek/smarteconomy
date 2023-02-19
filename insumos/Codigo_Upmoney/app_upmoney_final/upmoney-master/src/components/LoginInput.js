import React from 'react'
import { View, TextInput, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    return(
        <View style={styles.includesInputs}>
            <Icon name={props.icon} size={20} style={styles.icon}></Icon>
            <TextInput {...props} style={styles.input}></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({

    includesInputs:{
      display: 'flex',
      marginTop: 50,
    },
  
    input:{
      width: 300,
      height: 45,
      backgroundColor: '#4F4F4F',
      color: '#E8E8E8',
      borderRadius: 8,
      padding: 12,
    },

    icon: {
        color: '#333',
        marginLeft: 8
    },

  
  });
  