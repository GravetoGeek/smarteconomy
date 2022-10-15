import React, { Component } from 'react';
import { ButtonBlue, ButtonText } from '../../components/Components';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import api from '../../components/Api';
import Form from './form';

import AsyncStorage from '@react-native-community/async-storage'


export default class Cadastro extends Component {

    state = {
        usuarioLogado: false
    }

    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)
        } catch (e) {
            //sem usuário válido
        }

        if (dadosUsuario) {
            this.setState({
                usuarioLogado: true,
            })
        }
    }

    render() {

        const logout = () => {
            console.log(`Entrei no sair`)
            delete api.defaults.headers.common['Authorization']
            AsyncStorage.removeItem('dadosUsuario')
            AsyncStorage.removeItem('tokenUsuario')


            this.props.navigation.navigate('Login')
        }

        return (
            <View style={styles.body}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{this.props.navigation.state.routeName}</Text>
                    {this.state.usuarioLogado &&
                        <TouchableOpacity style={styles.exitButton} onPress={logout}>
                            <ButtonText style={{ color: "#FFF" }}>SAIR</ButtonText>
                        </TouchableOpacity>
                    }
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                    <Form navigation={this.props.navigation}/>

                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({


    headerContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    body: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    exitButton: {
        width: '20%',
        height: 40,
        padding: 10,
        backgroundColor: '#c61f1f',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10
    },
    includesButton: {
        marginTop: 16,
        marginLeft: 50,
        marginRight: 50,
    },

    content: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingBottom: 20,
        shadowRadius: 20,
        elevation: 50,
    },

    title: {
        color: '#414040',
        fontFamily: 'Roboto-Black',
        height: 30,
        fontSize: 25,
        marginBottom: 20,
        paddingLeft: 10,
    }


})