import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Switch, Modal, TouchableOpacity, Picker } from 'react-native';
import { ButtonBlue, ButtonText } from '../../components/Components';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { FlatList } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-community/async-storage'


import api from '../../components/Api';
import { showSuccess } from '../../common'

import { ErrorMessage, Formik, Field } from 'formik';
import * as yup from 'yup';



const ReviewSchema = yup.object({

    nomeCompleto: yup.string()
        .required('Este campo é obrigatório.')
        .min(3, 'Este campo requer mais de 3 caracteres.'),

    email: yup.string()
        .required('Este campo é obrigatório.')
        .email('O campo precisa ser um e-mail'),

    genero: yup.string()
        .required('Este campo é obrigatório.'),

    dtNascimento: yup.string()
        .required('Este campo é obrigatório.'),

    senha: yup.string()
        .when('apresentaCampos', {
            is: true,
            then: yup.string()
                .required('Este campo é obrigatório.')
        }),
        

    senhaAtual: yup.string()
        .when('novoUsuario', {
            is: false,
            then: yup.string()
                .required('Este campo é obrigatório.')
        }),

    confirmSenha: yup.string()
        .when('apresentaCampos', {
            is: true,
            then: yup.string()
                .required('Este campo é obrigatório.')
                .oneOf([yup.ref('senha'), null], 'As senhas devem ser iguais'),
        }),


});

export default class Form extends Component {


