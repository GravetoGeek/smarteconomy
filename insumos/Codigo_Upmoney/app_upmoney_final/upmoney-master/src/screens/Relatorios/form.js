import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Picker, Image, Dimensions,Alert } from 'react-native';
import NumberFormat from 'react-number-format';
import Carousel from 'react-native-snap-carousel';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';

import { TouchableOpacity } from 'react-native-gesture-handler';

import api from '../../components/Api';
import { showSuccess } from '../../common'
import AsyncStorage from '@react-native-community/async-storage'


import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';


const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const ReviewSchema = yup.object({


});


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modoEdicao: false,
            
            contaSelecionada: {
                id: null,
                descConta: 'Selecione a Conta',
                saldoConta: null,
            },

            
            listaContas: [
                {
                    id: null,
                    descConta: '',
                    saldoConta: null,
                },
            ],

            despesaSelecionada: {
                id: null,
                descDespesa: '',
                valorParcela: null,
            },

            listaDespesas: [],

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

            mesSelecionado: null,

        };
        
        //listener de reload da tela, fica ouvindo a navegação, toda vez que entrar nessa tela processará as funções dentro do payload
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                //só vai dar reload na lista de contas, pois para carregar a lista de despesas precisa do id de uma conta
                this.reloadTela()
            }
        );
    }

    

    //Dá apenas o reload na lista de contas
    reloadTela = async () => {
        let mesSelecionado = new Date().getMonth() + 1
        try{
            let listaContasUsuario = []
            let response = await api.get("conta/usuario")
            console.log(`Contas no reload da tela em relatorios: ${JSON.stringify(response.data)}`)
            listaContasUsuario = response.data

            //recupera a conta selecionada no asyncstorage
            let contaAsync = await AsyncStorage.getItem('contaSelecionada') || 'none'
            console.log(`Existe uma conta salva no async: ${contaAsync}`)

            if(contaAsync === 'none'){
                console.log("não vai usar a conta do async")
                this.setState({
                    listaDespesas:[],
                    contaSelecionada: {
                        id: null,
                        descConta: 'Selecione a Conta',
                        saldoConta: null,
                    },
                })
            }else{ 
                console.log("vai usar a conta do async")               
                this.reloadRelatorioConta(contaAsync.id, mesSelecionado)
            }

            this.setState({
                listaContas: listaContasUsuario,
            })
        }catch(err){
            Alert.alert("ERRO", err.response.data.erro);
            if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                delete api.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('dadosUsuario')
                AsyncStorage.removeItem('tokenUsuario')  
                AsyncStorage.removeItem('contaSelecionada')  
    
                this.props.navigation.navigate('Login')
            }
        }
    }

    //Ao entrar nessa tela pela primeira vez, carrega apenas a lista de contas e o mês atual
    componentDidMount = async () => { 
        AsyncStorage.removeItem('contaSelecionada')  
        console.log("entrou no component did mount")
        let listaContasUsuario = []
        let mesSelecionado = new Date().getMonth() + 1

        try {
            // preenche o combo de contas do usuário
            let response = await api.get("conta/usuario")
            console.log(`Contas no didmount de relatórios: ${JSON.stringify(response.data)}`)
            listaContasUsuario = response.data

            this.setState({
                listaContas: listaContasUsuario,
                mesSelecionado: mesSelecionado,
            })
        }catch(err){
            Alert.alert("ERRO", err.response.data.erro);
            if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                delete api.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('dadosUsuario')
                AsyncStorage.removeItem('tokenUsuario')  
                AsyncStorage.removeItem('contaSelecionada')  
    
                this.props.navigation.navigate('Login')
            }
        }
    }

    handleSignInPress = async (values) => { }

    //Irá trazer o id do mês selecionado e enviar para a função que irá carregar as listas de despesas nesse mês, dessa conta.
    reloadRelatorioMes = (value) => {
        console.log(`entrou no reloadRelatorioMes: ${value}`);
        
        if(this.state.listaContas && this.state.listaContas.length > 0) {
            this.reloadRelatorioConta(null, value)
        }else{
            console.log("contas está vazia")
        }
    }

    //Carrega a lista de despesas dessa conta do mês selecionado, se o parâmetro "mes" estiver como null, significa que é o primeiro carregamento da tela, então trará a lista do mês atual. 
    //Se o parâmetro "mes" estiver preenchido é para carregar a lista de despesas do mês selecionado
    reloadRelatorioConta = async (value, mes) => {
        console.log(`entrou no reloadRelatorioConta: ${value} - ${mes}`);
        let listaSubcategoriasDespesa = []
        let mesSelecionado=null
        let descConta = null
        let idConta = null

        if(mes === null){
            console.log(`o mes é null, então é a primeira vez, mês no state é: ${this.state.mesSelecionado}`)
            mesSelecionado = this.state.mesSelecionado  
            descConta = value.descConta
            idConta = value.id          
        }else{
            console.log("o mes é diferente de null, clicou no combo de mes")
            mesSelecionado = mes
            descConta = this.state.contaSelecionada.descConta
            idConta = this.state.contaSelecionada.id
        }

        try{
            console.log(`entrou aqui no reloadRelatorioConta, conta:${descConta}, id:${idConta}`) 
            // usuário é verificado por token
            console.log(`/relatorio/subcategoriasbyconta/${idConta}/${mesSelecionado}`)
            let response = await api.get(`/relatorio/subcategoriasbyconta/${idConta}/${mesSelecionado}`)
            console.log(`LISTA DESPESAS: ${JSON.stringify(response.data)}`)

            listaSubcategoriasDespesa = response.data

            
            this.setState({
                mesSelecionado:mesSelecionado,
                listaDespesas:listaSubcategoriasDespesa,
                contaSelecionada: {
                    id: idConta,
                    descConta: descConta,
                },
            })

            AsyncStorage.setItem('contaSelecionada', JSON.stringify(this.state.contaSelecionada))
        }catch(err){
            Alert.alert("ERRO", err.response.data.erro);
            if(err.response.data.erro === 'Token inválido/expirado ou usuário não autenticado!'){
                delete api.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('dadosUsuario')
                AsyncStorage.removeItem('tokenUsuario')  
                AsyncStorage.removeItem('contaSelecionada')  
    
                this.props.navigation.navigate('Login')
            }
        }

    }



    render() {

        const { contaSelecionada, listaContas, mesSelecionado, listaDespesas, listaReceitas, listaMeses } = this.state

        return (
            <View style={{flex:1}}>
                <Formik
                    initialValues={{
                        contaSelecionada:contaSelecionada, listaContas: listaContas, mesSelecionado: mesSelecionado,
                        listaDespesas: listaDespesas, listaReceitas: listaReceitas, listaMeses: listaMeses
                    }}
                    enableReinitialize={true}
                    // validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View style={{flex:1}}>
                            <View style={styles.includesTop}>
                                <Text style={styles.textSubtitle}>Despesas de cada subcategoria</Text>
                            </View>

                            {/* Combobox Conta */}
                            
                            <View style={styles.pickerViewC}>
                                <Picker
                                    style={{ height: 50, width: '100%' }}
                                    selectedValue={this.state.contaSelecionada}
                                    onValueChange={value =>{
                                        props.setFieldValue('contaSelecionada', value),
                                        this.reloadRelatorioConta(value, null)
                                        }
                                    }
                                >
                                    {/* Inicializa com o state da conta do início, onde a descrição da conta está como "Selecione Conta"*/}
                                    {!this.state.modoEdicao &&
                                        <Picker.Item label={`${this.state.contaSelecionada.descConta}`} color="#535454" value={this.state.contaSelecionada.descConta} />
                                    } 

                                    {this.state.listaContas.map((item, index) => (  
                                        // Verifica se o item da lista é o mesmo que está setado no state, se for ele não mostra pra não duplicar esse valor
                                        item.descConta !== this.state.contaSelecionada.descConta &&                                
                                        <Picker.Item label={item.descConta} color="#042C5C" key={item.id} value={item}/>                                        
                                    ))}

                                </Picker>
                            </View>

                            <View style={[styles.contentWhite,{flex:1}]}>
                                {/* Combobox meses */}
                                <View style={[styles.comboMeses]}>
                                    <View style={styles.pickerView}>
                                        <Picker
                                            selectedValue={props.values.mesSelecionado}
                                            style={{ height: 50, width: 200 }}
                                            onValueChange={value =>{
                                                props.setFieldValue('mesSelecionado', value),
                                                this.reloadRelatorioMes(value)
                                                }
                                            }
                                        >

                                            {props.values.listaMeses.map((item, index) => (
                                                <Picker.Item label={item.descricao} color="#042C5C" key={item.id} value={item.id}/>
                                            ))}

                                        </Picker>
                                    </View>
                                </View>

                                {listaDespesas.length == 0 &&
                                    <View style={styles.boxWarningSelect}>
                                        <Text style={styles.textWarningSelect}>Selecione uma conta para mostrar o relatório</Text>
                                    </View>
                                }

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* Relatório barras */}
                                    <View style={styles.containerChart}>
                                        <FlatList
                                            data={props.values.listaDespesas}
                                            renderItem={({ item, index }) => (
                                            
                                                <View style={styles.containerChart2}>
                                                    <View style={[styles.iconBoxCircle, {borderColor: item.cor}/* { backgroundColor: item.corCategoria }*/]}>
                                                        <Icon name={item.icone} size={16} color={item.cor}/>
                                                    </View>
                                                    <View style={{flex:1, paddingRight:10}}>
                                                        <Progress.Bar
                                                            color={item.cor}
                                                            // unfilledColor="#DFE7F5"
                                                            borderColor="transparent"
                                                            height={20}
                                                            progress={item.porcentagemDespesa}
                                                            width={null}
                                                        />
                                                    </View>
                                                    <Text style={styles.porcentDespesaChart}>{item.porcentagemDespesa}%</Text>
                                                </View>                                        
                                                
                                            )}
                                        />
                                    </View>

                                    <View>
                                        <FlatList
                                            data={props.values.listaDespesas}
                                            renderItem={({ item, index }) => (
                                                
                                                <View style={[styles.alignCenter]}>
                                                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('DetalheRelatorio',{contaInfo:props.values.contaSelecionada, despesaInfo:item, mesInfo:mesSelecionado})}}>
                                                        <View style={[styles.conteinerlistDespesas]}>
                                                            <View style={[styles.conteinerCategoria]}>
                                                                <View style={[styles.iconBox2, { backgroundColor: item.cor }]}>
                                                                    <Icon name={item.icone}  size={17} color={'#FFF'} />
                                                                </View>
                                                                <View>
                                                                    <Text style={styles.descDespesa}>{item.descricao}</Text>
                                                                    <Text style={styles.descLancamentos}>{item.qtde} despesa(s)</Text>
                                                                </View>
                                                            </View>

                                                            <View style={[styles.listValorDesp]}>
                                                                <NumberFormat value={item.saldo} displayType={'text'} thousandSeparator={true} prefix={'R$'} renderText={value => <Text style={[{ paddingRight: 20, color:"#042C5C" }]}>{value}</Text>} />
                                                                <Text style={[styles.porcentagemDespesa]}>{item.porcentagemDespesa}%</Text>
                                                            </View>                                                    
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>

                                            )}
                                        />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    boxWarningSelect: {
        padding: 20,
    },

    textWarningSelect: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#042C5C',
        textAlign: 'center',
    },

    conteinerCategoria:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%' 
    },

    conteinerlistDespesas:{
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 0.6,
        borderBottomColor: '#CED2DA',
        flexDirection: 'row',
        width: '90%',
    },
    
    pickerViewC: {
        borderTopWidth: 0.5,
        borderTopColor: '#CED2DA',
        // backgroundColor: '#F6F6F6',
        // borderRadius: 5,
        // marginBottom:7,
        // marginTop: 7,
        overflow: 'hidden'
    },
    
    pickerView: {
        justifyContent:'center',
        marginBottom:10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#CED2DA',
        // backgroundColor: '#F6F6F6',
        borderRadius: 5,
        marginTop: 3,
        overflow: 'hidden'
    },

    listValorDesp:{
        alignItems: 'flex-end',
        width: '40%',
    },

    porcentagemDespesa:{
        paddingRight:20,
        fontSize:13,
        color: '#A6AAB4',
    },

    porcentDespesaChart:{
        fontSize:13,
        color: '#A6AAB4',
    },

    alignCenter: {
        alignItems: 'center',
    },

    contentWhite:{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingLeft:5,
        paddingRight:5,
        paddingBottom: 20,
        shadowRadius: 20,
        elevation: 50,
    },

    comboMeses:{
        marginTop:15,
        marginBottom:10,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    containerChart:{
        marginBottom:20,
    },

    includesTop: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    textSubtitle: {
        fontFamily: 'Sarabun-Medium',
        fontSize: 18,
        lineHeight: 20,
        paddingBottom:10,
        color: '#A6AAB4',
    },

    descDespesa: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#475062',
        paddingLeft: 15,
    },

    descLancamentos: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: '#A6AAB4',
        paddingLeft: 15,
    },

    containerChart2: {
        flex: 1,
        paddingTop:6,
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
        paddingTop:3,
        borderRadius: 20,
    },

    iconBox2: {
        width: 30,
        height: 30,
        alignItems: 'center',
        padding:5.5,
        borderRadius: 20,
    },

    iconBoxCircle: {
        paddingTop:2,
        width: 25,
        height: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
    },

});

