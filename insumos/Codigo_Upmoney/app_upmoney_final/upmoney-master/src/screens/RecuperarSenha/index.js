import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { Container } from '../../components/Components';
import Form from './form';


export default class RecuperarSenha extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (

            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.select({
                    ios: 'padding',
                    android: null,
                })}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Esqueceu a Senha?</Text>
                    <Text style={styles.textSenha}>Insira o e-mail vinculado à essa conta:</Text>

                    <Form navigation={this.props.navigation} />

                </View>
            </KeyboardAvoidingView>
        )
    }
}



const styles = StyleSheet.create({

    body: {
        flex: 1,
        backgroundColor: '#FAFBFC',
        justifyContent: 'center',
    },

    container:{
        paddingLeft: 25,
        paddingRight: 25,
    },

    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 25,
        lineHeight: 29,
        fontWeight: 'bold',
    },

    textSenha: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 19,
        paddingTop: 20,
        paddingBottom: 10,
        color: '#787575',
    }


});

