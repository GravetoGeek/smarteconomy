import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Picker, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import NumberFormat from 'react-number-format';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';

import api from '../../components/Api';
import { showSuccess } from '../../common'
import AsyncStorage from '@react-native-community/async-storage'


import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';

const SLIDER_WIDTH = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const ReviewSchema = yup.object({


});


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {

            modoEdicao: false,

            listaMeses: [
                {
                    id: 1,
                    descricao: 'Janeiro',
                },
                {
                    id: 2,
                    descricao: 'Fevereiro',
                },
                {
                    id: 3,
                    descricao: 'Março',
                },
                {
                    id: 4,
                    descricao: 'Abril',
                },
                {
                    id: 5,
                    descricao: 'Maio',
                },
                {
                    id: 6,
                    descricao: 'Junho',
                },
                {
                    id: 7,
                    descricao: 'Julho',
                },
                {
                    id: 8,
                    descricao: 'Agosto',
                },
                {
                    id: 9,
                    descricao: 'Setembro',
                },
                {
                    id: 10,
                    descricao: 'Outubro',
                },
                {
                    id: 11,
                    descricao: 'Novembro',
                },
                {
                    id: 12,
                    descricao: 'Dezembro',
                },
            ],

            // gastos: {
            //     idUsuario: 1,
            //     fill: 50, /*porcentagem gasto*/
            //     saldoGasto: '5.000,00',
            //     saldoAtual: '10.000,00',
            // },


            descConta: '',

            mesSelecionado: "",

            qtdeLancamentos: null,

            listaDespesas: [],

            listaLancamentos: [],

            despesaSelecionada: [{
                // // categoria: "",
                cor: "",
                descricao: "",
                flag: null,
                icone: "",
                id: null,
                mes: null,
                porcentagemReceita: null,
                qtde: null,
                saldo: null
            }],

            corWarning:'#00DFA8'

        }
    }

    componentDidMount = async () => {
        //pega os parâmetros que vieram junto com a navegação Relatórios > DetalheRelatórios
        const contaInfo = this.props.navigation.getParam('contaInfo', 'null')
        const despesaInfo = this.props.navigation.getParam('despesaInfo', 'null')
        const mesInfo = this.props.navigation.getParam('mesInfo', 'null')
        console.log(`DETALHE RELATORIO DESPESA ID: ${JSON.stringify(despesaInfo)}`)
        console.log(`DETALHE RELATORIO CONTA ID: ${contaInfo.id}`)
        console.log(`DETALHE RELATORIO MES ID: ${JSON.stringify(mesInfo)}`)


        if ((contaInfo !== "null") && (despesaInfo !== null)) {
            try{
                let response = await api.get(`/relatorio/subcategoria/porcentagem/${despesaInfo.idSubcategoria}`)
                const infoSubcategoria = response.data
                console.log(`INFOSUBCATEGORIA: ${infoSubcategoria[0].valorDisponivel}`)
                if(infoSubcategoria[0].valorDisponivel < 0){
                    console.log(`INFOSUBCATEGORIA VALOR DISPONÍVEL É MENOR QUE 0 ${JSON.stringify(infoSubcategoria.valorDisponivel)}`)
                    this.setState({
                        corWarning:'#F24750'
                    })
                }else{
                    console.log(`INFOSUBCATEGORIA VALOR DISPONÍVEL É MAIOR QUE 0 ${JSON.stringify(infoSubcategoria.valorDisponivel)}`)
                    this.setState({
                        corWarning:'#00DFA8'
                    })
                }
                this.setState({
                    descConta: infoSubcategoria[0].descricao,
                    despesaSelecionada: infoSubcategoria,
                    mesSelecionado: this.state.listaMeses[mesInfo - 1].descricao,
                })
            }catch (err) {
                console.log("deu erro1")
                Alert.alert("ERRO", err.response.data.erro);
                if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                    delete api.defaults.headers.common['Authorization']
                    AsyncStorage.removeItem('dadosUsuario')
                    AsyncStorage.removeItem('tokenUsuario')  
        
                    this.props.navigation.navigate('Login')
                }
            }
        } 

        try {
            let listaLancamentos = []
            let response = await api.get(`/despesa/${despesaInfo.idSubcategoria}/${contaInfo.id}/${mesInfo}`)
            console.log(`LISTA LANCAMENTOS: ${JSON.stringify(response.data)}`)
            listaLancamentos = response.data
            this.setState({
                listaLancamentos: listaLancamentos,
                qtdeLancamentos: listaLancamentos.length
            })
        } catch (err) {
            console.log("deu erro")
            Alert.alert("ERRO", err.response.data.erro);
            if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                delete api.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('dadosUsuario')
                AsyncStorage.removeItem('tokenUsuario')  
    
                this.props.navigation.navigate('Login')
            }
        }
    }

    handleSignInPress = async (values) => { }



    render() {

        const { listaContas, mesSelecionado, contaSelecionada, listaDespesas, descConta, despesaSelecionada, listaLancamentos } = this.state
        console.log(`Despesa selecionada: ${JSON.stringify(despesaSelecionada)}`)


        return (
            <View style={{ flex: 1 }}>
                <Formik
                    initialValues={{
                        listaContas: listaContas, mesSelecionado: mesSelecionado,
                        listaDespesas: listaDespesas, descConta: descConta, despesaSelecionada: despesaSelecionada, listaLancamentos: listaLancamentos
                    }}
                    enableReinitialize={true}
                    // validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View style={{ flex: 1 }}>
                            <View style={styles.includesTop}>
                                <Text style={styles.textSubtitle}>Detalhes subcategoria</Text>
                            </View>

                            {/* Combobox Conta */}
                            <View style={[styles.pickerViewC]}>
                                <Text style={styles.textConta}>{props.values.descConta}</Text>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={[styles.contentWhite, { flex: 1 }]}>

                                    {/* Gráfico circular */}
                                    <View style={styles.containerInfoHead}>
                                        <View style={styles.circularDashContainer}>
                                            <AnimatedCircularProgress
                                                style={styles.circularDash}
                                                size={Dimensions.get("window").width / 3}
                                                width={15}
                                                rotation={-0}
                                                lineCap="round"
                                                fill={props.values.despesaSelecionada[0].porcentagemReceita} /*barrinha colorida de progresso*/
                                                // arcSweepAngle={200}
                                                tintColor={this.state.corWarning}
                                                backgroundColor="#DFE7F5"
                                            >
                                                {
                                                    (fill) => (
                                                        <View style={styles.containerFill}>
                                                            <Text style={styles.textSpentBalance}>
                                                                {props.values.despesaSelecionada[0].porcentagemReceita}%
                                                            </Text>
                                                        </View>
                                                    )
                                                }
                                            </AnimatedCircularProgress>
                                        </View>

                                        <View style={styles.containerLateralText}>
                                            <Text style={styles.textValores}>Gasto: R${props.values.despesaSelecionada[0].saldo}</Text>
                                            <Text style={styles.textValores}>Limite: R${props.values.despesaSelecionada[0].valorMaximo}</Text>
                                            <Text style={[styles.textValorTotal, {color:this.state.corWarning}]}>Total: R${props.values.despesaSelecionada[0].valorDisponivel}</Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.lancamentosMes}>
                                            <Text style={styles.mesLancamentos}>{this.state.mesSelecionado}</Text>
                                            <Text style={styles.qtdeLancamentos}>{this.state.qtdeLancamentos} despesa(s)</Text>
                                        </View>

                                        <FlatList
                                            data={props.values.listaLancamentos}
                                            renderItem={({ item, index }) => (

                                                <TouchableOpacity onPress={() => console.log(`clicou na subcategoria: ` + item.categoria.icone)}>
                                                    <View style={[styles.alignCenter]}>
                                                        <View style={[styles.conteinerlistDespesas]}>
                                                            <View style={[styles.conteinerCategoria]}>
                                                                <View style={[styles.iconBox2, { backgroundColor: item.categoria.categoriaDespesa.cor }]}>
                                                                    {console.log(`ICONE: ${item.icone}`)}
                                                                    <Icon name={item.categoria.icone} size={17} color={'#FFF'} />
                                                                </View>
                                                                <View>
                                                                    <Text style={styles.descLancamentos}>{item.dtLancamento}</Text>
                                                                    <View style={{flexDirection:'row'}}>
                                                                        <Text style={styles.descDespesa}>{item.descDespesa}</Text>
                                                                        {(item.repeticao && item.qtdeParcelas > 0) &&
                                                                            <Text style={[styles.descricaoItemParcela]}>-{item.numParcela}/{item.qtdeParcelas}</Text>
                                                                        }
                                                                        {(item.repeticao && item.qtdeParcelas === 0) &&
                                                                            <Text style={[styles.descricaoItemParcela]}>- rep infinita</Text>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View style={[styles.listValorDesp]}>
                                                                <NumberFormat value={item.valorParcela} displayType={'text'} thousandSeparator={true} prefix={'R$'} renderText={value => <Text style={[{ paddingRight: 20,color:"#042C5C" }]}>{value}</Text>} />
                                                                {/* <Text style={[styles.porcentagemDespesa]}>{item.porcentagem*100}%</Text> */}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>

                                            )}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    // Container gráfico circular mais textos laterais
    containerInfoHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        // zIndex:0,
        // position:'relative',
    },

    containerLateralText: {
        paddingTop: 35,
        paddingRight: 20,
    },

    textValores: {
        textAlign: 'right',
        fontFamily: 'Roboto-Black',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 18,
        color: '#475062',
        paddingBottom: 10,
    },
    descricaoItemParcela: {
        fontFamily: 'Roboto-Black',
        fontWeight:'bold',
        fontSize: 14,
        color: '#475062',
        paddingLeft: 5,
    },

    textValorTotal: {
        fontFamily: 'Roboto-Black',
        fontWeight: 'bold',
        fontSize: 22,
        lineHeight: 18,
        // color: '#00DFA8',
        // textAlign: 'right',
        paddingTop: 20,
    },

    lancamentosMes: {
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
    },

    mesLancamentos: {
        fontFamily: 'Roboto-Black',
        fontSize: 20,
    },

    qtdeLancamentos: {
        paddingLeft: 20,
        fontFamily: 'Roboto-Black',
        fontSize: 15,
        color: '#A6AAB4'
    },

    /*Gráfico circular*/
    circularDashContainer: {
        paddingLeft: 10,
    },

    circularDash: {
        paddingTop: '7%',
        height: Dimensions.get("window").height * 0.27,
        // zIndex:3,
    },
    containerFill: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        // fontSize:20
    },
    textSpentBalance: {
        fontFamily: 'Baloo2-Bold',
        fontSize: 20,
        lineHeight: 40,
        color: '#042C5C',
    },

    /*Gráfico circular*/

    conteinerCategoria: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%'
    },

    conteinerlistDespesas: {
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 0.6,
        borderTopColor: '#CED2DA',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },

    pickerViewC: {
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#CED2DA',
        overflow: 'hidden',
        borderRadius: 5
    },

    textConta: {
        fontFamily: 'Roboto-Black',
        color: '#535454',
        height: 30,
        fontSize: 18,
        paddingLeft: 10,
    },

    pickerView: {
        justifyContent: 'center',
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#CED2DA',
        // backgroundColor: '#F6F6F6',
        borderRadius: 5,
        marginTop: 3,
        overflow: 'hidden'
    },

    listValorDesp: {
        alignItems: 'flex-end',
        width: '40%',
    },

    porcentagemDespesa: {
        paddingRight: 20,
        fontSize: 13,
        color: '#A6AAB4',
    },

    porcentDespesaChart: {
        fontSize: 13,
        color: '#A6AAB4',
    },

    alignCenter: {
        alignItems: 'center',
    },

    contentWhite: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 20,
        shadowRadius: 20,
        elevation: 50,
    },

    comboMeses: {
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    containerChart: {
        marginBottom: 20,
    },

    includesTop: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    textSubtitle: {
        fontFamily: 'Sarabun-Medium',
        fontSize: 18,
        lineHeight: 20,
        paddingBottom: 10,
        color: '#A6AAB4',
    },

    descDespesa: {
        fontFamily: 'Roboto-Regular',
        fontWeight:'bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#475062',
        paddingLeft: 15,
    },

    descLancamentos: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: '#475062',
        paddingLeft: 15,
    },

    containerChart2: {
        flex: 1,
        paddingTop: 6,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconBox: {
        width: 25,
        height: 25,
        alignItems: 'center',
        paddingTop: 3,
        borderRadius: 20,
    },

    iconBox2: {
        width: 30,
        height: 30,
        alignItems: 'center',
        padding: 5.5,
        borderRadius: 20,
    },

    iconBoxCircle: {
        width: 25,
        height: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
    },

});

