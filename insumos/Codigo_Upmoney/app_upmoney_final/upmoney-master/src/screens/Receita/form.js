import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Picker, TouchableOpacity, Modal, ActivityIndicator,Alert } from 'react-native';
import { ButtonBlue, ButtonText, ButtonRed, ButtonTextRed, ButtonGreen, ButtonTextSimple } from '../../components/Components';
import DatePicker from 'react-native-datepicker';
import { TextInputMask } from 'react-native-masked-text';
import NumberFormat from 'react-number-format';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import api from '../../components/Api';
import { showSuccess } from '../../common';

import { ErrorMessage, Formik } from 'formik';
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

            idReceita: null,

            idRepeticao: null,

            numParcela: null,

            modalDelReceita: false,

            modalText: false,


            conta:
            {
                id: null,
                descConta: 'Selecione a Conta',
                valorInicial: null,
                cor: '',
            },

            receitaSelecionada: {
                id: null,
                descReceita: '',
                valorParcela: null,
            },

            descricao: '',

            valorTotal: null,

            valorParcela: null,

            switchAltera: false,

            dtLancamento: null,

            categoria: {
                id: null,
                descCategoria: 'Selecione a Categoria',
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
                // {
                //     id: null,
                //     descConta: '',
                //     valorInicial: null,
                //     cor: '',

                // },
            ],

            listaCategorias: [
                {
                    id: null,
                    descCategoria: '',
                },

            ]

        };

        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.reloadListaCategorias()
            }
        );

    }

    reloadListaCategorias = async () => {
        try {
            let response = await api.get("/categoria/receita/todas")

            // console.log(`categorias: ${JSON.stringify(response.data)}`)
            const listaCategoriasUsuario = response.data

            this.setState({
                listaCategorias: listaCategoriasUsuario
            })

        } catch (err) {
            alert(err);
        }
    }

    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    consultaSaldo = async (item) => {
        let response = await api.get(`conta/saldo/${item.id}`)
        // console.log(`Saldo da conta: ${response.data}`)
        item.valorInicial = response.data

    }

    excluirReceita = async () => {

        console.log(` Id Receita a ser excluída: ${this.state.idReceita}`)
        let response = await api.delete(`receita/excluir/${this.state.idReceita}`)

        showSuccess('Receita Excluída!')

        this.setState({
            modalDelReceita: false
        })

        this.props.navigation.navigate('Contas');
    }

    componentDidMount = async () => {
        let listaContasUsuario = []
        let listaCategoriasUsuario = []
        let listaTiposRepeticao = []


        const receitaEdicao = this.props.navigation.getParam('receitaEdicao', 'null')

        console.log(`Receita a ser alterada: ${JSON.stringify(receitaEdicao)}`)

        if (receitaEdicao !== "null") {
            const modoEdicao = true

            this.consultaSaldo(receitaEdicao)
            const conta = { ...receitaEdicao.conta }
            const idReceita = receitaEdicao.id
            const numParcela = receitaEdicao.numParcela
            const idRepeticao = receitaEdicao.idRepeticao
            const descricao = receitaEdicao.descReceita
            const dtLancamento = receitaEdicao.dtLancamento
            const valorTotal = receitaEdicao.valorTotalReceita
            const valorParcela = receitaEdicao.valorParcela

            const categoria = { ...receitaEdicao.categoria }

            console.log(`repetição: ${receitaEdicao.repeticao}`)
            // if (receitaEdicao.repeticao) {
            const tipoRepeticao = { ...receitaEdicao.tipoRepeticao }

            const qtdParcela = receitaEdicao.qtdeParcelas
            this.setState({
                repeticao: receitaEdicao.repeticao, tipoRepeticao: tipoRepeticao, qtdParcela: qtdParcela,
                // valorParcela: valorParcela
            })
            // this.state.qtdParcela = qtdParcela
            // }

            this.setState({
                conta: conta, modoEdicao: modoEdicao, descricao: descricao, dtLancamento: dtLancamento, valorParcela: valorParcela, categoria: categoria,
                idReceita: idReceita, idRepeticao: idRepeticao, numParcela: numParcela, valorTotal: valorTotal
            })


            console.log(`Valor total sem state: ${valorTotal}`)
            // console.log(`Valor total: ${this.state.valorTotal}`)
        }

        try {
            let response = await api.get("conta/usuario")
            let listaContasUsuario = response.data

            listaContasUsuario.map((item) => (
                this.consultaSaldo(item)
            ))

            response = await api.get("/categoria/receita/todas")

            // console.log(`categorias: ${JSON.stringify(response.data)}`)
            let listaCategoriasUsuario = response.data

            response = await api.get('receita/tiposRepeticao')
            // console.log(`categorias: ${JSON.stringify(response.data)}`)
            listaTiposRepeticao = response.data

            this.setState({
                listaContas: listaContasUsuario, listaCategorias: listaCategoriasUsuario, listaTiposRepeticao: listaTiposRepeticao,

            })

        } catch (err) {
            alert(err);
        }
    }


    addCategoriaReceita = () => {

        // AsyncStorage.setItem('atualizaComboCategoria', 'true')

        // }
        // console.log(`Obj para retornar preenchido depois de cadastrar subcategoria: ${JSON.stringify(objReceita)}`)

        this.props.navigation.navigate('CategoriaReceita');

    }

    handleSignInPress = async (values,{resetForm, setSubmitting}) => {
        console.log('*************************************')
        console.log(`Id receita quando é edição: ${this.state.idReceita}`)
        console.log(`Descrição: ${values.descricao}`)
        console.log(`Data de Lançamento: ${values.dtLancamento}`)
        console.log(`Repetição: ${values.repeticao}`)
        console.log(`Quantidade de Parcela: ${values.qtdParcela}`)
        console.log(`Valor Parcela: ${values.valorParcela}`)
        console.log(`Valor Total: ${this.state.valorTotal}`)
        console.log(`Id da repeticao mãe: ${this.state.idRepeticao}`)
        console.log(`Id da seuqencia de numero parcela: ${this.state.numParcela}`)
        console.log(`ID Tipo Repeticao: ${values.tipoRepeticao.id}`)
        console.log(`Desc Tipo Repeticao: ${values.tipoRepeticao.descTipoRepeticao}`)
        console.log(`Conta id: ${values.conta.id}`)
        console.log(`Desc conta: ${values.conta.descConta}`)
        console.log(`Id Categoria: ${values.categoria.id}`)
        console.log(`Categoria: ${values.categoria.descCategoria}`)

        if (this.state.modoEdicao) {
            let urlAlterar = ''

            if (values.switchAltera) {
                console.log("Irá alterar a sequência de receitas")
                urlAlterar = "/receita/alterar/receitas"
            } else {
                console.log("Irá alterar apenas essa parcela")
                urlAlterar = "/receita/alterar"
            }

            // SE NÃO FOR UMA RECEITA COM REPETIÇÃO 
            if (!values.repeticao) {
                try {
                    console.log("Sem repetição")
                    const response = await api.put(`${urlAlterar}`, {
                        id: this.state.idReceita,
                        descReceita: values.descricao,
                        dtLancamento: values.dtLancamento,
                        idRepeticao: this.state.idRepeticao,
                        numParcela: this.state.numParcela,
                        qtdeParcelas: values.qtdParcela,
                        repeticao: values.repeticao,
                        valorParcela: values.valorParcela,
                        valorTotalReceita: values.valorParcela,
                        categoria: {
                            id: values.categoria.id
                        },
                        conta: {
                            id: values.conta.id
                        },

                    })
                } catch (err) {
                    Alert.alert("ERRO", err.response.data.erro);
                    setSubmitting(false)
                }
            } else {
                // SE É UMA RECEITA COM REPETIÇÃO, QUE TIPO DE REPETIÇÃO É
                if (values.tipoRepeticao.descTipoRepeticao == "Repetição Infinita") {
                    try {
                        const response = await api.put(`${urlAlterar}`, {
                            id: this.state.idReceita,
                            descReceita: values.descricao,
                            dtLancamento: values.dtLancamento,
                            idRepeticao: this.state.idRepeticao,
                            numParcela: this.state.numParcela,
                            qtdeParcelas: values.qtdParcela,
                            repeticao: values.repeticao,
                            valorParcela: values.valorParcela,
                            valorTotalReceita: this.state.valorTotal,
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.categoria.id
                            }
                        })
                    } catch (err) {
                        Alert.alert("ERRO", err.response.data.erro);
                        setSubmitting(false)
                    }

                } else {

                    try {
                        const response = await api.put(`${urlAlterar}`, {
                            id: this.state.idReceita,
                            descReceita: values.descricao,
                            dtLancamento: values.dtLancamento,
                            idRepeticao: this.state.idRepeticao,
                            numParcela: this.state.numParcela,
                            qtdeParcelas: values.qtdParcela,
                            repeticao: values.repeticao,
                            valorParcela: values.valorParcela,
                            valorTotalReceita: this.state.valorTotal,
                            tipoRepeticao: {
                                id: values.tipoRepeticao.id
                            },
                            conta: {
                                id: values.conta.id
                            },
                            categoria: {
                                id: values.categoria.id
                            }
                        })
                    } catch (err) {
                        Alert.alert("ERRO", err.response.data.erro);
                    }

                }
            }
            showSuccess('Receita Alterada!')
            setSubmitting(false)
            resetForm()
            this.props.navigation.navigate('Contas');

        } else {
            if (!values.repeticao) {
                try {
                    const response = await api.post("/receita/inserir", {
                        descReceita: values.descricao,
                        valorTotalReceita: values.valorParcela,
                        dtLancamento: values.dtLancamento,
                        repeticao: false,
                        conta: {
                            id: values.conta.id
                        },
                        categoria: {
                            id: values.categoria.id
                        }
                    })
                } catch (err) {
                    Alert.alert("ERRO", err.response.data.erro);
                    setSubmitting(false)
                }
            } else {
                if (values.tipoRepeticao.descTipoRepeticao == "Repetição Infinita") {
                    const response = await api.post("/receita/inserir", {
                        descReceita: values.descricao,
                        valorTotalReceita: values.valorParcela,
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
                            id: values.categoria.id
                        }
                    })
                } else {
                    const response = await api.post("/receita/inserir", {
                        descReceita: values.descricao,
                        valorTotalReceita: values.valorParcela,
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
                            id: values.categoria.id
                        }
                    })
                }
            }
            showSuccess('Receita Cadastrada!')
            setSubmitting(false)
            resetForm()
        }
        
        // chama novamente para atualizar saldo da conta depois que uma nova receita é cadastrada
        this.state.listaContas.map((item) => (
            this.consultaSaldo(item)
        ))

    }

    render() {

        const { conta, descricao, valorParcela, dtLancamento, categoria, repeticao, qtdParcela, tipoRepeticao, listaContas,
            listaCategorias, listaTiposRepeticao, modoEdicao, modalDelReceita, modalText, selectItemConta, switchAltera } = this.state
        console.log(`Valor total: ${this.state.valorTotal}`)
        return (
            <View>
                <Formik
                    initialValues={{
                        conta: conta, descricao: descricao, valorParcela: valorParcela, dtLancamento: dtLancamento, categoria: categoria,
                        repeticao: repeticao, qtdParcela: qtdParcela, tipoRepeticao: tipoRepeticao, listaContas: listaContas, selectItemConta: selectItemConta,
                        listaCategorias: listaCategorias, listaTiposRepeticao: listaTiposRepeticao, modoEdicao: modoEdicao, modalDelReceita: modalDelReceita,
                        modalText: modalText, switchAltera: switchAltera
                    }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values, { resetForm, setSubmitting}) => {
                        this.handleSignInPress(values,{resetForm, setSubmitting})
                        // resetForm()
                    }}
                >

                    {(props) => (

                        <View>
                            {props.isSubmitting && <ActivityIndicator/>}
                            
                            {(props.values.listaContas.length == 0 && !props.isSubmitting) &&

                                <View>
                                    <Text style={styles.nenhumaConta}>Para adicionar uma receita, voce precisa possuir ao menos uma conta cadastrada</Text>
                                </View>

                            }


                            {(props.values.listaContas.length > 0 && !props.isSubmitting) &&

                                <View>
                                    <View style={styles.includesInputs}>

                                        {/* Saldo e Conta */}
                                        <Text style={styles.label}>Saldo da conta</Text>

                                        {this.isEmpty(props.values.valorInicial) &&

                                            <NumberFormat value={props.values.conta.valorInicial} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.labelSaldo}>{value}</Text>} />

                                        }

                                        <View style={styles.pickerView}>

                                            <Picker
                                                style={styles.picker}
                                                selectedValue={props.values.conta}
                                                onValueChange={value => {
                                                    // this.setConta(value),
                                                    props.setFieldValue('conta', value)
                                                }}
                                            >

                                                <Picker.Item label={this.state.conta.descConta} color="#042C5C" value={this.state.conta.descConta} />


                                                {this.state.listaContas.map((item, index) => (
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
                                                    keyboardType={"decimal-pad"}
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
                                                    value={props.values.valorParcela || ''}
                                                    onChangeText={(maskedText, rawText) => {
                                                        props.setFieldValue('valorParcela', rawText)
                                                    }}
                                                />

                                                <ErrorMessage style={styles.error} component={Text} name="valorParcela" />
                                            </View>

                                        </View>

                                        {/* Categoria */}
                                        <Text style={styles.label}>Categoria</Text>

                                        <View style={styles.elementsSide}>

                                            <View style={{ flex: 4 }}>

                                                <View style={styles.pickerView}>

                                                    <Picker
                                                        style={styles.picker}
                                                        selectedValue={props.values.categoria}
                                                        onValueChange={value => {
                                                            props.setFieldValue('categoria', value),
                                                                this.reloadListaCategorias
                                                        }}
                                                    >
                                                        <Picker.Item label={this.state.categoria.descCategoria} color="#042C5C" value={this.state.categoria.descCategoria} />


                                                        {props.values.listaCategorias.map((item, index) => (
                                                            item.descConta !== this.state.categoria.descCategoria &&
                                                            <Picker.Item label={item.descCategoria} color="#042C5C" key={item.id} value={item} />
                                                        ))}

                                                    </Picker>
                                                </View>

                                            </View>

                                            <View style={{ flex: 1 }}>

                                                <TouchableOpacity style={styles.buttonAdd} onPress={this.addCategoriaReceita}>
                                                    <Text style={styles.textAdd}>+</Text>
                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                        <ErrorMessage style={styles.error} component={Text} name="categoria.id" />

                                        {/* Switch Repetição */}
                                        <View style={[styles.switchSide, { marginTop: 10 }]}>
                                            <Switch
                                                trackColor={{ false: "#232d3a", true: "#06C496" }}
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
                                                }

                                                value={props.values.modalText}>
                                                <Icon2 name="question-circle" size={18} color="#212844" />
                                            </TouchableOpacity>
                                        </View>


                                        {/* Campos Repetição */}

                                        {
                                            props.values.repeticao &&
                                            <View>

                                                <Text style={styles.label}>Tipo de Parcelamento</Text>

                                                <View style={styles.pickerView}>
                                                    <Picker
                                                        style={styles.picker}
                                                        selectedValue={props.values.tipoRepeticao}
                                                        onValueChange={value => {
                                                            props.setFieldValue('tipoRepeticao', value)
                                                        }}
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

                                        }

                                        {this.state.modoEdicao && props.values.repeticao &&
                                            <View style={[styles.switchSide, { paddingTop: 5 }]}>
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

                                        {
                                            !this.state.modoEdicao && props.values.repeticao && props.values.tipoRepeticao.descTipoRepeticao != "Repetição Infinita" &&

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
                                                modalDelReceita: true
                                            })}>
                                                <ButtonRed>
                                                    <ButtonTextRed>Deletar Receita</ButtonTextRed>
                                                </ButtonRed>
                                            </TouchableOpacity>}

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



                                    {/* Modal Delete Receita*/}
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={props.values.modalDelReceita}
                                    >
                                        <View style={styles.screenCenter}>
                                            <View style={[styles.modalContent, { width: '70%' }]}>
                                                <View style={styles.modalTitle}>
                                                    {props.values.modalDelReceita &&
                                                        <Text style={styles.contentModalTitle}>Excluir {props.values.descricao} ?</Text>

                                                    }

                                                </View>
                                                <View>

                                                    <TouchableOpacity onPress={() => this.excluirReceita()}>
                                                        <View style={[styles.confirmDelete]}>
                                                            <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                            <Icon name="check" size={20} color="#00DFA8" />
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => this.setState({
                                                        modalDelReceita: false,
                                                        receitaSelecionada: {
                                                            id: null,
                                                            descReceita: '',
                                                            valorParcela: '',
                                                        }
                                                    })} value={props.values.modalDelReceita}>
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
    },

    // Modal

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

    buttonClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E66060',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
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

