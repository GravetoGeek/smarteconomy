import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Picker, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { ButtonBlue, ButtonText, ButtonRed, ButtonTextRed, ButtonGreen, ButtonTextSimple } from '../../components/Components';
import DatePicker from 'react-native-datepicker';
import NumberFormat from 'react-number-format';
import { TextInputMask } from 'react-native-masked-text';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import api from '../../components/Api';
import { showSuccess } from '../../common'

import { ErrorMessage, Formik, Field } from 'formik';
import * as yup from 'yup';



const ReviewSchema = yup.object({

    conta: yup.object().shape({
        id: yup.number()
            .required('Este campo é obrigatório.')
            .nullable()
    }),

    descricao: yup.string()
        .required('Este campo é obrigatório.'),

    valorParcela: yup.number()
        .required('Este campo é obrigatório.')
        .positive('O numero deve ser positivo.')
        .nullable(),

    dtLancamento: yup.date()
        .required('Este campo é obrigatório.')
        .nullable(),


    categoria: yup.object().shape({
        id: yup.number()
            .required('Este campo é obrigatório.')
            .nullable()
    }),

    subcategoria: yup.object().shape({
        id: yup.number()
            .required('Este campo é obrigatório.')
            .nullable()
    }),

    tipoRepeticao: yup.object()
        .when('repeticao', {
            is: true,
            then: yup.object().shape({
                id: yup.number()
                    .required('Este campo é obrigatório.')
                    .nullable()
            }),
        }),

    qtdParcela: yup.number()
        .nullable()
        .when('repeticao', {
            is: true,
            then: yup.number()
                .when('tipoRepeticao.id', {
                    is: value => value && value != 8,
                    then: yup.number()
                        .required('Este campo é obrigatório.')
                        .positive('O numero deve ser positivo.')
                        .min(0, 'O campo precisa ser maior que 0')
                }),
        })


});


