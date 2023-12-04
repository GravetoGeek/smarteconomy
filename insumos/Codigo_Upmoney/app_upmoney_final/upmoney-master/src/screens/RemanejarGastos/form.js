import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Modal, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import NumberFormat from 'react-number-format';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-community/async-storage'

import api from '../../components/Api';
import { showSuccess } from '../../common'

import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';

let auxValidation = 0;

const ReviewSchema = yup.object({

    listaCategoriasDespesa: yup.array()
        .when('modalCategoria', {
            is: true,
            then: yup.array().of(
                yup.object().shape({
                    porcentagem: yup.number()
                        .required('Este campo é obrigatório')
                        .typeError('Este campo é obrigatório')
                        .positive('O número deve ser positivo')
                        .min(0, 'O valor mínimo é 0%')
                        .max(100, 'O valor máximo é 100%')
                        .test("max", "Os valores não devem exceder 100% ", function (value) {

                            if (this.parent.id == 1) {
                                auxValidation = 100
                            }

                            auxValidation = auxValidation - value;


                            if (this.parent.id == 3) {
                                console.log(auxValidation == 0)
                                return auxValidation == 0;
                            }

                            return true;

                        }),
                })
            )
        }),


    itemSelecionado: yup.object().shape({
        valorLimite: yup.number()
            .nullable()
            .typeError('Este campo é obrigatório')
            .required('Este campo é obrigatório')
            .min(0, 'O valor mínimo é 0%')
            .positive('O número deve ser positivo')
    })


});


export default class Form extends Component {

    state = {

        idUsuario: null,

        categoriaSelecionada: {},

        modal: false,

        modalCategoria: false,

        //Subcategoria
        itemSelecionado: {
            id: null,
            descSubcategoria: '',
            valorLimite: null,
        },

        somaSubcategoriaLimite: 0,

        displayText: 'none',

        listaCategoriasDespesa: [
            {
                id: null,
                descCategoria: '',
                valorLimite: 0,
                porcentagem: null,
                porcentagemGasto: null,

            },
            {
                id: null,
                descCategoria: '',
                valorLimite: 0,
                porcentagem: null,
                porcentagemGasto: null,

            },
            {
                id: null,
                descCategoria: '',
                valorLimite: 0,
                porcentagem: null,
                porcentagemGasto: null,

            },
        ],

        subcategoriasDespesa: [],


    }

    buscarCategorias = async () => {

        //Variáveis para os Dados
        let response
        let responseValores
        let eachDespesa = {}
        let listaCategoriasDespesa = []


        try {

            //GET Valores Categoria Despesa
            responseValores = await api.get("/relatorio/categoriadespesa/analisegastos")

            //GET Informações Categoria Despesa
            response = await api.get("/remanejar/categoria/usuario")

            for (var i = 0; i < responseValores.data.length; i++) {

                eachDespesa = {}

                eachDespesa.id = response.data[i].categoria.id
                eachDespesa.descCategoria = response.data[i].categoria.descCategoria
                eachDespesa.valorLimite = responseValores.data[i].valorMaximo
                eachDespesa.valorGasto = responseValores.data[i].valorGasto
                eachDespesa.porcentagemGasto = responseValores.data[i].porcentagem
                eachDespesa.porcentagem = response.data[i].porcentagem
                eachDespesa.idLimite = response.data[i].id
                eachDespesa.cor = response.data[i].cor

                console.log(eachDespesa.porcentagemGasto)

                if (eachDespesa.porcentagemGasto <= 1 || eachDespesa.porcentagemGasto == null) {
                    eachDespesa.corWarning = '#FFFFFF'
                } else {
                    eachDespesa.corWarning = '#ffe0af'
                }

                listaCategoriasDespesa[i] = eachDespesa

            }

            this.setState({

                listaCategoriasDespesa: listaCategoriasDespesa,

            })

        } catch (err) {
            alert(err);
        }

    }

