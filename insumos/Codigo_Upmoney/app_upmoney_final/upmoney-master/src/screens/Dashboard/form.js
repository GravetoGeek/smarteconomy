import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Keyboard, Text, Dimensions, ScrollView, TouchableOpacity, Modal,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import NumberFormat from 'react-number-format';
import AsyncStorage from '@react-native-community/async-storage'

// import AnimatedCircularProgress from '../../components/AnimatedCircularProgress';
import PieChart from '../../components/PieChart';
import StackedBarChart from '../../components/StackedBarChart';
import Header from '../../components/Header';

import api from '../../components/Api';
import { showSuccess } from '../../common';

import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';
import { array } from 'prop-types';

const screenWidth = Dimensions.get("window").width;


export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalText: false,

            textExplicacao:'',
            
            gastos: {
                idUsuario: null,
                fill: 0, /*porcentagem gasto*/
                saldoGasto: 0,
                saldoAtual: 0
            },

            despesaReceita: {
                labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
                legend: ["Receitas", "Despesas"],
                data: [[0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100], [0, 0, 100]],
                barColors: ["#00DFA8", "#F24750", "#f3f3f3"],
            },

            topDespesas: [],

            gastosCategoriasMae: [],

            totalCategoriasMae: 0
        }

        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.reloadData()
            }
        );

    }

    reloadData = async () => {

        //Variáveis para os Dados
        let valorGasto = 0
        let valorTotal = 0
        let fill = 0
        let eachData = []
        let dataGrafico = []
        let eachDespesa = {}
        let topDespesa = []
        let eachGasto = {}
        let todosGastos = []
        let valorTotalGasto = 0

        try {

            // //GET de Valores
            let response = await api.get("/relatorio/situacaogeral")

            fill = response.data.porcentagemDespesa
            valorTotal = response.data.valorDisponivel
            valorGasto = response.data.valorGasto



            //GET do gráfico Mensal
            response = await api.get("/relatorio/analisemensal")

            for (var i = 0; i < response.data.length; i++) {

                eachData = []

                eachData[0] = response.data[i].porcentagemReceita
                eachData[1] = response.data[i].porcentagemDespesa

                if ((response.data[i].porcentagemReceita == 0 && response.data[i].porcentagemDespesa == 0)) {
                    eachData[2] = 100
                } else {
                    eachData[2] = 0
                }

                dataGrafico[i] = eachData

            }


            //GET Top Despesas
            response = await api.get("/relatorio/subcategoria/porcentagem")

            if (response.data.length < 3) {

                for (var i = 0; i < response.data.length; i++) {

                    eachDespesa = {}

                    eachDespesa.id = (i + 1)
                    eachDespesa.descDespesa = response.data[i].descricao
                    eachDespesa.corCategoria = response.data[i].cor
                    eachDespesa.icon = response.data[i].icone
                    eachDespesa.valorProgresso = response.data[i].saldo
                    eachDespesa.porcentProgresso = response.data[i].porcentagemReceita
                    eachDespesa.porcentagem = response.data[i].porcentagemReceita

                    topDespesa[i] = eachDespesa

                }

            } else {

                for (var i = 0; i < 3; i++) {

                    eachDespesa = {}

                    eachDespesa.id = (i + 1)
                    eachDespesa.descDespesa = response.data[i].descricao
                    eachDespesa.corCategoria = response.data[i].cor
                    eachDespesa.icon = response.data[i].icone
                    eachDespesa.valorProgresso = response.data[i].saldo
                    eachDespesa.porcentProgresso = response.data[i].porcentagemReceita
                    eachDespesa.porcentagem = response.data[i].porcentagemReceita

                    topDespesa[i] = eachDespesa

                }
            }


            //GET Valor Gasto
            response = await api.get("/relatorio/categoriadespesa")

            for (var i = 0; i < response.data.length; i++) {

                eachGasto = {}

                eachGasto.name = response.data[i].descricao
                eachGasto.gastos = response.data[i].saldo
                eachGasto.color = response.data[i].cor
                eachGasto.legendFontColor = "#FEC300"
                eachGasto.legendFontSize = 15

                todosGastos[i] = eachGasto

            }


            response = await api.get("/despesa/valorgasto")

            valorTotalGasto = response.data

            this.setState({

                // Primeiro Gráfico
                gastos: {
                    fill: fill,
                    saldoGasto: valorGasto,
                    saldoAtual: valorTotal
                },

                // Segundo Gráfico
                despesaReceita: {
                    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
                    legend: ["Receitas", "Despesas"],
                    data: dataGrafico,
                    barColors: ["#00DFA8", "#F24750", "#f3f3f3"],
                },

                topDespesas: topDespesa,

                gastosCategoriasMae: todosGastos,

                totalCategoriasMae: valorTotalGasto

            })


        } catch (err) {
            Alert.alert("ERRO", err.response.data.erro);
            if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                delete api.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('dadosUsuario')
                AsyncStorage.removeItem('tokenUsuario')  
    
                this.props.navigation.navigate('Login')
            }
        }


    }



    componentDidMount = async () => {

        //Dados do Usuário
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)
        } catch (e) {
            //sem usuário válido
        }


        //Variáveis para os Dados
        let valorGasto = 0
        let valorTotal = 0
        let fill = 0
        let eachData = []
        let dataGrafico = []
        let eachDespesa = {}
        let topDespesa = []
        let eachGasto = {}
        let todosGastos = []
        let valorTotalGasto = 0

        try {

            //GET de Valores
            let response = await api.get("/relatorio/situacaogeral")

            fill = response.data.porcentagemDespesa
            valorTotal = response.data.valorDisponivel
            valorGasto = response.data.valorGasto



            //GET do gráfico Mensal
            response = await api.get("/relatorio/analisemensal")

            for (var i = 0; i < response.data.length; i++) {

                eachData = []

                eachData[0] = response.data[i].porcentagemReceita
                eachData[1] = response.data[i].porcentagemDespesa

                if ((response.data[i].porcentagemReceita == 0 && response.data[i].porcentagemDespesa == 0)) {
                    eachData[2] = 100
                } else {
                    eachData[2] = 0
                }

                dataGrafico[i] = eachData

            }


            //GET Top Despesas
            response = await api.get("/relatorio/subcategoria/porcentagem")

            if (response.data.length < 3) {

                for (var i = 0; i < response.data.length; i++) {

                    console.log(`Despesa: ${JSON.stringify(response.data[i])}`)

                    eachDespesa = {}

                    eachDespesa.id = (i + 1)
                    eachDespesa.descDespesa = response.data[i].descricao
                    eachDespesa.corCategoria = response.data[i].cor
                    eachDespesa.icon = response.data[i].icone
                    eachDespesa.valorProgresso = response.data[i].saldo
                    eachDespesa.porcentProgresso = response.data[i].porcentagemReceita
                    eachDespesa.porcentagem = response.data[i].porcentagemReceita

                    topDespesa[i] = eachDespesa

                }

            } else {

                for (var i = 0; i < 3; i++) {

                    eachDespesa = {}

                    eachDespesa.id = (i + 1)
                    eachDespesa.descDespesa = response.data[i].descricao
                    eachDespesa.corCategoria = response.data[i].cor
                    eachDespesa.icon = response.data[i].icone
                    eachDespesa.valorProgresso = response.data[i].saldo
                    eachDespesa.porcentProgresso = response.data[i].porcentagemReceita
                    eachDespesa.porcentagem = response.data[i].porcentagemReceita

                    topDespesa[i] = eachDespesa

                }
            }


            //GET Valor Gasto
            response = await api.get("/relatorio/categoriadespesa")

            for (var i = 0; i < response.data.length; i++) {

                eachGasto = {}

                eachGasto.name = response.data[i].descricao
                eachGasto.gastos = response.data[i].saldo
                eachGasto.color = response.data[i].cor
                eachGasto.legendFontColor = "#FEC300"
                eachGasto.legendFontSize = 15

                todosGastos[i] = eachGasto

            }


            response = await api.get("/despesa/valorgasto")

            valorTotalGasto = response.data

            this.setState({

                // Primeiro Gráfico
                gastos: {
                    fill: fill,
                    saldoGasto: valorGasto,
                    saldoAtual: valorTotal
                },

                // Segundo Gráfico
                despesaReceita: {
                    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
                    legend: ["Receitas", "Despesas"],
                    data: dataGrafico,
                    barColors: ["#00DFA8", "#F24750", "#f3f3f3"],
                },

                topDespesas: topDespesa,

                gastosCategoriasMae: todosGastos,

                totalCategoriasMae: valorTotalGasto

            })


        } catch (err) {
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

        const { gastos, despesaReceita, topDespesas, gastosCategoriasMae, totalCategoriasMae, modalText } = this.state

        return (
            <View style={{ flex: 1, marginTop: 10 }}>
                <Formik
                    initialValues={{
                        gastos: gastos, despesaReceita: despesaReceita,
                        topDespesas: topDespesas, gastosCategoriasMae: gastosCategoriasMae, totalCategoriasMae: totalCategoriasMae, modalText:modalText
                    }}
                    enableReinitialize={true}
                    // validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View style={styles.container}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Gráfico saldo */}
                                <View style={styles.containerBox}>
                                    <TouchableOpacity  style={{alignSelf:'flex-end', paddingRight:15, paddingTop:15, paddingbottom:-10}}                                
                                        onPress={() => this.setState({
                                            modalText: true,
                                            textExplicacao:'Esse gráfico apresenta o quanto você já gastou, descontado do seu total de receitas registradas'
                                        })}>
                                        <Icon2 name="question-circle" size={18} color="#DFE7F5" />
                                    </TouchableOpacity>

                                    {/* Gráfico Saldo            */}
                                    <AnimatedCircularProgress
                                        style={[styles.circularDash, {paddingTop:-20, marginBottom:-20}]}
                                        size={Dimensions.get("window").width - 60}
                                        width={25}
                                        rotation={-99}
                                        lineCap="round"
                                        fill={this.state.gastos.fill} /*barrinha colorida de progresso*/
                                        arcSweepAngle={200}
                                        tintColor="#F24750"
                                        backgroundColor="#DFE7F5"
                                    >
                                        {
                                            (fill) => (
                                                <View style={styles.containerFill}>
                                                    <Text style={styles.textTopSaldo}>Você já gastou</Text>
                                                    <NumberFormat value={this.state.gastos.saldoGasto} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.textSpentBalance}>{value}</Text>} />
                                                    <NumberFormat value={this.state.gastos.saldoAtual} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.textBalance}>{value}</Text>} />
                                                </View>
                                            )
                                        }
                                    </AnimatedCircularProgress>
                                </View>

                                <View style={{ width: '100%' }}>
                                    {/* Gráfico de comparação de Despesas e Receitas        */}
                                    <StackedBarChart
                                        data={this.state.despesaReceita}
                                        width={screenWidth - 20}
                                        height={160}
                                        withHorizontalLabels={false}
                                        chartConfig={{
                                            backgroundColor: "#FAFBFC",
                                            barPercentage: 0.2,
                                            backgroundGradientFrom: "#FAFBFC",
                                            backgroundGradientTo: "#FAFBFC",
                                            color: (opacity = 1) => `transparent`,
                                            labelColor: (opacity = 1) => `#535454`,
                                        }}
                                    />
                                    <TouchableOpacity  style={{alignSelf:'flex-end', position:'absolute',paddingRight:10, paddingTop:25}}                                
                                        onPress={() => this.setState({
                                            modalText: true,
                                            textExplicacao:'Esse gráfico apresenta a comparação entre despesas e receitas nos meses do ano'
                                        })}>
                                        <Icon2 name="question-circle" size={18} color="#DFE7F5" />
                                    </TouchableOpacity>

                                </View>

                                {/* Gráfico Top Despesas             */}
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.titleChartTop}>Top Despesas</Text>
                                    <TouchableOpacity style={{paddingTop:23, paddingLeft:10}}                              
                                        onPress={() => this.setState({
                                            modalText: true,
                                            textExplicacao: `Top Despesas traz as três primeiras subcategorias de despesas que você tem mais gastos.\n O VALOR apresentado indica o quanto você já gastou nessa categoria. \n A BARRA DE PORCENTAGEM, apresenta o seu progresso no limite que você impôs para essa despesa. \nSe ele estiver 100% preenchido, significa que você não cadastrou nenhum limite ainda, ou já extrapolou o valor definido.`
                                        })}>
                                        <Icon2 name="question-circle" size={18} color="#DFE7F5" />
                                    </TouchableOpacity>
                                </View>

                                {topDespesas.length == 0 &&

                                    <View style={styles.boxTopDespesa}>
                                        <Text style={styles.textTopDespesa}>Você não possui Despesas cadastradas</Text>
                                    </View>

                                }

                                {topDespesas.length > 0 &&

                                    <View>
                                        {/* Box despesa */}
                                        < FlatList
                                            data={this.state.topDespesas}
                                            renderItem={({ item, index }) => (
                                                <View style={[styles.centerHorizontal, styles.flex]}>
                                                    <View style={{ width: '100%' }}>
                                                        <View style={styles.containerBox2}>
                                                            <View style={[styles.iconBox, { backgroundColor: item.corCategoria }]}>
                                                                <Icon name={item.icon} size={27} color={'#FFF'} />
                                                            </View>
                                                            <View style={[styles.flex]}>
                                                                <View style={styles.containerIconBox}>
                                                                    <View style={styles.containerValueProgress}>
                                                                        <Text style={styles.labelProgress}>{item.descDespesa}</Text>
                                                                        <NumberFormat value={item.valorProgresso} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.labelValueProgress}>{value}</Text>} />
                                                                    </View>
                                                                    <Progress.Bar
                                                                        color="#F24750"
                                                                        unfilledColor="#DFE7F5"
                                                                        borderColor="transparent"
                                                                        height={10}
                                                                        progress={item.porcentagem}
                                                                        width={null}
                                                                    />
                                                                </View>
                                                                {/* <Text style={styles.labelPercentProgress}>{item.porcentProgresso}</Text> */}
                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>


                                            )}
                                        />
                                    </View>
                                }



                                {/* Gráfico Gastos             */}
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.titleChartTop}>Gastos</Text>
                                    <TouchableOpacity style={{paddingTop:23, paddingLeft:10}}                              
                                        onPress={() => this.setState({
                                            modalText: true,
                                            textExplicacao: `Esse gráfico traz o total de quanto você já gastou. \n E desse total, é apresentado as porcentagens de cada categoria que compõe esse valor`
                                        })}>
                                        <Icon2 name="question-circle" size={18} color="#DFE7F5" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.containerBox}>
                                    <View style={{paddingLeft:20}}>
                                        <PieChart
                                            data={this.state.gastosCategoriasMae}
                                            width={screenWidth}
                                            height={200}
                                            accessor="gastos"
                                            backgroundColor="transparent"
                                            // absolute
                                            chartConfig={{
                                                backgroundColor: "#FAFBFC",
                                                barPercentage: 0.2,
                                                backgroundGradientFrom: "#FAFBFC",
                                                backgroundGradientTo: "#FAFBFC",
                                                color: (opacity = 1) => `transparent`,
                                                labelColor: (opacity = 1) => `#535454`,
                                            }}
                                        />
                                    </View>
                                    <NumberFormat value={this.state.totalCategoriasMae} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={{
                                        fontFamily: 'Roboto-Medium',
                                        fontSize: 17,
                                        color: "#636566",
                                        position: 'absolute',
                                        left: screenWidth / 8,
                                        textAlign: 'center'
                                    }}>{`Total gasto \n ${value}`}</Text>} />
                                </View>
                            </ScrollView>

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
                                        <Text style={styles.textInstructions}>{this.state.textExplicacao}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => this.setState({
                                                modalText: false,
                                            })
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
    centerHorizontal: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingBottom: 0
    },
    containerValueProgress: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBox: {
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 7,
        borderRadius: 16,
        width: "95%",
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 2,
        elevation: 4,
    },

    containerAllGoals: {
        width: "95%",
        flexDirection: 'row',
    },
    containerGoal: {
        backgroundColor: 'white',
        // margin:5,
        marginLeft: 9.2,
        borderRadius: 16,
        paddingLeft: 10,
        width: "32%",
        height: 150,
        // justifyContent:'space-around',
        // alignItems:'flex-start',
        shadowRadius: 2,
        elevation: 2,
    },
    containerIconBox: {
        paddingLeft: 10,
    },
    labelValueProgress: {
        fontFamily: 'Sarabun-SemiBold',
        fontSize: 16,
        lineHeight: 24,
        paddingBottom: 7,
        color: "#F24750",
    },
    labelProgress: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        lineHeight: 15,
        paddingBottom: 7,
        color: "#535454",
    },
    labelPercentProgress: {
        paddingLeft: 10,
        paddingTop: 24,
        color: "#535454",
        fontWeight: 'bold'
    },
    iconBox: {
        width: 55,
        height: 55,
        alignItems: 'center',
        paddingTop: 15,
        // backgroundColor:'#F24750',
        borderRadius: 10,
    },
    containerBox2: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 16,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        shadowRadius: 2,
        elevation: 2,
        // paddingTop:'30%',
        zIndex: 0,
    },
    circularDash: {
        paddingTop: '7%',
        height: Dimensions.get("window").height * 0.4,
    },
    titleChartTop: {
        fontFamily: 'Roboto-Black',
        fontSize: 20,
        lineHeight: 28,
        color: '#535454',
        paddingTop: 30,
        paddingLeft: 20,
        paddingBottom: 10
    },
    boxTopDespesa: {
        paddingLeft: 20,
    },
    textTopDespesa: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#535454',
        textAlign: 'center',
    },
    containerFill: {
        justifyContent: 'center',
        alignItems: 'center',
        // fontSize:20
    },
    textSpentBalance: {
        fontFamily: 'Baloo2-Bold',
        fontSize: 30,
        lineHeight: 40,
        color: '#042C5C',
    },
    textBalance: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        lineHeight: 18,
        color: '#00DFA8',
        paddingBottom: 40,
        // fontSize:20,
    },
    headerContainer: {
        paddingTop: 30,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    listContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTopSaldo: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        lineHeight: 15,
        color: '#77869E',
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

    boxTextInstructions:{
        padding:10,
    },

    textInstructions:{
        textAlign: "center",
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
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

});

