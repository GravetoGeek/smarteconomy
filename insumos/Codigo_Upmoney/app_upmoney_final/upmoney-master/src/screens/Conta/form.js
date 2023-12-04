import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Picker, Modal } from 'react-native';
import tinycolor from 'tinycolor2';
import { TextInputMask } from 'react-native-masked-text';

import Icon from 'react-native-vector-icons/Feather';
import { SlidersColorPicker } from '../../components/SlidersColorPicker';
import { ButtonBlue, ButtonText, ButtonRed, ButtonTextRed } from '../../components/Components';
import api from '../../components/Api';
import { showSuccess } from '../../common'
import AsyncStorage from '@react-native-community/async-storage'


import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';


const ReviewSchema = yup.object({
    
    nomeConta: yup.string()
        .required('Este campo é obrigatório.'),

    tipoConta: yup.object().shape({
        id: yup.number()
        .required('Este campo é obrigatório.')
        .nullable(),
    }),

});


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalDel: false,
            color: tinycolor('#f210d4').toHexString(), //cor inicial
            tiposContas: [],
            tipoConta: {
                id: null,
                descTipoConta: 'Selecione o Tipo de Conta'
            },
            usuarioId: null,
            modoEdicao: false,
            nomeConta: '',
            idConta: null
        }
    }

    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null
        let listaContas = []

        const contaEdicao = this.props.navigation.getParam('contaEdicao', 'null')


        console.log(`Objeto Edição: ${JSON.stringify(contaEdicao)}`)

        if (contaEdicao !== "null") {
            const modoEdicao = true
            const color = contaEdicao.cor
            const tipoConta = { ...contaEdicao.tipoConta }
            const nomeConta = contaEdicao.descConta
            const idConta = contaEdicao.id

            this.setState({ modoEdicao: modoEdicao, color: color, tipoConta: tipoConta, nomeConta: nomeConta, idConta: idConta })
        }

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)

            const response = await api.get('conta/tiposConta')
            listaContas = response.data

            this.setState({ tiposContas: listaContas, usuarioId: dadosUsuario.id, /*nomeConta: nomeConta*/ })


        } catch (err) {
            alert(err);
        }
    }

    showColorPicker = () => {
        this.setState({ modalVisible: true })

    }

    deletarConta = async () => {
        console.log(` Id Conta a ser excluída: ${this.state.idConta}`)
        let response = await api.delete(`conta/excluir/${this.state.idConta}`)

        showSuccess('Conta Excluída!')

        this.setState({
            modalDel: false
        })

        this.props.navigation.navigate('Contas');

    }


    handleSignInPress = async (values) => {

        console.log(`Id conta: ${this.state.idConta}`)
        console.log(`Descrição conta: ${values.nomeConta}`)
        console.log(`Cor selecionada: ${tinycolor(this.state.color).toHexString()}`)
        console.log(`Usuario id: ${this.state.usuarioId}`)
        console.log(`Tipo Conta id: ${values.tipoConta.id}`)
        console.log(`Valor Inicial: ${values.valorInicial}`)

        try {

            if (this.state.modoEdicao) {
                const response = await api.put('conta/alterar', {
                    id: this.state.idConta,
                    descConta: values.nomeConta,
                    cor: tinycolor(this.state.color).toHexString(),
                    tipoConta: {
                        id: values.tipoConta.id
                    },
                    usuario: {
                        id: this.state.usuarioId
                    }
                });

            } else {
                if (values.tipoConta.descTipoConta == 'Cartão de Crédito') {
                    const response = await api.post('conta/inserir', {
                        descConta: values.nomeConta,
                        cor: tinycolor(this.state.color).toHexString(),
                        valorInicial: values.valorInicial,
                        tipoConta: {
                            id: values.tipoConta.id
                        },
                        usuario: {
                            id: this.state.usuarioId
                        }
                    });

                } else {
                    const response = await api.post('conta/inserir', {
                        descConta: values.nomeConta,
                        cor: tinycolor(this.state.color).toHexString(),
                        valorInicial: values.valorInicial,
                        tipoConta: {
                            id: values.tipoConta.id
                        },
                        usuario: {
                            id: this.state.usuarioId
                        }
                    });

                }

            }

            showSuccess('Conta Inserida!')
            this.props.navigation.navigate('Contas');

        } catch (err) {
            alert(err);
        }
    }

    // updateHue = h => this.setState({ color: { ...this.state.color, h } });

    render() {
        const { tiposContas, tipoConta, modoEdicao, nomeConta, modalDel } = this.state

        return (
            <View>
                <Formik
                    // onReset={(values) => setUserSubmittedFormValues(values)}
                    enableReinitialize={true}
                    initialValues={{
                        nomeConta: nomeConta, tiposContas: tiposContas, valorInicial: 0,
                        tipoConta: tipoConta, modoEdicao: modoEdicao, modalDel: modalDel
                    }}
                    validationSchema={ReviewSchema}
                    onSubmit={(values, { resetForm }) => {
                        this.handleSignInPress(values)
                        resetForm()
                    }}
                >

                    {(props) => (
                        <View>
                            <View style={styles.includesInputs}>

                                {/* Nome da Conta */}
                                <Text style={styles.label}>Nome da Conta</Text>

                                <View style={styles.elementsSide}>

                                    <View style={{ flex: 4 }}>
                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'words'}
                                            onChangeText={props.handleChange('nomeConta')}
                                            onBlur={props.handleBlur('nomeConta')}
                                            value={props.values.nomeConta}
                                        // ref={input => { props.values.nomeConta = input }}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="nomeConta" />
                                    </View>

                                    <View style={{ flex: 1, marginLeft: 30 }}>
                                        {/* Botão colorido e colorpicker */}
                                        <ScrollView contentContainerStyle={styles.content}>
                                            <TouchableOpacity
                                                onPress={this.showColorPicker}
                                                style={[styles.circleColor, { backgroundColor: tinycolor(this.state.color).toHexString() }]}
                                            >
                                            </TouchableOpacity>

                                            <SlidersColorPicker
                                                visible={this.state.modalVisible}
                                                color={this.state.color}
                                                returnMode={'hex'}
                                                onCancel={() => this.setState({ modalVisible: false })}
                                                onOk={colorHex => {
                                                    this.setState({
                                                        modalVisible: false,
                                                        color: tinycolor(colorHex).toHexString()
                                                    });
                                                }}
                                                okLabel="Done"
                                                cancelLabel="Cancel"
                                            />
                                        </ScrollView>
                                    </View>
                                </View>

                                {/* Tipo da Conta */}
                                <Text style={styles.label}>Tipo da Conta</Text>

                                <View style={styles.pickerView}>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={props.values.tipoConta}
                                        onValueChange={value =>
                                            props.setFieldValue('tipoConta', value)
                                        } >

                                        <Picker.Item label={`${this.state.tipoConta.descTipoConta}`} color="#042C5C" value={this.state.tipoConta.descTipoConta} />

                                        {this.state.tiposContas.map((item, index) => (
                                            item.descTipoConta !== this.state.tipoConta.descTipoConta &&
                                            <Picker.Item label={item.descTipoConta} color="#232d3a" key={item.id} value={item} />
                                        ))}
                                    </Picker>
                                </View>


                                <ErrorMessage style={styles.error} component={Text} name="tipoConta.id" />

                                {/* Conta corrente, dinheiro, outros, conta poupança  */}
                                {
                                    ((props.values.tipoConta.descTipoConta == 'Conta Corrente' ||
                                        props.values.tipoConta.descTipoConta == 'Dinheiro'
                                        || props.values.tipoConta.descTipoConta == 'Outro'
                                        || props.values.tipoConta.descTipoConta == 'Conta Poupança'
                                        || props.values.tipoConta.descTipoConta == 'Investimento'
                                        || props.values.tipoConta.descTipoConta == 'Cartão de Crédito') && !props.values.modoEdicao) &&
                                    <View>
                                        {/* Valor */}
                                        <View style={{ width: '100%' }}>
                                            {props.values.tipoConta.descTipoConta == 'Cartão de Crédito' &&
                                                <Text style={styles.label}>Valor Inicial da Fatura</Text>
                                            }
                                            {props.values.tipoConta.descTipoConta != 'Cartão de Crédito' &&
                                                <Text style={styles.label}>Valor Inicial</Text>
                                            }
                                            <TextInputMask
                                                style={styles.input}
                                                type={'money'}
                                                placeholder={'R$0,00'}
                                                options={{
                                                    precision: 2,
                                                    separator: ',',
                                                    delimiter: '.',
                                                    unit: 'R$',
                                                    suffixUnit: ''
                                                }}
                                                includeRawValueInChangeText={true}
                                                value={props.values.valorInicial || ''}
                                                onChangeText={(maskedText, rawText) => {
                                                    props.setFieldValue('valorInicial', rawText)
                                                }}
                                            />

                                            <ErrorMessage style={styles.error} component={Text} name="valorInicial" />
                                        </View>
                                    </View>
                                }

                                <TouchableOpacity style={[styles.includesButton, styles.paddingButton]} onPress={props.handleSubmit}>
                                    <ButtonBlue>
                                        <ButtonText>{this.state.modoEdicao ? 'ALTERAR' : 'CADASTRAR'}</ButtonText>
                                    </ButtonBlue>
                                </TouchableOpacity>

                                {props.values.modoEdicao &&
                                    <TouchableOpacity style={[styles.includesButton]} onPress={() => this.setState({
                                        modalDel: true
                                    })}>
                                        <ButtonRed>
                                            <ButtonTextRed>Deletar Conta</ButtonTextRed>
                                        </ButtonRed>
                                    </TouchableOpacity>
                                }


                            </View>

                            {/* Modal Delete Receita*/}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalDel}
                            >
                                <View style={styles.screenCenter}>
                                    <View style={[styles.modalContent, { width: '70%' }]}>
                                        <View style={styles.modalTitle}>
                                            {props.values.modalDel &&
                                                <Text style={styles.contentModalTitle}>Excluir {props.values.nomeConta} ?</Text>
                                            }
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Text style={styles.textAboutDelete}>Ao deletar a conta todas as despesas e receitas vinculadas a ela serão exlcuídas</Text>
                                        </View>
                                        <View>

                                            <TouchableOpacity onPress={() => this.deletarConta()}>
                                                <View style={[styles.confirmDelete]}>
                                                    <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                    <Icon name="check" size={20} color="#00DFA8" />
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.setState({
                                                modalDel: false,
                                                receitaSelecionada: {
                                                    id: null,
                                                    descReceita: '',
                                                    valorParcela: '',
                                                }
                                            })} value={props.values.modalDel}>
                                                <View style={[styles.cancelDelete]}>
                                                    <Text style={styles.textModalDel}>CANCELAR</Text>
                                                    <Icon name="minus-circle" size={20} color="#F24750" />
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
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

    includesInputs: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 25,
        paddingTop: 10,
    },

    paddingButton: {
        paddingTop: 25
    },

    confirmDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 25,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: '#606060',
        borderBottomWidth: 0.5,
        width: '100%'
    },

    textModalDel: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#606060',
    },

    cancelDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 25,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
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


    circleColor: {
        flex: 3,
        width: 50,
        height: 50,
        borderRadius: 50,
    },

    deleteButton: {
        color: '#D1CFCF',
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 1,
        marginTop: 10,
        height: 20,
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        textAlign: 'center'
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
        paddingBottom: 30,
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

    boxTextInstructions: {
        padding: 10,
    },

    textInstructions: {
        textAlign: "center",
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#606060',
    },


    textDelete: {
        color: 'red',
    },

    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#77869E',
        paddingTop: 15,
    },

    labelSaldo: {
        fontFamily: 'Roboto-Bold',
        fontSize: 32,
        lineHeight: 42,
        letterSpacing: 0.5,
        color: '#171D33',
    },

    labelSide: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#475154',
        paddingLeft: 5,
    },

    pickerView: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        backgroundColor: '#F6F6F6',
        marginTop: 5,
        overflow: 'hidden'
    },

    picker: {
        fontFamily: 'Roboto-Medium',
        height: 40,
    },

    input: {
        fontFamily: 'Roboto-Medium',
        width: '100%',
        height: 40,
        paddingLeft: 5,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 2,
        color: '#042C5C',
    },

    elementsSide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    buttonAdd: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#06C496',
        marginLeft: 15,

        alignItems: 'center',
        justifyContent: 'center',
    },

    textAdd: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    includesButton: {
        flexGrow: 1,
        marginTop: 15,
    },

    error: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },

    switchSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    textAboutDelete: {
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        color: '#F24750'
    },


});