export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {

            modoEdicao: false,

            modalText: false,

            modalDelDespesa: false,

            idDespesa: null,

            numParcela: null,

            idRepeticao: null,

            switchAltera: false,

            valorParcela: null,

            valorTotal: null,

            dtLancamento: null,

            despesaSelecionada: {
                id: null,
                descDespesa: '',
                valorParcela: null,
            },

            categoria: {
                descCategoria: 'Estilo de Vida',
                id: 1,
            },

            conta: {
                id: null,
                descConta: 'Selecione a Conta',
                saldoConta: null,
            },

            descricao: '',

            dtLancamento: null,

            categoria: {
                id: null,
                descCategoria: 'Selecione a Categoria',
            },

            subcategoria: {
                id: null,
                descSubcategoria: 'Selecione a Subcategoria',
            },

            repeticao: false,

            qtdParcela: null,

            tipoRepeticao: {
                id: null,
                descTipoRepeticao: 'Selecione o tipo de Repetição'
            },

            listaTiposRepeticao: [{
                id: null,
                descTipoRepeticao: ''
            }],


            listaContas: [
                {
                    id: null,
                    descConta: '',
                    saldoConta: null,
                },
            ],

            listaCategorias: [
                {
                    id: null,
                    descCategoria: '',
                    porcentagem: null
                }
            ],

            listaSubcategoriaGE: [
                {
                    categoriaDespesa: {
                        descCategoria: '',
                        id: null,
                        porcentagem: null
                    },
                    descSubcategoria: '',
                    id: null
                },
            ],

            listaSubcategoriaEV: [
                {
                    categoriaDespesa: {
                        descCategoria: '',
                        id: null,
                        porcentagem: null
                    },
                    descSubcategoria: '',
                    id: null
                },
            ],

            listaSubcategoriaI: [
                {
                    categoriaDespesa: {
                        descCategoria: '',
                        id: null,
                        porcentagem: null
                    },
                    descSubcategoria: '',
                    id: null
                },
            ]

        }

        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.reloadListaSubCategorias()
            }
        );


    }

    reloadListaSubCategorias = async () => {
        let listaSubcategoriaGE = []
        let listaSubcategoriaEV = []
        let listaSubcategoriaI = []

        try {
            let response = await api.get('categoria/subcategoria/usuario/')
            let listaSubcategorias = response.data

            listaSubcategorias.map((subcategoria) => {
                if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                    listaSubcategoriaGE.push(subcategoria)
                    // console.log(`Subcategoria de Gastos Essênciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                    listaSubcategoriaEV.push(subcategoria)
                    // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                } else {
                    listaSubcategoriaI.push(subcategoria)
                    // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                }

                this.setState({
                    listaSubcategoriaGE: listaSubcategoriaGE, listaSubcategoriaEV: listaSubcategoriaEV, listaSubcategoriaI: listaSubcategoriaI
                })

            })
        } catch (err) {
            alert(err);
            setSubmitting(false)
        }
    }



    consultaSaldo = async (item) => {
        let response = await api.get(`conta/saldo/${item.id}`)
        item.saldoConta = response.data
    }


    excluirDespesa = async () => {
        console.log(` Id Despesa a ser excluída: ${this.state.idDespesa}`)

        let response = await api.delete(`despesa/excluir/${this.state.idDespesa}`)

        showSuccess('Despesa Excluída!')

        this.setState({ modalDelDespesa: false })
        this.props.navigation.navigate('Contas');
    }

    componentDidMount = async () => {
        let listaContasUsuario = []
        let listaCategoriasUsuario = []
        let listaSubcategorias = []
        let listaSubcategoriaGE = []
        let listaSubcategoriaEV = []
        let listaSubcategoriaI = []
        let listaTiposRepeticao = []

        const despesaEdicao = this.props.navigation.getParam('despesaEdicao', 'null')
        console.log(`Despesa a ser alterada: ${JSON.stringify(despesaEdicao)}`)
        try {
            if (despesaEdicao !== "null") {
                const modoEdicao = true
                const idDespesa = despesaEdicao.id
                const numParcela = despesaEdicao.numParcela
                const idRepeticao = despesaEdicao.idRepeticao

                this.consultaSaldo(despesaEdicao.conta)
                let response = await api.get(`conta/saldo/${despesaEdicao.conta.id}`)

                const conta = {
                    id: despesaEdicao.conta.id,
                    descConta: despesaEdicao.conta.descConta,
                    saldoConta: response.data
                }

                const descricao = despesaEdicao.descDespesa
                const dtLancamento = despesaEdicao.dtLancamento
                const valorParcela = despesaEdicao.valorParcela
                const valorTotal = despesaEdicao.valorTotalDespesa
                const categoria = {
                    id: despesaEdicao.categoria.categoriaDespesa.id,
                    descCategoria: despesaEdicao.categoria.categoriaDespesa.descCategoria
                }
                const subcategoria = {
                    id: despesaEdicao.categoria.id,
                    descSubcategoria: despesaEdicao.categoria.descSubcategoria,
                }

                if (despesaEdicao.repeticao) {
                    const tipoRepeticao = {
                        id: despesaEdicao.tipoRepeticao.id,
                        descTipoRepeticao: despesaEdicao.tipoRepeticao.descTipoRepeticao
                    }

                    this.setState({tipoRepeticao: tipoRepeticao,})
                }

                const qtdParcela = despesaEdicao.qtdeParcelas
                this.setState({ repeticao: despesaEdicao.repeticao, qtdParcela: qtdParcela, })
                // this.state.qtdParcela = qtdParcela
                // }

                this.setState({
                    conta: conta, modoEdicao: modoEdicao, descricao: descricao, dtLancamento: dtLancamento, valorParcela: valorParcela, categoria: categoria,
                    idDespesa: idDespesa, subcategoria: subcategoria, numParcela: numParcela, idRepeticao: idRepeticao, valorTotal: valorTotal
                })
            }

            let response = await api.get("conta/usuario")
            listaContasUsuario = response.data

            listaContasUsuario.map((item) => (

                this.consultaSaldo(item)
            ))

            response = await api.get("/categoria/despesa")
            listaCategoriasUsuario = response.data

            response = await api.get('categoria/subcategoria/usuario/')
            listaSubcategorias = response.data

            listaSubcategorias.map((subcategoria) => {
                if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                    listaSubcategoriaGE.push(subcategoria)
                    // console.log(`Subcategoria de Gastos Essênciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                    listaSubcategoriaEV.push(subcategoria)
                    // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                } else {
                    listaSubcategoriaI.push(subcategoria)
                    // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                }
            })

            response = await api.get('receita/tiposRepeticao')

            listaTiposRepeticao = response.data

            this.setState({
                listaContas: listaContasUsuario, listaCategorias: listaCategoriasUsuario, listaSubcategoriaGE: listaSubcategoriaGE, listaSubcategoriaEV: listaSubcategoriaEV,
                listaSubcategoriaI: listaSubcategoriaI, listaTiposRepeticao: listaTiposRepeticao
            })

        } catch (err) {
            alert(err);
            setSubmitting(false)
        }
    }


    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }


    handleSignInPress = async (values,{resetForm, setSubmitting}) => {

        console.log('*************************************')
        console.log(`Id despesa quando é edição: ${this.state.idDespesa}`)
        console.log(`Id da repeticao mãe: ${this.state.idRepeticao}`)
        console.log(`Id da sequencia de numero parcela: ${this.state.numParcela}`)
        console.log(`ValorTotal é: ${this.state.valorTotal}`)


        console.log(`Conta: ${values.conta.descConta}`)
        console.log(`Conta id: ${values.conta.id}`)
        console.log(`Descrição: ${values.descricao}`)
        console.log(`valorParcela: ${values.valorParcela}`)
        console.log(`Data de Lançamento: ${values.dtLancamento}`)
        console.log(`Categoria: ${values.categoria.descCategoria}`)
        console.log(`Subcategoria id: ${values.subcategoria.id}`)
        console.log(`Repetição: ${values.repeticao}`)
        console.log(`Quantidade de Parcela: ${values.qtdParcela}`)
        console.log(`Tipo Repeticão: ${values.tipoRepeticao.descTipoRepeticao}`)
        console.log(`Tipo Repeticão id: ${values.tipoRepeticao.id}`)

        if (this.state.modoEdicao) {
            let urlAlterar = ''

            if (values.switchAltera) {
                console.log("Irá alterar a sequência de despesa")
                urlAlterar = "/despesa/alterar/despesas"
            } else {
                console.log("Irá alterar apenas essa parcela")
                urlAlterar = "/despesa/alterar"
            }


            if (!values.repeticao) {
                try {
                    const response = await api.put(`${urlAlterar}`, {
                        id: this.state.idDespesa,
                        descDespesa: values.descricao,
                        dtLancamento: values.dtLancamento,
                        // numParcela: this.state.numParcela,
                        // qtdeParcelas: values.qtdParcela,
                        repeticao: values.repeticao,
                        // valorParcela: values.valorParcela,
                        valorTotalDespesa: values.valorParcela,
                        // idRepeticao: this.state.idRepeticao,
                        conta: {
                            id: values.conta.id
                        },
                        categoria: {
                            id: values.subcategoria.id
                        }
                    })
                } catch (err) {
                    alert(err);
                    setSubmitting(false)
                }
            } else {
                if (values.tipoRepeticao.descTipoRepeticao == "Repetição Infinita") {
                    try {
                        const response = await api.put(`${urlAlterar}`, {
                            id: this.state.idDespesa,
                            descDespesa: values.descricao,
                            dtLancamento: values.dtLancamento,
                            idRepeticao: this.state.idRepeticao,
                            numParcela: this.state.numParcela,
                            qtdeParcelas: values.qtdParcela,
                            repeticao: values.repeticao,
                            valorParcela: values.valorParcela,
                            valorTotalDespesa: values.valorParcela,
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.subcategoria.id
                            },
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                        })
                    } catch (err) {
                        alert(err);
                        setSubmitting(false)
                    }
                } else {
                    try {
                        const response = await api.put(`${urlAlterar}`, {
                            id: this.state.idDespesa,
                            descDespesa: values.descricao,
                            dtLancamento: values.dtLancamento,
                            idRepeticao: this.state.idRepeticao,
                            numParcela: this.state.numParcela,
                            qtdeParcelas: values.qtdParcela,
                            repeticao: values.repeticao,
                            valorParcela: values.valorParcela,
                            valorTotalDespesa: this.state.valorTotal,
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.subcategoria.id
                            },
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                        })
                    } catch (err) {
                        alert(err);
                        setSubmitting(false)
                    }
                }
            }
            showSuccess('Despesa Alterada!')
            setSubmitting(false)
            resetForm()
            this.props.navigation.navigate('Contas');

        } else {
            if (!values.repeticao) {
                try {
                    const response = await api.post('despesa/inserir', {
                        descDespesa: values.descricao,
                        valorTotalDespesa: values.valorParcela,
                        dtLancamento: values.dtLancamento,
                        repeticao: false,
                        conta: {
                            id: values.conta.id
                        },
                        categoria: {
                            id: values.subcategoria.id
                        }
                    });

                } catch (err) {
                    alert(err);
                    setSubmitting(false)
                }
            } else {
                if (values.tipoRepeticao.descTipoRepeticao == "Repetição Infinita") {
                    console.log("entrei inserção infinita")
                    try {
                        const response = await api.post('despesa/inserir', {
                            descDespesa: values.descricao,
                            valorTotalDespesa: values.valorParcela,
                            dtLancamento: values.dtLancamento,
                            repeticao: true,
                            valorParcela: values.valorParcela,
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.subcategoria.id
                            }
                        });
                    } catch (err) {
                        alert(err);
                        setSubmitting(false)
                    }
                } else {
                    try {
                        const response = await api.post('despesa/inserir', {
                            descDespesa: values.descricao,
                            valorTotalDespesa: values.valorParcela,
                            dtLancamento: values.dtLancamento,
                            repeticao: true,
                            qtdeParcelas: values.qtdParcela,
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.subcategoria.id
                            }
                        });

                    } catch (err) {
                        alert(err);
                        setSubmitting(false)
                    }

                }
            }
            showSuccess('Despesa Inserida!')
            setSubmitting(false)
            resetForm()

        }

        this.state.listaContas.map((item) => (
            this.consultaSaldo(item)
        ))
    }

    addCategoriaDespesa = () => {
        this.props.navigation.navigate('CategoriaDespesa');

    }


    calcularParcelas = () => {
        console.log("calcular parcelas")

    }


    render() {

        const { conta, descricao, valorParcela, dtLancamento, categoria, subcategoria, repeticao, qtdParcela, tipoRepeticao,
            listaContas, listaCategorias, listaSubcategoriaGE, listaSubcategoriaEV, listaSubcategoriaI, listaTiposRepeticao, modalDelDespesa,
            modalText, switchAltera
        } = this.state

        return (
            <View>
                <Formik
                    initialValues={{
                        conta: conta, descricao: descricao, valorParcela: valorParcela, dtLancamento: dtLancamento, categoria: categoria, subcategoria: subcategoria,
                        repeticao: repeticao, qtdParcela: qtdParcela, listaTiposRepeticao: listaTiposRepeticao, listaContas: listaContas, listaSubcategoriaGE: listaSubcategoriaGE,
                        listaSubcategoriaEV: listaSubcategoriaEV, listaSubcategoriaI: listaSubcategoriaI, listaCategorias: listaCategorias, tipoRepeticao: tipoRepeticao,
                        modalDelDespesa: modalDelDespesa, modalText: modalText, switchAltera: switchAltera
                    }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values, { resetForm, setSubmitting }) => {
                        this.handleSignInPress(values,{resetForm, setSubmitting})
                        // resetForm()
                    }}
                >

                    {(props) => (
                        <View>
                            {props.isSubmitting && <ActivityIndicator/>}
                            {(props.values.listaContas.length == 0 && !props.isSubmitting )  &&

                                <View>
                                    <Text style={styles.nenhumaConta}>Para adicionar uma despesa, voce precisa possuir ao menos uma conta cadastrada</Text>
                                </View>

                            }

                            {(props.values.listaContas.length > 0 && !props.isSubmitting ) &&

                                <View>


                                    <View style={styles.includesInputs}>

                                        {/* Saldo e Conta */}
                                        <Text style={styles.label}>Saldo</Text>
                                        {this.isEmpty(props.values.saldoConta) &&

                                            <NumberFormat value={props.values.conta.saldoConta} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.labelSaldo}>{value}</Text>} />
                                        }

                                        <View style={styles.pickerView}>
                                            <Picker
                                                style={styles.picker}
                                                selectedValue={props.values.conta}
                                                onValueChange={value => {
                                                    props.setFieldValue('conta', value)
                                                }}
                                            >

                                                {/* Inicializa com o state da conta do início, onde a descrição da conta está como "Selecione Conta"*/}
                                                <Picker.Item label={`${this.state.conta.descConta}`} color="#042C5C" value={this.state.conta.descConta} />

                                                {this.state.listaContas.map((item, index) => (
                                                    // Verifica se o item da lista é o mesmo que está setado no state, se for ele não mostra pra não duplicar esse valor
                                                    item.descConta !== this.state.conta.descConta &&
                                                    <Picker.Item label={item.descConta} color="#042C5C" key={item.id} value={item} />
                                                ))}

                                            </Picker>
                                        </View>


                                        <ErrorMessage style={styles.error} component={Text} name="conta.id" />

                                        {/* Descrição */}
                                        <Text style={styles.label}>Descrição</Text>

                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize={'words'}
                                            onChangeText={props.handleChange('descricao')}
                                            onBlur={props.handleBlur('descricao')}
                                            value={props.values.descricao}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="descricao" />


                                        <View style={styles.elementsSide}>

                                            <View style={{ width: '45%' }}>
                                                {/* Data */}
                                                <Text style={styles.label}>Data</Text>

                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    style={styles.input}
                                                    placeholder="Selecione"
                                                    mode="date"
                                                    onDateChange={props.handleChange('dtLancamento')}
                                                    onBlur={props.handleBlur('dtLancamento')}
                                                    date={props.values.dtLancamento}
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
                                                            fontFamily: 'Roboto-Medium',
                                                            fontSize: 14,
                                                            textAlign: 'left',
                                                            color: '#042C5C',
                                                        }
                                                    }}
                                                />

                                                <ErrorMessage style={styles.error} component={Text} name="dtLancamento" />
                                            </View>

                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.label}>{this.state.modoEdicao ? 'Valor Parcela' : 'Valor Total'}</Text>

                                                <TextInputMask
                                                    style={styles.input}
                                                    type={'money'}
                                                    placeholder={'R$0,00'}
                                                    includeRawValueInChangeText={true}
                                                    options={{
                                                        precision: 2,
                                                        separator: ',',
                                                        delimiter: '.',
                                                        unit: 'R$',
                                                        suffixUnit: ''
                                                    }}
                                                    value={props.values.valorParcela}
                                                    onChangeText={(maskedText, rawText) => {
                                                        props.setFieldValue('valorParcela', rawText)
                                                    }}

                                                />

                                                <ErrorMessage style={styles.error} component={Text} name="valorParcela" />
                                            </View>

                                        </View>

                                        {/* Categoria */}
                                        <Text style={styles.label}>Categoria</Text>

                                        <View style={styles.pickerView}>
                                            <Picker
                                                style={styles.picker}
                                                selectedValue={props.values.categoria}
                                                onValueChange={value =>
                                                    props.setFieldValue('categoria', value)}
                                            >
                                                <Picker.Item label={this.state.categoria.descCategoria} color="#042C5C" value={this.state.categoria.descCategoria} />

                                                {this.state.listaCategorias.map((item, index) => (
                                                    item.descCategoria !== this.state.categoria.descCategoria &&
                                                    <Picker.Item label={item.descCategoria} color="#042C5C" key={item.id} value={item} />
                                                ))}

                                            </Picker>

                                        </View>

                                        <ErrorMessage style={styles.error} component={Text} name="categoria.id" />

                                        {/* Subcategoria */}
                                        {/* Gastos Essenciais */}
                                        {props.values.categoria.descCategoria == 'Gastos Essenciais' &&

                                            <View>

                                                <Text style={styles.label}>Subcategoria</Text>

                                                <View style={styles.elementsSide}>

                                                    <View style={{ flex: 4 }}>

                                                        <View style={styles.pickerView}>
                                                            <Picker
                                                                style={styles.picker}
                                                                selectedValue={props.values.subcategoria}
                                                                onValueChange={value =>
                                                                    props.setFieldValue('subcategoria', value)}
                                                            >
                                                                <Picker.Item label={this.state.subcategoria.descSubcategoria} color="#042C5C" value={this.state.subcategoria.descSubcategoria} />

                                                                {this.state.listaSubcategoriaGE.map((item, index) => (
                                                                    item.descSubcategoria !== this.state.subcategoria.descSubcategoria &&
                                                                    <Picker.Item label={item.descSubcategoria} color="#042C5C" key={item.id} value={item} />
                                                                ))}

                                                            </Picker>
                                                        </View>


                                                    </View>

                                                    <View style={{ flex: 1 }}>

                                                        <TouchableOpacity style={styles.buttonAdd} onPress={this.addCategoriaDespesa}>
                                                            <Text style={styles.textAdd}>+</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </View>

                                                <ErrorMessage style={styles.error} component={Text} name="subcategoria.id" />

                                            </View>


                                        }

                                        {/* Estilo de Vida */}
                                        {props.values.categoria.descCategoria == 'Estilo de Vida' &&
                                            <View>

                                                <Text style={styles.label}>Subcategoria</Text>

                                                <View style={styles.elementsSide}>

                                                    <View style={{ flex: 4 }}>
                                                        <View style={styles.pickerView}>
                                                            <Picker
                                                                style={styles.picker}
                                                                selectedValue={props.values.subcategoria}
                                                                onValueChange={value =>
                                                                    props.setFieldValue('subcategoria', value)}
                                                            >
                                                                <Picker.Item label={this.state.subcategoria.descSubcategoria} color="#042C5C" value={this.state.subcategoria.descSubcategoria} />

                                                                {this.state.listaSubcategoriaEV.map((item, index) => (
                                                                    item.descSubcategoria !== this.state.subcategoria.descSubcategoria &&
                                                                    <Picker.Item label={item.descSubcategoria} color="#042C5C" key={item.id} value={item} />
                                                                ))}

                                                            </Picker>
                                                        </View>


                                                    </View>

                                                    <View style={{ flex: 1 }}>

                                                        <TouchableOpacity style={styles.buttonAdd} onPress={this.addCategoriaDespesa}>
                                                            <Text style={styles.textAdd}>+</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </View>

                                                <ErrorMessage style={styles.error} component={Text} name="subcategoria.id" />

                                            </View>


                                        }

                                        {/* Investimento */}
                                        {props.values.categoria.descCategoria == 'Investimento' &&
                                            <View>

                                                <Text style={styles.label}>Subcategoria</Text>

                                                <View style={styles.elementsSide}>

                                                    <View style={{ flex: 4 }}>

                                                        <View style={styles.pickerView}>
                                                            <Picker
                                                                style={styles.picker}
                                                                selectedValue={props.values.subcategoria}
                                                                onValueChange={value =>
                                                                    props.setFieldValue('subcategoria', value)}
                                                            >
                                                                <Picker.Item label={this.state.subcategoria.descSubcategoria} color="#042C5C" value={this.state.subcategoria.descSubcategoria} />

                                                                {props.values.listaSubcategoriaI.map((item, index) => (
                                                                    item.descSubcategoria !== this.state.subcategoria.descSubcategoria &&
                                                                    <Picker.Item label={item.descSubcategoria} color="#042C5C" key={item.id} value={item} />
                                                                ))}

                                                            </Picker>
                                                        </View>



                                                    </View>

                                                    <View style={{ flex: 1 }}>

                                                        <TouchableOpacity style={styles.buttonAdd} onPress={this.addCategoriaDespesa}>
                                                            <Text style={styles.textAdd}>+</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </View>

                                                <ErrorMessage style={styles.error} component={Text} name="subcategoria.id" />

                                            </View>


                                        }

                                        {/* Switch Repetição */}
                                        <View style={styles.switchSide}>
                                            <Switch
                                                trackColor={{ false: "#042C5C", true: "#06C496" }}
                                                onValueChange={value =>
                                                    props.setFieldValue('repeticao', value)
                                                }

                                                value={props.values.repeticao}
                                            />
                                            <Text style={styles.labelSide}>Parcelamento</Text>

                                            <TouchableOpacity
                                                style={{ paddingLeft: 10 }}

                                                onPress={() =>
                                                    props.setFieldValue('modalText', true)
                                                }>
                                                <Icon2 name="question-circle" size={18} color="#212844" />
                                            </TouchableOpacity>

                                        </View>


                                        {/* Campos Repetição */}
                                        {
                                            props.values.repeticao &&


                                            <View style={styles.elementsSide}>

                                                {/* Tipo Repetiçaõ */}
                                                <View style={{ width: '100%' }}>

                                                    <Text style={styles.label}>Tipo de Parcelamento</Text>

                                                    <View style={styles.pickerView}>
                                                        <Picker
                                                            style={styles.picker}
                                                            selectedValue={props.values.tipoRepeticao}
                                                            onValueChange={value =>
                                                                props.setFieldValue('tipoRepeticao', value)}
                                                        >
                                                            <Picker.Item label={this.state.tipoRepeticao.descTipoRepeticao} color="#042C5C" value={this.state.tipoRepeticao.descTipoRepeticao} />

                                                            {props.values.listaTiposRepeticao.map((item, index) => (
                                                                item.descTipoRepeticao !== this.state.tipoRepeticao.descTipoRepeticao &&
                                                                <Picker.Item label={item.descTipoRepeticao} color="#042C5C" key={item.id} value={item} />
                                                            ))}

                                                        </Picker>
                                                    </View>

                                                    <ErrorMessage style={styles.error} component={Text} name="tipoRepeticao.id" />

                                                </View>

                                            </View>

                                        }

                                        {this.state.modoEdicao && props.values.repeticao &&
                                            <View style={styles.switchSide}>
                                                <Switch
                                                    trackColor={{ false: "#042C5C", true: "#06C496" }}
                                                    onValueChange={value =>
                                                        props.setFieldValue('switchAltera', value)
                                                    }

                                                    value={props.values.switchAltera}
                                                />
                                                <Text style={styles.labelSide}>Alterar Todas as Parcelas?</Text>
                                            </View>
                                        }

                                        {!this.state.modoEdicao && props.values.repeticao && props.values.tipoRepeticao.descTipoRepeticao != "Repetição Infinita" &&
                                            <View>
                                                {/* Quantidade */}
                                                <View style={{ width: '100%' }}>
                                                    <Text style={styles.label}>Quantidade</Text>

                                                    <TextInput
                                                        style={styles.input}
                                                        keyboardType={"number-pad"}
                                                        onChangeText={props.handleChange('qtdParcela')}
                                                        onBlur={props.handleBlur('qtdParcela')}
                                                        value={props.values.qtdParcela}
                                                    />

                                                    <ErrorMessage style={styles.error} component={Text} name="qtdParcela" />

                                                </View>
                                            </View>
                                        }


                                        <TouchableOpacity style={styles.includesButton} onPress={props.handleSubmit}>
                                            <ButtonBlue>
                                                <ButtonText>{this.state.modoEdicao ? 'ALTERAR' : 'CADASTRAR'}</ButtonText>
                                            </ButtonBlue>
                                        </TouchableOpacity>

                                        {this.state.modoEdicao &&
                                            <TouchableOpacity style={[styles.includesButton]} onPress={() => this.setState({
                                                modalDelDespesa: true,
                                                despesaSelecionada: {
                                                    ...this.state.despesaSelecionada,
                                                    id: this.state.despesaSelecionada.id,
                                                    descDespesa: this.state.despesaSelecionada.descDespesa,
                                                    valorParcela: this.state.despesaSelecionada.valorParcela,
                                                }
                                            })}>
                                                <ButtonRed>
                                                    <ButtonTextRed>Deletar Despesa</ButtonTextRed>
                                                </ButtonRed>
                                            </TouchableOpacity>
                                        }
                                    </View>

                                    {/* Modal Explicação repetição e parcelamento*/}
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={props.values.modalText}
                                    >
                                        <View style={styles.screenCenter}>
                                            <View style={[styles.modalContent, { width: '70%' }]}>
                                                <View style={styles.modalTitle}>
                                                    {props.values.modalText &&
                                                        <Text style={styles.contentModalTitle}>Repetição ou parcelamento</Text>
                                                    }
                                                </View>
                                                <View style={styles.boxTextInstructions}>
                                                    <Text style={styles.textInstructions}>Ao selecionar o tipo de parcelamento "Repetição Infinita", o campo "valor total" cadastrado será repetido mensalmente. As demais opções terão o campo "Valor total" parcelado na quantidade cadastrada, no tempo determinado (diário, semanal, mensal...)</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        props.setFieldValue('modalText', false)
                                                    }
                                                    value={props.values.modalText}
                                                >
                                                    <View style={styles.buttonClose}>
                                                        <Icon2 name='close' size={25} color={'#FFF'}></Icon2>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>


                                    {/* Modal Delete Despesa*/}
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={props.values.modalDelDespesa}
                                    >
                                        <View style={styles.screenCenter}>
                                            <View style={[styles.modalContent, { width: '70%' }]}>
                                                <View style={styles.modalTitle}>
                                                    {props.values.modalDelDespesa &&
                                                        <Text style={styles.contentModalTitle}>Excluir {props.values.descricao} ?</Text>

                                                    }

                                                </View>
                                                <View>

                                                    <TouchableOpacity onPress={() => this.excluirDespesa()}>
                                                        <View style={[styles.confirmDelete]}>
                                                            <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                            <Icon name="check" size={20} color="#00DFA8" />
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => this.setState({
                                                        modalDelDespesa: false,
                                                        despesaSelecionada: {
                                                            id: null,
                                                            descReceita: '',
                                                            valorParcela: '',
                                                        }
                                                    })} value={props.values.modalDelDespesa}>
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
                            }




                        </View>
                    )}

                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    // Botão calcular parcelas
    calcularParcelasBtn: {
        marginTop: 10,
    },
    // Fim botão calcular parcelas

    includesInputs: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 25,
        paddingTop: 10,
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
        fontFamily: 'Sarabun-Bold',
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
        color: '#77869E',
        paddingLeft: 5,
    },

    pickerView: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        backgroundColor: '#F6F6F6',
        marginTop: 7,
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
        marginTop: 7,

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
        marginTop: 10,
    },

    // Modal
    buttonClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E66060',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
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

    textModalDel: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#606060',
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

    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

    cancelDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 25,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
    },

    /*Fim Modal*/

    nenhumaConta: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 20,
        lineHeight: 24,
        color: '#606060',
        textAlign: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 35,
    }

});

