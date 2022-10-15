import React, { Component } from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Form from './form';
// import Container from '../../components/Container'
import { Container } from '../../components/Components';


export default class Login extends Component {
  render() {
    return (

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}
      >
        <ImageBackground source={require('../../assets/imgs/background_login.png')} style={styles.container}>
          <View style={{marginBottom:40}}>
            <View style={styles.margin}>
              <Form navigation={this.props.navigation} />
            </View>
          </View>
            {/* <Text onPress={this.rotaTeste} style={styles.textLogin, styles.textGreen}>Rota</Text> */}
          </ImageBackground>
      </KeyboardAvoidingView>

    )
  }
}


const styles = StyleSheet.create({

  body: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center'
  },

  margin:{
    paddingTop:'60%',
  },

  container: {
    width:'100%',
    height:'100%',
    resizeMode: "cover",
    justifyContent: "center",
    alignItems:'center'
  },
});