    state = {

        modalAvatar: false,

        listaAvatares: []

    }

    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null
        let listaAvatares = []

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)

            response = await api.get(`usuario/avatar`)

            listaAvatares = response.data

        } catch (e) {
            //sem usuário válido
        }

        if (dadosUsuario) {
            this.setState({
                nomeCompleto: dadosUsuario.nomeCompleto, dtNascimento: dadosUsuario.dtNascimento, genero: dadosUsuario.genero, email: dadosUsuario.email, avatar: dadosUsuario.foto, listaAvatares: listaAvatares,
                senha: '', confirmSenha: '', senhaAtual: '', novoUsuario: false, id: dadosUsuario.id, apresentaCampos: false, mostraSwitch: true
            })
        } else {
            this.setState({
                nomeCompleto: '', dtNascimento: '', genero: '', email: '', avatar: `http://upmoney.ddns.net:8082/upmoney/images/users/avatar_01.jpg`, listaAvatares: listaAvatares,
                senha: '', confirmSenha: '', novoUsuario: true, apresentaCampos: true, mostraSwitch: false
            })
        }
    }



    handleSignInPress = async (values) => {

        let response

        console.log(`ID: ${this.state.id}`)
        console.log(`Foto: ${values.avatar}`)
        console.log(`Nome Completo: ${values.nomeCompleto}`)
        console.log(`E-mail: ${values.email}`)
        console.log(`Genero: ${values.genero}`)
        console.log(`Data de Nascimento: ${values.dtNascimento}`)

        if (this.state.novoUsuario) {

            try {

                response = await api.post('usuario/inserir', {
                    foto: values.avatar,
                    nomeCompleto: values.nomeCompleto,
                    email: values.email,
                    genero: values.genero,
                    dtNascimento: values.dtNascimento,
                    senha: values.senha,
                });

                showSuccess('Usuário Cadastrado!')

                this.props.navigation.navigate('Login');

            } catch (err) {
                alert(err);
            }
        } else {
            try {

                response = await api.put('usuario/alterar', {
                    id: this.state.id,
                    foto: values.avatar,
                    nomeCompleto: values.nomeCompleto,
                    email: values.email,
                    genero: values.genero,
                    dtNascimento: values.dtNascimento
                });

                console.log(JSON.stringify(response.data))

                AsyncStorage.setItem('dadosUsuario', JSON.stringify(response.data))

                if (values.apresentaCampos) {

                    console.log(`Senha Atual: ${values.senhaAtual}`)
                    console.log(`Nova Senha: ${values.senha}`)

                    response = await api.put('usuario/alterarSenha', {

                        senhaAtual: values.senhaAtual,
                        novaSenha: values.senha,
                        confirmaSenha: values.confirmSenha

                    });

                }

                showSuccess('Alteração realizada!')

                this.props.navigation.navigate('Dashboard');


            } catch (err) {
                alert(err);
            }

        }
    }


    render() {

        const { nomeCompleto, avatar, modalAvatar, listaAvatares, email, genero, dtNascimento, senha, confirmSenha, apresentaCampos, senhaAtual, mostraSwitch } = this.state

        return (
            <View>


                <Formik
                    initialValues={{ nomeCompleto: nomeCompleto, email: email, avatar: avatar, modalAvatar: modalAvatar, listaAvatares: listaAvatares, genero: genero, dtNascimento: dtNascimento, senha: senha, senhaAtual: senhaAtual, confirmSenha: confirmSenha, apresentaCampos: apresentaCampos, mostraSwitch: mostraSwitch }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View style={styles.content}>

                            <View style={styles.includesImage}>
                                <TouchableOpacity onPress={() => this.setState({
                                    modalAvatar: true,
                                })}>

                                    <Image style={styles.image} source={{ uri: props.values.avatar }} />

                                </TouchableOpacity>

                            </View>

                            {console.log(props.values.avatar)}

                            <View style={styles.includesInputs}>

                                <Text style={styles.label}>Nome Completo</Text>

                                <TextInput
                                    style={styles.input}
                                    autoCapitalize={'words'}
                                    autoCompleteType={'name'}
                                    onChangeText={props.handleChange('nomeCompleto')}
                                    onBlur={props.handleBlur('nomeCompleto')}
                                    value={props.values.nomeCompleto}
                                />

                                <ErrorMessage style={styles.error} component={Text} name="nomeCompleto" />


                                <Text style={styles.label}>E-mail</Text>

                                <TextInput
                                    style={styles.input}
                                    autoCapitalize={'none'}
                                    autoCompleteType={'email'}
                                    keyboardType={"email-address"}
                                    onChangeText={props.handleChange('email')}
                                    onBlur={props.handleBlur('email')}
                                    value={props.values.email}
                                />

                                <ErrorMessage style={styles.error} component={Text} name="email" />

                                <View style={[styles.flex, styles.flexRow, styles.spaceBetween]}>

                                    <View style={{ width: '47%' }}>
                                        <Text style={styles.label}>Gênero</Text>

                                        <View style={styles.pickerView}>
                                            <Picker
                                                style={styles.picker}
                                                selectedValue={props.values.genero}
                                                onValueChange={props.handleChange('genero')}
                                            >

                                                <Picker.Item label="Selecione" color="#77869E" value="" />
                                                <Picker.Item label="Feminino" color="#042C5C" value="F" />
                                                <Picker.Item label="Masculino" color="#042C5C" value="M" />
                                            </Picker>
                                        </View>


                                        <ErrorMessage style={styles.error} component={Text} name="genero" />
                                    </View>

                                    <View style={{ width: '47%' }}>
                                        <Text style={styles.label}>Nascimento</Text>

                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            style={styles.input}
                                            mode="date"
                                            placeholder="Selecione"
                                            onDateChange={props.handleChange('dtNascimento')}
                                            onBlur={props.handleBlur('dtNascimento')}
                                            date={props.values.dtNascimento}
                                            customStyles={{
                                                dateIcon: {
                                                    width: 13,
                                                    height: 13,
                                                },
                                                dateInput: {
                                                    borderWidth: 0,
                                                    alignItems: 'flex-start',

                                                },
                                                placeholderText: {
                                                    fontFamily: 'Roboto-Medium',
                                                    fontSize: 14,
                                                    textAlign: 'left',
                                                    color: '#CCCCCC',
                                                },
                                                dateText: {
                                                    fontSize: 14,
                                                    fontFamily: 'Roboto-Medium',
                                                    textAlign: 'left',
                                                    color: '#042C5C',
                                                }
                                            }}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="dtNascimento" />

                                    </View>

                                </View>

                                {props.values.mostraSwitch &&

                                    <View style={[styles.flexRow, styles.switch, styles.alignCenter]}>
                                        <Switch
                                            trackColor={{ false: "#232d3a", true: "#06C496" }}
                                            onValueChange={value =>
                                                props.setFieldValue('apresentaCampos', value)
                                            }

                                            value={props.values.apresentaCampos}
                                        />
                                        <Text style={styles.textSwitch}>Alterar Senha</Text>

                                    </View>

                                }



                                {props.values.apresentaCampos &&

                                    <View>
                                        {props.values.mostraSwitch &&

                                            <View>
                                                <Text style={styles.label}>Senha Atual</Text>

                                                <TextInput
                                                    style={styles.input}
                                                    autoCapitalize={'none'}
                                                    autoCompleteType={'password'}
                                                    secureTextEntry={true}
                                                    onChangeText={props.handleChange('senhaAtual')}
                                                    onBlur={props.handleBlur('senhaAtual')}
                                                    value={props.values.senhaAtual}
                                                />

                                                <ErrorMessage style={styles.error} component={Text} name="senhaAtual" />
                                            </View>

                                        }

                                        <Text style={styles.label}>Senha</Text>

                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'none'}
                                            autoCompleteType={'password'}
                                            secureTextEntry={true}
                                            onChangeText={props.handleChange('senha')}
                                            onBlur={props.handleBlur('senha')}
                                            value={props.values.senha}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="senha" />

                                        <Text style={styles.label}>Confirmar Senha</Text>

                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'none'}
                                            autoCompleteType={'password'}
                                            secureTextEntry={true}
                                            onChangeText={props.handleChange('confirmSenha')}
                                            onBlur={props.handleBlur('confirmSenha')}
                                            value={props.values.confirmSenha}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="confirmSenha" />

                                    </View>

                                }

                            </View>

                            <TouchableOpacity style={styles.includesButton} onPress={props.handleSubmit}>
                                <ButtonBlue>
                                    <ButtonText>{this.state.apresentaCampos ? 'ENVIAR' : 'ALTERAR'}</ButtonText>
                                </ButtonBlue>
                            </TouchableOpacity>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalAvatar}
                            >
                                <View style={styles.screenCenter}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalTitle}>
                                            <Text style={styles.contentModalTitle}>Escolha seu Avatar</Text>
                                        </View>
                                        <View style={[styles.contentModal]}>
                                            <FlatList
                                                data={props.values.listaAvatares}
                                                horizontal
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity style={styles.eachAvatar} onPress={() => this.setState({
                                                        avatar: item.url,
                                                        modalAvatar: false,
                                                    })}>
                                                        <Image style={styles.imageEachAvatar} source={{ uri: item.url }} />
                                                    </TouchableOpacity>

                                                )}
                                            />
                                        </View>
                                    </View>


                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            modalAvatar: false,
                                        })}
                                        value={props.values.modalAvatar}
                                    >
                                        <View style={styles.buttonClose}>
                                            <Icon3 name='close' size={25} color={'#FFF'}></Icon3>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </Modal>

                        </View>
                    )}

                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    flex: {
        flex: 1,
    },

    flexRow: {
        flexDirection: 'row',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    alignCenter: {
        alignItems: 'center'
    },

    content: {
        paddingBottom: 20,
    },

    includesImage: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 20,
    },

    image: {
        width: 92,
        height: 92,
        borderRadius: 46,
    },

    includesInputs: {
        paddingLeft: 25,
        paddingRight: 25,
    },

    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#77869E',
        paddingTop: 15,
    },

    input: {
        fontFamily: 'Roboto-Medium',
        height: 40,
        paddingLeft: 5,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 2,
        color: '#042C5C',
    },

    pickerView: {
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
        marginTop: 3,
        overflow: 'hidden'
    },

    picker: {
        fontFamily: 'Roboto-Medium',
        height: 35,
    },

    includesButton: {
        marginTop: 16,
        marginLeft: 50,
        marginRight: 50,
    },

    error: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },

    inputSide: {
        flexDirection: 'row',
    },

    container: {
        marginBottom: 35,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    switch: {
        paddingTop: 15,
    },

    textSwitch: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#77869E',
    },

    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '85%',
        backgroundColor: '#FAFAFA',
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    modalTitle: {
        backgroundColor: 'rgba(204, 204, 204, 0.3)',
    },

    contentModalTitle: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 18,
        lineHeight: 20,
        color: '#606060',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },

    contentModal: {
        backgroundColor: '#FBFBFB',
        paddingTop: 15,
        paddingBottom: 15,
    },

    eachAvatar: {
        paddingRight: 10,
        paddingLeft: 10,
    },

    imageEachAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    buttonClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E66060',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

