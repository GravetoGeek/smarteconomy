import React, { Component } from 'react'
import {
    View, 
    ActivityIndicator,
    StyleSheet
} from 'react-native'

import axios from 'axios'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage'

export default class LoginOuDash extends Component {

    async componentDidMount() {
        const tokenUsuarioJson = await AsyncStorage.getItem('tokenUsuario')
        let tokenUsuario = null
        SplashScreen.hide();
        
        try{
            tokenUsuario = JSON.parse(tokenUsuarioJson)
        }catch(e) {
            //token inválido
        }

        if(tokenUsuario && tokenUsuario.authorization) {
            axios.defaults.headers.common['Authorization'] = `${tokenUsuario.authorization}`
            this.props.navigation.navigate('Dashboard', tokenUsuario)

        } else {
            this.props.navigation.navigate('Login')
        }
        
        
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})
