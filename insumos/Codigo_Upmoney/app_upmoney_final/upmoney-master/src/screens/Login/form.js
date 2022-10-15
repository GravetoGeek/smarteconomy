import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ButtonBlue, ButtonText } from '../../components/Components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'

import api from '../../components/Api';

import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';

const ReviewSchema = yup.object({
    usuario: yup.string()
        .required('Este campo é obrigatório.')
        .email('O campo precisa ser um e-mail'),

    senha: yup.string()
        .required('Este campo é obrigatório.'),
});



export default class Form extends Component {
    constructor(props) {
        super(props);
        this.cadastro = this.cadastro.bind(this);
        this.recuperarSenha = this.recuperarSenha.bind(this);
    }

    cadastro() {
        // Keyboard.dismiss();
        this.props.navigation.navigate('Cadastro');
    }

    recuperarSenha() {
    // Keyboard.dismiss();
    this.props.navigation.navigate('RecuperarSenha');
    }


    handleSignInPress = async (values, {setSubmitting}) =>{
        console.log(`Email: ${values.usuario}`)
        console.log(`Senha: ${values.senha}`)

        try{
            const response = await api.post('login',{
                // email: 'ligia@gmail.com',
                // senha:'123456'
                email: values.usuario,
                senha: values.senha,
            });


            AsyncStorage.setItem('dadosUsuario', JSON.stringify(response.data))
            AsyncStorage.setItem('tokenUsuario', JSON.stringify(response.headers))

            api.defaults.headers.Authorization = response.headers.authorization
            
            console.log(`Dados Usuário: ${JSON.stringify(response.data)}`)
            
            this.props.navigation.navigate('Dashboard', response.data)
            

        }catch(err){
            Alert.alert("ERRO", err.response.data.erro);
            setSubmitting(false);
            console.log(values.isSubmitting)
        }
    }


    render() {

        return (
            <View>
                <Formik
                    initialValues={{ usuario: '', senha: '' }}
                    validationSchema={ReviewSchema}
                    onSubmit={(values,{setSubmitting}) => this.handleSignInPress(values,{setSubmitting})
                    }
                >

                    {(props) => (
                        <View>
                            {props.isSubmitting && <ActivityIndicator/>}
                            {!props.isSubmitting &&
                                <View>
                                    <View style={styles.includesInputs}>

                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'none'}
                                            keyboardType={'email-address'}
                                            autoCompleteType={'email'}
                                            placeholder="E-mail"
                                            onChangeText={props.handleChange('usuario')}
                                            onBlur={props.handleBlur('usuario')}
                                            value={props.values.usuario}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="usuario" />

                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'none'}
                                            placeholder="Senha"
                                            secureTextEntry={true}
                                            onChangeText={props.handleChange('senha')}
                                            onBlur={props.handleBlur('senha')}
                                            value={props.values.senha}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="senha" />

                                    </View>

                                    <TouchableOpacity style={styles.includesButton} onPress={props.handleSubmit}>
                                        <ButtonBlue>
                                            <ButtonText>ENTRAR</ButtonText>
                                        </ButtonBlue>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Text onPress={this.recuperarSenha} style={styles.textSenha}>Recuperar Senha</Text>
                                    </TouchableOpacity>

                                    <View style={styles.includesText}>
                                        <Text style={styles.textLogin}>Não tem uma conta? </Text><Text onPress={this.cadastro} style={styles.textLogin, styles.textGreen}>Cadastre-se</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    )}

                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    includesInputs: {
        display: 'flex',
        marginTop: 50,
    },

    input: {
        fontFamily: 'Roboto-Medium',
        width: 300,
        height: 45,
        backgroundColor: '#FFF',
        color: '#4F4F4F',
        borderRadius: 8,
        marginTop: 16,
        padding: 12,
    },


    includesButton: {
        display: 'flex',
        marginTop: 16,
    },

    error:{
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },

    textSenha: {
        color: '#232735',
        marginTop: 30,
        marginBottom: 30,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        textAlign: 'center'
    },

    includesText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },

    textLogin: {
        color: '#232735',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
    },

    textGreen: {
        color: '#33407F',
        fontFamily: 'Roboto-Black',
        fontWeight:'bold',
        fontSize: 17,
        fontWeight: '700',
    }


});