    buscarSubcategorias = async (item) => {

        console.log(item)

        let eachSubcategoria = {}
        let listaSubcategorias = []
        let somaSubcategoriaLimite = 0

        try {
            console.log(`ID DA CATEGORIA: ${item.id}`)
            //GET Informações Subcategoria Despesa
            response = await api.get(`/relatorio/subcategoria/porcentagem/categoria/${item.id}`)

            for (var i = 0; i < response.data.length; i++) {

                eachSubcategoria = {},

                    eachSubcategoria.id = response.data[i].idSubcategoria,
                    eachSubcategoria.descSubcategoria = response.data[i].descricao,
                    eachSubcategoria.valorGasto = response.data[i].saldo,
                    eachSubcategoria.valorLimite = response.data[i].valorMaximo,
                    eachSubcategoria.porcentagem = response.data[i].porcentagemReceita,
                    eachSubcategoria.idLimite = response.data[i].id,
                    eachSubcategoria.cor = response.data[i].cor

                if (eachSubcategoria.porcentagem <= 1) {
                    eachSubcategoria.corWarning = '#FFFFFF'
                } else {
                    eachSubcategoria.corWarning = '#ffe0af'
                }

                somaSubcategoriaLimite = somaSubcategoriaLimite + response.data[i].valorMaximo;

                listaSubcategorias[i] = eachSubcategoria

            }

            if (somaSubcategoriaLimite > item.valorLimite) {

                this.setState({
                    displayText: 'flex',
                })

            } else {
                this.setState({
                    displayText: 'none',
                })
            }

            this.setState({

                somaSubcategoriaLimite: somaSubcategoriaLimite,

                categoriaSelecionada: item,

                subcategoriasDespesa: listaSubcategorias

            })


        } catch (err) {
            alert(err);
        }

    }

    componentDidMount = async () => {


        //Variáveis para os Dados
        let response
        let responseValores
        let eachDespesa = {}
        let listaCategoriasDespesa = []
        let eachSubcategoria = {}
        let listaSubcategorias = []
        let somaSubcategoriaLimite = 0


        try {

            //GET Valores Categoria Despesa
            responseValores = await api.get("/relatorio/categoriadespesa/analisegastos")

            //GET Informações Categoria Despesa
            response = await api.get("/remanejar/categoria/usuario")

            for (var i = 0; i < responseValores.data.length; i++) {

                eachDespesa = {}

                eachDespesa.id = response.data[i].categoria.id
                eachDespesa.descCategoria = response.data[i].categoria.descCategoria
                eachDespesa.valorLimite = responseValores.data[i].valorMaximo
                eachDespesa.valorGasto = responseValores.data[i].valorGasto
                eachDespesa.porcentagemGasto = responseValores.data[i].porcentagem
                eachDespesa.porcentagem = response.data[i].porcentagem
                eachDespesa.idLimite = response.data[i].id
                eachDespesa.cor = response.data[i].cor

                if (eachDespesa.porcentagemGasto <= 1 || eachDespesa.porcentagemGasto == null) {
                    eachDespesa.corWarning = '#FFFFFF'
                } else {
                    eachDespesa.corWarning = '#ffe0af'
                }

                listaCategoriasDespesa[i] = eachDespesa


            }

            console.log(`Categoria: ${JSON.stringify(listaCategoriasDespesa[0])}`)
            console.log(`Categoria: ${JSON.stringify(listaCategoriasDespesa[1])}`)
            console.log(`Categoria: ${JSON.stringify(listaCategoriasDespesa[2])}`)

            //GET Informações Subcategoria Despesa
            response = await api.get(`/relatorio/subcategoria/porcentagem/categoria/${listaCategoriasDespesa[1].id}`)

            for (var i = 0; i < response.data.length; i++) {

                eachSubcategoria = {},

                    eachSubcategoria.id = response.data[i].idSubcategoria,
                    eachSubcategoria.descSubcategoria = response.data[i].descricao,
                    eachSubcategoria.valorGasto = response.data[i].saldo,
                    eachSubcategoria.valorLimite = response.data[i].valorMaximo,
                    eachSubcategoria.porcentagem = response.data[i].porcentagemReceita,
                    eachSubcategoria.idLimite = response.data[i].id
                    eachSubcategoria.cor = response.data[i].cor

                if (eachSubcategoria.porcentagem <= 1) {
                    eachSubcategoria.corWarning = '#FFFFFF'
                } else {
                    eachSubcategoria.corWarning = '#ffe0af'
                }

                somaSubcategoriaLimite = somaSubcategoriaLimite + response.data[i].valorMaximo;

                listaSubcategorias[i] = eachSubcategoria

            }

            if (somaSubcategoriaLimite > listaCategoriasDespesa[1].valorLimite) {

                this.setState({
                    displayText: 'flex',
                })

            }

            this.setState({

                categoriaSelecionada: {
                    id: listaCategoriasDespesa[1].id,
                    descCategoria: listaCategoriasDespesa[1].descCategoria,
                    valorLimite: listaCategoriasDespesa[1].valorLimite
                },

                somaSubcategoriaLimite: somaSubcategoriaLimite,

                listaCategoriasDespesa: listaCategoriasDespesa,

                subcategoriasDespesa: listaSubcategorias

            })


        } catch (err) {
            alert(err);
        }
    }


