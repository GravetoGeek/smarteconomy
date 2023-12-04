import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Error, ButtonBlue, ButtonText } from '../../components/Components';
import { TouchableOpacity } from 'react-native-gesture-handler';

import api from '../../components/Api';

import { ErrorMessage, Formik } from 'formik';
import { showSuccess } from '../../common'
import * as yup from 'yup';

const ReviewSchema = yup.object({
    email: yup.string()
        .required('Este campo é obrigatório.')
        .email('O campo precisar ser um e-mail.')

});


export default class Form extends Component {

    handleSignInPress = async (values) => {

        try {

            const response = await api.put('/usuario/recuperar', {
                email: values.email
            });

            showSuccess('E-mail Enviado! Verifique a caixa de SPAM')

            this.props.navigation.navigate('Login');

        } catch (err) {
            alert(err);
        }


    }

    render() {

        return (
            <View>
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View>


                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                autoCapitalize={'none'}
                                keyboardType={'email-address'}
                                autoCompleteType={'email'}
                                onChangeText={props.handleChange('email')}
                                onBlur={props.handleBlur('email')}
                                value={props.values.email}
                            />

                            <ErrorMessage style={styles.error} component={Text} name="email" />

                            <TouchableOpacity style={styles.includesButton} onPress={props.handleSubmit}>
                                <ButtonBlue>
                                    <ButtonText>ENVIAR</ButtonText>
                                </ButtonBlue>
                            </TouchableOpacity>

                        </View>
                    )}

                </Formik>
            </View>
        )

    }

}


const styles = StyleSheet.create({

    input: {
        fontFamily: 'Roboto-Medium',
        height: 44,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        color: '#042C5C',
        fontSize: 12,
        lineHeight: 14,
        shadowRadius: 2,
        elevation: 2,
    },


    includesButton: {
        display: 'flex',
        marginTop: 36,
    },

    error: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },

});