    handleSignInPress = async (values) => {

        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)
        } catch (e) {
            //sem usuário válido
        }

        let response

        if (values.modalCategoria) {

            // console.log(`Gastos Essenciais: ${values.listaCategoriasDespesa[1].porcentagem}`)
            // console.log(`Investimento: ${values.listaCategoriasDespesa[2].porcentagem}`)
            // console.log(`Estilo de Vida: ${values.listaCategoriasDespesa[0].porcentagem}`)



            for (var i = 0; i < 3; i++) {

                try {

                    console.log(values.listaCategoriasDespesa[i])
                    console.log(`ID Limite: ${JSON.stringify(values.listaCategoriasDespesa[i].idLimite)}`)
                    console.log(`Porcentagem: ${JSON.stringify(values.listaCategoriasDespesa[i].porcentagem)}`)
                    console.log(`ID Categoria: ${JSON.stringify(values.listaCategoriasDespesa[i].id)}`)
                    console.log(`ID Usuario: ${JSON.stringify(dadosUsuario.id)}`)

                    response = await api.put("remanejar/categoria/alterar", {
                        id: values.listaCategoriasDespesa[i].idLimite,
                        porcentagem: values.listaCategoriasDespesa[i].porcentagem,
                        categoria: {
                            id: values.listaCategoriasDespesa[i].id,
                        },
                        usuario: {
                            id: dadosUsuario.id
                        }

                    })


                } catch (err) {
                    alert(err);
                }

            }

            showSuccess('Limites Alterados!');

            this.buscarCategorias();

            this.setState({
                modalCategoria: false
            })

        }

        if (values.modal) {

            console.log(`Subcategoria ${JSON.stringify(values.itemSelecionado)}`)

            if (values.itemSelecionado.idLimite == 0) {

                console.log("Cadastrando um novo Limite!")

                try {
                    response = await api.post("remanejar/subcategoria/inserir", {
                        valorMaximo: values.itemSelecionado.valorLimite,
                        subcategoria: {
                            id: values.itemSelecionado.id,
                        },
                        usuario: {
                            id: dadosUsuario.id
                        }

                    })
                } catch (err) {
                    alert(err);
                }

            } else if (values.itemSelecionado.idLimite != 0) {

                console.log("Alterando um Limite!")

                try {
                    response = await api.put("remanejar/subcategoria/alterar", {
                        id: values.itemSelecionado.idLimite,
                        valorMaximo: values.itemSelecionado.valorLimite,
                        subcategoria: {
                            id: values.itemSelecionado.id,
                        },
                        usuario: {
                            id: dadosUsuario.id
                        }

                    })
                } catch (err) {
                    alert(err);
                }

            }

            showSuccess('Limite Alterado!');

            this.buscarSubcategorias(values.categoriaSelecionada)

            this.setState({
                modal: false
            })

        }




    }


    render() {

        const { meta, subcategoriasDespesa, categoriaSelecionada, modal, modalCategoria, itemSelecionado, itemCategoriaSelecionada,
            listaCategoriasDespesa, somaSubcategoriaLimite, displayText } = this.state

        return (
            <View>
                <Formik
                    initialValues={{
                        meta: meta, subcategoriasDespesa: subcategoriasDespesa, categoriaSelecionada: categoriaSelecionada,
                        modal: modal, modalCategoria: modalCategoria, itemSelecionado: itemSelecionado, itemCategoriaSelecionada: itemCategoriaSelecionada,
                        listaCategoriasDespesa: listaCategoriasDespesa, somaSubcategoriaLimite: somaSubcategoriaLimite, displayText: displayText
                    }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)
                    }
                >

                    {(props) => (
                        <View style={{ marginBottom: 10 }}>

                            {/* <Text style={sstyles.title}>Remanejar Gastos</Text> */}

                            {/* <View style={[styles.displayFlex, styles.spaceBetween, { marginTop: 10 }]}>

                                <Text style={styles.valor}>R${props.values.meta.valorMeta}</Text>
                                <Text style={styles.valor}>{props.values.meta.dtPrazoFinal}</Text>

                            </View> */}

                            <View style={[styles.displayFlex, styles.spaceBetween]}>

                                <TouchableOpacity style={[styles.boxCategoria, styles.center]} onPress={() => this.buscarSubcategorias(props.values.listaCategoriasDespesa[1])}>
                                    <Image source={require('../../assets/imgs/gastosEssenciais.png')} />
                                    <Text style={styles.textCategoria}>Gastos Essenciais</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.boxCategoria, styles.center]} onPress={() => this.buscarSubcategorias(props.values.listaCategoriasDespesa[2])}>
                                    <Image source={require('../../assets/imgs/investimento.png')} />
                                    <Text style={styles.textCategoria}>Investimento</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.boxCategoria, styles.center]} onPress={() => this.buscarSubcategorias(props.values.listaCategoriasDespesa[0])}>
                                    <Image source={require('../../assets/imgs/estiloVida.png')} />
                                    <Text style={styles.textCategoria}>Estilo de Vida</Text>
                                </TouchableOpacity>

                            </View>

                            {console.log(`Gastos Essenciais: ${JSON.stringify(props.values.listaCategoriasDespesa[1])}`)}

                            {categoriaSelecionada.descCategoria == "Gastos Essenciais" &&

                                <View>
                                    <View style={[styles.displayFlex, styles.alignCenter, styles.includesTextCategoria, styles.flexRow]}>
                                        <Text style={[styles.textBigCategoria]}>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[1].porcentagem} displayType={'text'} thousandSeparator={false} suffix={'%'} renderText={value => <Text>{value}</Text>} />
                                            <Text> | </Text>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[1].valorLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} />
                                        </Text>
                                        <TouchableOpacity onPress={() => this.setState({
                                            modalCategoria: true,
                                        })}>
                                            <Icon name="edit" style={{ paddingLeft: 15 }} size={15} color="#9A9696" />
                                        </TouchableOpacity>

                                    </View>

                                    <View style={[styles.displayFlex, styles.boxContainer, styles.alignCenter, { backgroundColor: props.values.listaCategoriasDespesa[1].corWarning }]}>
                                        <Image source={require('../../assets/imgs/gastosEssenciais.png')} />
                                        <View style={[styles.contentContainer, styles.flex]}>
                                            <View style={[styles.displayFlex, styles.spaceBetween, styles.alignCenter]}>
                                                <Text style={styles.textContainer}>{props.values.listaCategoriasDespesa[1].descCategoria}</Text>
                                                <Text style={styles.valorContainer}><NumberFormat value={props.values.listaCategoriasDespesa[1].valorGasto} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} /></Text>
                                            </View>
                                            <View style={styles.flex}>
                                                <Progress.Bar
                                                    color="#F24750"
                                                    unfilledColor="#E2E2E2"
                                                    borderColor="transparent"
                                                    height={5}
                                                    progress={props.values.listaCategoriasDespesa[1].porcentagemGasto}
                                                    width={null}
                                                />

                                            </View>

                                        </View>
                                    </View>
                                </View>

                            }

                            {categoriaSelecionada.descCategoria == "Investimento" &&

                                <View>
                                    <View style={[styles.displayFlex, styles.alignCenter, styles.includesTextCategoria, styles.flexRow]}>
                                        <Text style={[styles.textBigCategoria]}>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[2].porcentagem} displayType={'text'} thousandSeparator={false} suffix={'%'} renderText={value => <Text>{value}</Text>} />
                                            <Text> | </Text>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[2].valorLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} />
                                        </Text>
                                        <TouchableOpacity onPress={() => this.setState({
                                            modalCategoria: true,
                                        })}>
                                            <Icon name="edit" style={{ paddingLeft: 15 }} size={15} color="#9A9696" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.displayFlex, styles.boxContainer, styles.alignCenter, { backgroundColor: props.values.listaCategoriasDespesa[2].corWarning }]}>
                                        <Image source={require('../../assets/imgs/investimento.png')} />
                                        <View style={[styles.contentContainer, styles.flex]}>
                                            <View style={[styles.displayFlex, styles.spaceBetween, styles.alignCenter]}>
                                                <Text style={styles.textContainer}>{props.values.listaCategoriasDespesa[2].descCategoria}</Text>
                                                <Text style={styles.valorContainer}><NumberFormat value={props.values.listaCategoriasDespesa[2].valorGasto} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} /></Text>
                                            </View>
                                            <View style={styles.flex}>
                                                <Progress.Bar
                                                    color="#F24750"
                                                    unfilledColor="#E2E2E2"
                                                    borderColor="transparent"
                                                    height={5}
                                                    progress={props.values.listaCategoriasDespesa[2].porcentagemGasto}
                                                    width={null}
                                                />
                                            </View>

                                        </View>
                                    </View>
                                </View>

                            }

                            {categoriaSelecionada.descCategoria == "Estilo de Vida" &&

                                <View>
                                    <View style={[styles.displayFlex, styles.alignCenter, styles.includesTextCategoria, styles.flexRow]}>
                                        <Text style={[styles.textBigCategoria]}>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[0].porcentagem} displayType={'text'} thousandSeparator={false} suffix={'%'} renderText={value => <Text>{value}</Text>} />
                                            <Text> | </Text>
                                            <NumberFormat value={props.values.listaCategoriasDespesa[0].valorLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} />
                                        </Text>
                                        <TouchableOpacity onPress={() => this.setState({
                                            modalCategoria: true,
                                        })}>
                                            <Icon name="edit" style={{ paddingLeft: 15 }} size={15} color="#9A9696" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.displayFlex, styles.boxContainer, styles.alignCenter, { backgroundColor: props.values.listaCategoriasDespesa[0].corWarning }]}>
                                        <Image source={require('../../assets/imgs/estiloVida.png')} />
                                        <View style={[styles.contentContainer, styles.flex]}>
                                            <View style={[styles.displayFlex, styles.spaceBetween, styles.alignCenter]}>
                                                <Text style={styles.textContainer}>{props.values.listaCategoriasDespesa[0].descCategoria}</Text>
                                                <Text style={styles.valorContainer}><NumberFormat value={props.values.listaCategoriasDespesa[0].valorGasto} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} /></Text>
                                            </View>
                                            <View style={styles.flex}>
                                                <Progress.Bar
                                                    color="#F24750"
                                                    unfilledColor="#E2E2E2"
                                                    borderColor="transparent"
                                                    height={5}
                                                    progress={props.values.listaCategoriasDespesa[0].porcentagemGasto}
                                                    width={null}
                                                />
                                            </View>

                                        </View>
                                    </View>
                                </View>

                            }

                            <Text style={[styles.textLimite, { display: displayText }]}>Os limites das subcategorias (
                                <NumberFormat value={this.state.somaSubcategoriaLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} />
                            ) ultrapassam o limite da categoria {categoriaSelecionada.descCategoria} (
                                <NumberFormat value={this.state.categoriaSelecionada.valorLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text>{value}</Text>} />
                            )</Text>

                            <View style={styles.boxCategorias}>
                                <Text style={styles.textCategorias}>Subcategorias</Text>
                            </View>

                            <FlatList
                                data={props.values.subcategoriasDespesa}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => this.setState({
                                        modal: true,
                                        itemSelecionado: item
                                    })}>
                                        <View style={[styles.displayFlex, styles.eachItem, styles.alignCenter, { borderRadius: 10, padding:10,backgroundColor: item.corWarning }]}>

                                            <View style={[styles.circle,{backgroundColor:item.cor}]}></View>
                                            <View style={[styles.includesSubcategoria, styles.flex]} >

                                                <View style={[styles.displayFlex, styles.spaceBetween, { paddingBottom: 2 }]}>
                                                    <Text style={styles.textSubcategoria}>{item.descSubcategoria}</Text>
                                                    <NumberFormat value={item.valorLimite} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.valorSubcategoria}>{value}</Text>} />
                                                </View>

                                                <Progress.Bar
                                                    color="#F24750"
                                                    unfilledColor="#E2E2E2"
                                                    borderColor="transparent"
                                                    height={5}
                                                    progress={item.porcentagem}
                                                    width={null}
                                                />

                                                <View style={[styles.displayFlex, styles.spaceBetween, { paddingTop: 8 }]}>
                                                    <NumberFormat value={item.valorGasto} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.textSubcategoria}>{value}</Text>} />
                                                    <NumberFormat value={item.porcentagem * 100} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} suffix={'%'} renderText={value => <Text style={styles.textSubcategoria}>{value}</Text>} />
                                                </View>

                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )}
                            />

                            {/* Modal para Categoria */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalCategoria}
                            >

                                <View style={styles.screenCenter}>
                                    <View style={styles.modalContent}>
                                        <Text style={[styles.textModal, { textAlign: 'center' }]}>Alterar Porcentagens das Categorias</Text>

                                        <Text style={styles.label}>Gastos Essenciais</Text>

                                        <TextInputMask
                                            style={styles.input}
                                            keyboardType={"decimal-pad"}
                                            type={'money'}
                                            placeholder={'0%'}
                                            options={{
                                                precision: 2,
                                                separator: '',
                                                delimiter: '',
                                                unit: '',
                                                suffixUnit: '%'
                                            }}
                                            includeRawValueInChangeText={true}
                                            value={props.values.listaCategoriasDespesa[1].porcentagem || ''}
                                            onChangeText={(maskedText, rawText) => {
                                                props.setFieldValue('listaCategoriasDespesa[1].porcentagem', rawText)
                                            }}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="listaCategoriasDespesa[1].porcentagem" />


                                        <Text style={styles.label}>Investimento</Text>

                                        <TextInputMask
                                            style={styles.input}
                                            keyboardType={"decimal-pad"}
                                            type={'money'}
                                            placeholder={'0%'}
                                            options={{
                                                precision: 2,
                                                separator: '',
                                                delimiter: '',
                                                unit: '',
                                                suffixUnit: '%'
                                            }}
                                            includeRawValueInChangeText={true}
                                            value={props.values.listaCategoriasDespesa[2].porcentagem || ''}
                                            onChangeText={(maskedText, rawText) => {
                                                props.setFieldValue('listaCategoriasDespesa[2].porcentagem', rawText)
                                            }}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="listaCategoriasDespesa[2].porcentagem" />

                                        <Text style={styles.label}>Estilo de Vida</Text>

                                        <TextInputMask
                                            style={styles.input}
                                            keyboardType={"decimal-pad"}
                                            type={'money'}
                                            placeholder={'0%'}
                                            options={{
                                                precision: 2,
                                                separator: '',
                                                delimiter: '',
                                                unit: '',
                                                suffixUnit: '%'
                                            }}
                                            includeRawValueInChangeText={true}
                                            value={props.values.listaCategoriasDespesa[0].porcentagem || ''}
                                            onChangeText={(maskedText, rawText) => {
                                                props.setFieldValue('listaCategoriasDespesa[0].porcentagem', rawText)
                                            }}
                                        />

                                        <ErrorMessage style={styles.error} component={Text} name="listaCategoriasDespesa[0].porcentagem" />


                                        <View style={[styles.flexEnd, styles.flexRow]}>
                                            <View style={[styles.includesButton, styles.spaceBetween, styles.flexRow]}>
                                                <TouchableOpacity onPress={() => this.setState({
                                                    modalCategoria: false,
                                                    itemCategoriaSelecionada: {
                                                        id: null,
                                                        descCategoria: '',
                                                        porcentagem: null,
                                                    }
                                                })} value={props.values.modal}>
                                                    <Text style={styles.textAction}>CANCELAR</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={props.handleSubmit}>
                                                    <Text style={styles.textAction}>ENVIAR</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                </View>


                            </Modal>

                            {/* Modal para Subcategoria */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modal}
                            >

                                <View style={styles.screenCenter}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.textModal}>Alterar valor da meta de <Text style={styles.bold}>{props.values.itemSelecionado.descSubcategoria}</Text></Text>
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
                                            value={props.values.itemSelecionado.valorLimite || ''}
                                            onChangeText={(maskedText, rawText) => {
                                                props.setFieldValue('itemSelecionado.valorLimite', rawText)
                                            }}
                                        />

                                        {console.log(JSON.stringify(props.values.itemSelecionado))}

                                        <ErrorMessage style={styles.error} component={Text} name="itemSelecionado.valorLimite" />

                                        <View style={[styles.flexEnd, styles.flexRow]}>
                                            <View style={[styles.includesButton, styles.spaceBetween, styles.flexRow]}>
                                                <TouchableOpacity onPress={() => this.setState({
                                                    modal: false,
                                                    itemSelecionado: {
                                                        id: null,
                                                        descSubcategoria: '',
                                                        valorLimite: null,
                                                    }
                                                })} value={props.values.modal}>
                                                    <Text style={styles.textAction}>CANCELAR</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={props.handleSubmit}>
                                                    <Text style={styles.textAction}>ENVIAR</Text>
                                                </TouchableOpacity>

                                            </View>
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

    // Estilizações FlexBox

    displayFlex: {
        flex: 1,
        flexDirection: 'row',
    },

    flex: {
        flex: 1,
    },

    flexRow: {
        flexDirection: 'row',
    },

    spaceBetween: {
        justifyContent: 'space-between'
    },

    spaceAround: {
        justifyContent: 'space-around'
    },

    flexEnd: {
        justifyContent: 'flex-end',
    },

    alignCenter: {
        alignItems: 'center',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Estilizações da Tela

    title: {
        fontWeight: '700',
        fontSize: 25,
        lineHeight: 29,
        color: '#5F5D5D',
    },

    valor: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 23,
        color: '#969494',
    },

    boxCategoria: {
        width: 90,
        height: 110,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 3,
    },

    textCategoria: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        textAlign: 'center',
        color: '#77869E',
        marginTop: 7,
    },

    boxContainer: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 6,
        paddingRight: 15,
        elevation: 1,
    },

    contentContainer: {
        paddingLeft: 5,
    },

    textContainer: {
        fontFamily: 'Roboto-Black',
        fontSize: 13,
        lineHeight: 15,
        color: '#042C5C',
    },

    valorContainer: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 16,
        lineHeight: 24,
        color: '#F24750',
    },

    boxCategorias: {
        marginTop: 30,
    },

    textCategorias: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 18,
        lineHeight: 28,
        color: '#3B414B',
    },

    eachItem: {
        paddingTop: 10,
        paddingBottom: 10,
    },

    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },

    includesSubcategoria: {
        paddingLeft: 10,
    },

    textSubcategoria: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 14,
        color: '#5F5D5D',
    },

    valorSubcategoria: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#F24750',
    },

    iconMenu: {
        marginLeft: 35,
    },

    includesTextCategoria: {
        paddingTop: 40,
    },

    textBigCategoria: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 25,
        lineHeight: 28,
        color: '#3B414B',
    },

    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '70%',
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
        padding: 25,
    },

    textModal: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#5F5D5D',
    },

    bold: {
        fontFamily: 'Roboto-Black'
    },

    input: {
        fontFamily: 'Roboto-Medium',
        width: '100%',
        height: 50,
        fontSize: 20,
        paddingLeft: 5,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 2,
        color: '#042C5C',
    },

    includesButton: {
        width: 150,
        paddingTop: 20,
    },

    textAction: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#009688',
    },

    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#77869E',
        paddingTop: 15,
    },

    error: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },

    textLimite: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        lineHeight: 20,
        paddingTop: 20,
        textAlign: 'center',
        color: '#FF0000',
    },

});

