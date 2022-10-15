import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Picker, Image, Modal,Switch, Dimensions, TouchableOpacity,Alert } from 'react-native';
import NumberFormat from 'react-number-format';
import Carousel from 'react-native-snap-carousel';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

// import { TouchableOpacity } from 'react-native-gesture-handler';

import api from '../../components/Api';
import { showSuccess } from '../../common'



import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';


const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const ReviewSchema = yup.object({


});


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.addConta = this.addConta.bind(this);
        this.alterarReceita = this.alterarReceita.bind(this);
        this.excluirReceita = this.excluirReceita.bind(this);
        this.alterarDespesa = this.alterarDespesa.bind(this);
        this.excluirDespesa = this.excluirDespesa.bind(this);

        this.state = {

            modalDelDespesa: false,

            modalDelReceita: false,

            card: {
                id: null,
                descConta: '',
                tipoConta: {
                    descTipoConta: '',
                    id: null
                },
                cor: '',
                saldoConta: null,
            },

            saldoTotal: null,

            listaContas: [
                {
                    id: null,
                    descConta: '',
                    tipoConta: {
                        descTipoConta: '',
                        id: null
                    },
                    cor: '',
                    saldoConta: null,
                    valorInicial: null
                },

            ],

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

            despesaSelecionada: {
                id: null,
                descDespesa: '',
                valorParcela: null,
                repeticao:false,
                idRepeticao:null
            },

            listaDespesas: [],

            receitaSelecionada: {
                id: null,
                descReceita: '',
                valorParcela: null,
                repeticao:false,
                idRepeticao:null
            },

            listaReceitas: [],


            // Variáveis para o controle da lista de Receitas e Depesas
            booleanDespesa: true,

            booleanReceita: false,


            booleanRepeticao:false,

            excluirTodasParcelas:false,
    
            borderDespesa: 2,

            borderReceita: 0,
        }
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.reloadListaCategorias()
            }
        );
    }

    reloadListaCategorias = async () => {
        try {

            let listaReceitasUsuario = []
            let listaDespesasUsuario = []
            let listaContasUsuario = []
            let saldoTotal = 0

            let response = await api.get("conta/usuario")

            listaContasUsuario = response.data

            console.log(`Contas do usuário: ${JSON.stringify(listaContasUsuario)}`)

            for (var i = 0; i < listaContasUsuario.length; i++) {

                let response = await api.get(`conta/saldo/${listaContasUsuario[i].id}`)

                listaContasUsuario[i].saldoConta = response.data

                saldoTotal = saldoTotal + listaContasUsuario[i].saldoConta

            }


            this.setState({
                listaReceitas: listaReceitasUsuario, listaDespesas: listaDespesasUsuario, listaContas: listaContasUsuario
            })


            response = await api.get("/categoria/receita/todas")

            // console.log(`categorias: ${JSON.stringify(response.data)}`)
            let listaCategoriasUsuario = response.data

            this.setState({
                listaCategorias: listaCategoriasUsuario
            })

        } catch (err) {
            Alert.alert("ERRO", err.response.data.erro);
        }
    }




    addConta = (item) => {
        this.props.navigation.navigate('Conta', { contaEdicao: item });
    }

    alterarReceita(item) {
        console.log(`Receita a ser alterada: ${JSON.stringify(item)}`)
        this.props.navigation.navigate('Receita', { receitaEdicao: item });
    }

    excluirReceita = async (item) => {
        console.log(`Receita a ser excluída: ${JSON.stringify(item)}`)
        
        //Se o switch estiver como true, é rpa excluir todas as parcelas
        console.log(`Switch excluir todas parcelas; ${this.state.excluirTodasParcelas}`)
        console.log(`Card no state: ${JSON.stringify(this.state.card)}`)
        let response = await api.delete(`receita/excluir/${item.id}`)

        this.refreshConta(this.state.card)
        showSuccess('Receita Excluída!')

        this.setState({ modalDelReceita: false , excluirTodasParcelas:false})
    }

    alterarDespesa(item) {
        // console.log(`Despesa a ser alterada: ${JSON.stringify(item) }`)
        this.props.navigation.navigate('Despesa', { despesaEdicao: item });
    }

    excluirDespesa = async (item) => {
        console.log(`Despesa a ser excluída: ${JSON.stringify(item)}`)

        //Se o switch estiver como true, é rpa excluir todas as parcelas
        console.log(`Switch excluir todas parcelas; ${this.state.excluirTodasParcelas}`)
        console.log(`Card no state: ${JSON.stringify(this.state.card)}`)
        let response = await api.delete(`despesa/excluir/${item.id}`)

        this.refreshConta(this.state.card)
        showSuccess('Despesa Excluída!')

        this.setState({ modalDelDespesa: false,excluirTodasParcelas:false })

    }

    refreshConta = async (item) => {
        let listaReceitasUsuario = []
        let listaDespesasUsuario = []
        let saldoTotal = null

        this.setState({
            card: item
        })


        try {

            // let response = await api.get(`conta/saldo/${item.id}`)
            // saldoTotal = response.data

            console.log(`receita/conta/${item.id}/${this.state.mesSelecionado}`)
            response = await api.get(`receita/conta/${item.id}/${this.state.mesSelecionado}`)
            listaReceitasUsuario = response.data

            console.log(`despesa/conta/${item.id}/${this.state.mesSelecionado}`)
            response = await api.get(`despesa/conta/${item.id}/${this.state.mesSelecionado}`)
            listaDespesasUsuario = response.data


            this.setState({
                listaReceitas: listaReceitasUsuario, listaDespesas: listaDespesasUsuario, /*saldoTotal: saldoTotal*/
            })

        } catch (err) {
            Alert.alert("ERRO", err.response.data.erro);
        }
    }

    componentDidMount = async () => {
        let listaContasUsuario = []
        let saldoTotal = 0

        let mesSelecionado = new Date().getMonth() + 1

        try {
            let response = await api.get("conta/usuario")

            listaContasUsuario = response.data

            for (var i = 0; i < listaContasUsuario.length; i++) {

                let response = await api.get(`conta/saldo/${listaContasUsuario[i].id}`)
                console.log(`Id da conta que buscou saldo: ${listaContasUsuario[i].id}`)
                console.log(`Desc da conta que buscou saldo: ${listaContasUsuario[i].descConta}`)
                console.log(`Saldo da conta é: ${response.data}`)

                listaContasUsuario[i].saldoConta = response.data

                saldoTotal = saldoTotal + listaContasUsuario[i].saldoConta

            }

            this.setState({
                listaContas: listaContasUsuario, saldoTotal: saldoTotal, mesSelecionado: mesSelecionado
            })

        } catch (err) {
            Alert.alert("ERRO", err.response.data.erro);
        }

    }


    _renderItem = ({ item, index }) => {
        return (


            <View style={[styles.cardCarousel, { backgroundColor: item.cor }]}>

                <TouchableOpacity style={[styles.flexRow, styles.justifyRight]}
                    onPress={() => this.addConta(item)}>
                    <Icon name={'edit'} size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.descConta}>{item.descConta}</Text>
                <Text style={styles.textNumberCard}>xxxx xxxx xxxx</Text>
                <NumberFormat value={item.saldoConta} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.saldoConta}>{value}</Text>} />
                <TouchableOpacity style={[styles.flexRow, styles.justifyRight]}
                    // onPress={() => this.setState({
                    //     card: item,
                    // }), this.props.refreshConta}>

                    onPress={() => this.refreshConta(item)}>


                    <Icon2 name={'refresh'} size={25} color="#FFFFFF" />
                </TouchableOpacity>

            </View>

        );
    };


    handleSignInPress = async (values) => {
    }



    render() {

        const { excluirTodasParcelas,saldoTotal, listaContas, mesSelecionado, booleanDespesa, modalDel, booleanReceita, listaDespesas, listaReceitas, listaMeses, receitaSelecionada, despesaSelecionada, modalDelDespesa, modalDelReceita, card, booleanRepeticao } = this.state

        return (
            <View>
                <Formik
                    initialValues={{
                        excluirTodasParcelas:excluirTodasParcelas, saldoTotal: saldoTotal, listaContas: listaContas, modalDelReceita: modalDelReceita, modalDelDespesa: modalDelDespesa, mesSelecionado: mesSelecionado, booleanDespesa: booleanDespesa, booleanReceita: booleanReceita,
                        listaDespesas: listaDespesas, listaReceitas: listaReceitas, listaMeses: listaMeses, receitaSelecionada: receitaSelecionada, despesaSelecionada: despesaSelecionada, booleanRepeticao:booleanRepeticao/*card: card*/
                    }}
                    enableReinitialize={true}
                    // validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View>

                            <View style={styles.includesTop}>
                                <Text style={styles.textSaldoTop}>Saldo total (todas as contas)</Text>
                                <NumberFormat value={props.values.saldoTotal} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.saldoTotal}>{value}</Text>} />
                            </View>

                            <View style={styles.includesCarousel}>
                                <Carousel
                                    ref={(c) => { this._carousel = c; }}
                                    data={this.state.listaContas}
                                    renderItem={this._renderItem}
                                    sliderWidth={SLIDER_WIDTH}
                                    itemWidth={ITEM_WIDTH}
                                    useScrollView={true}
                                />
                            </View>

                            <View style={[styles.center, styles.flexRow, styles.flex]}>
                                <View style={[styles.includesMonth, styles.flexRow, styles.alignCenter, styles.center]}>
                                    <View style={styles.pickerView}>
                                        <Picker
                                            selectedValue={props.values.mesSelecionado}
                                            style={{ height: 50, width: 150 }}
                                            onValueChange={(value) => this.setState({
                                                mesSelecionado: value
                                            })}
                                        // onValueChange={value =>
                                        //     props.setFieldValue('mesSelecionado', value)}
                                        >

                                            {props.values.listaMeses.map((item, index) => (
                                                <Picker.Item label={item.descricao} color="#232425" key={item.id} value={item.id} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.includesCategorias}>
                                <View style={[styles.flex, styles.alignCenter]}>
                                    <View style={[styles.flexRow, styles.spaceAround, { width: '90%' }, { borderBottomWidth: 1, borderBottomColor: '#E8E9EC' }]}>
                                        <TouchableOpacity style={[styles.includesTextCategoria, styles.alignCenter, { borderBottomWidth: this.state.borderDespesa }]}
                                            onPress={() => this.setState({
                                                booleanDespesa: true,
                                                borderDespesa: 2,
                                                booleanReceita: false,
                                                borderReceita: 0,
                                            })}>
                                            <Text style={[styles.textCategoria]}>Despesa</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[styles.includesTextCategoria, styles.alignCenter, { borderBottomWidth: this.state.borderReceita }]}
                                            onPress={() => this.setState({
                                                booleanReceita: true,
                                                borderReceita: 2,
                                                booleanDespesa: false,
                                                borderDespesa: 0,
                                            })}>
                                            <Text style={[styles.textCategoria]}>Receita</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                {booleanDespesa &&

                                    <View style={{ marginTop: 20 }}>
                                        <FlatList
                                            data={props.values.listaDespesas}
                                            renderItem={({ item, index }) => (
                                                <View style={[styles.containerLine, { width: '95%' }]}>
                                                    <View style={{ width: '95%' }}>
                                                        <TouchableOpacity onPress={() => this.alterarDespesa(item)}>
                                                            <View style={[styles.containerConteudoLine]}>
                                                                <View style={[styles.containerTextLine]}>
                                                                    <View style={styles.circleDespesa}></View>
                                                                    <Text style={styles.descricaoItem}>{item.descDespesa}</Text>
                                                                    {(item.repeticao && item.qtdeParcelas > 0) &&
                                                                        <Text style={[styles.descricaoItemParcela]}>-{item.numParcela}/{item.qtdeParcelas}</Text>
                                                                    }
                                                                    {(item.repeticao && item.qtdeParcelas === 0) &&
                                                                        <Text style={[styles.descricaoItemParcela]}>- rep infinita</Text>
                                                                    }
                                                                </View>

                                                                <View style={[styles.justifyRight]}>
                                                                    <NumberFormat value={item.valorParcela} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.valorDespesa}>{value}</Text>} />
                                                                    {/* <Icon style={{ paddingRight: 20 }} name={'edit'} size={12} color="#475062" /> */}
                                                                    {/* <Icon name={'x-square'} size={14} color="#475062" /> */}
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            modalDelDespesa: true,
                                                            despesaSelecionada: {
                                                                ...this.state.despesaSelecionada,
                                                                id: item.id,
                                                                descDespesa: item.descDespesa,
                                                                valorParcela: item.valorParcela,
                                                                repeticao:item.repeticao,
                                                                idRepeticao:item.idRepeticao
                                                            }
                                                        })}
                                                        >
                                                            <Icon name={'x-circle'} size={20} color="#bfb9b9" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    </View>
                                }

                                {booleanReceita &&

                                    <View style={{ marginTop: 20 }}>
                                        <FlatList
                                            data={props.values.listaReceitas}
                                            renderItem={({ item, index }) => (
                                                <View style={[styles.containerLine, { width: '95%' }]}>
                                                    <View style={{ width: '95%' }}>
                                                        <TouchableOpacity onPress={() => this.alterarReceita(item)}>
                                                            <View style={[styles.containerConteudoLine]}>
                                                                <View style={[styles.containerTextLine]}>
                                                                    <View style={styles.circleReceita}></View>
                                                                    <Text style={styles.descricaoItem}>{item.descReceita}</Text>
                                                                    {(item.repeticao && item.qtdeParcelas > 0) &&
                                                                        <Text style={[styles.descricaoItemParcela]}>-{item.numParcela}/{item.qtdeParcelas}</Text>
                                                                    }
                                                                    {(item.repeticao && item.qtdeParcelas === 0) &&
                                                                        <Text style={[styles.descricaoItemParcela]}>- rep infinita</Text>
                                                                    }
                                                                </View>

                                                                <View style={[styles.justifyRight]}>
                                                                    <NumberFormat value={item.valorParcela} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} fixedDecimalScale={true} decimalScale={2} prefix={'R$'} renderText={value => <Text style={styles.valorReceita}>{value}</Text>} />
                                                                    {/* <Icon style={{ paddingRight: 20 }} name={'edit'} size={12} color="#475062" /> */}
                                                                    {/* <Icon name={'x-square'} size={14} color="#475062" /> */}
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            modalDelReceita: true,
                                                            receitaSelecionada: {
                                                                ...this.state.receitaSelecionada,
                                                                id: item.id,
                                                                descReceita: item.descReceita,
                                                                valorParcela: item.valorParcela,
                                                                repeticao: item.repeticao,
                                                                idRepeticao: item.idRepeticao
                                                            }
                                                        })}
                                                        >
                                                            <Icon name={'x-circle'} size={20} color="#bfb9b9" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    </View>
                                }
                            </View>

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
                                                <Text style={styles.contentModalTitle}>Excluir {props.values.despesaSelecionada.descDespesa} ?</Text>

                                            }

                                        </View>
                                        <View> 
                                            {props.values.despesaSelecionada.repeticao &&
                                            <View style={{flexDirection:'row', alignItems:'center', margin:10}}>
                                                <Switch
                                                    trackColor={{ false: "#232d3a", true: "#06C496" }}
                                                    value={props.values.excluirTodasParcelas}
                                                    onValueChange={value =>(
                                                        this.setState({excluirTodasParcelas:value}),
                                                        props.setFieldValue('excluirTodasParcelas', value))                                                        
                                                    }
                                                />
                                                <Text style={styles.textSwitch}>Excluir todas as parcelas?</Text>
                                            </View>
                                            }


                                            <TouchableOpacity onPress={(despesaSelecionada) => this.excluirDespesa(props.values.despesaSelecionada)}>
                                                <View style={[styles.confirmDelete]}>
                                                    <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                    <Icon name="check" size={20} color="#00DFA8" />
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.setState({
                                                modalDelDespesa: false,
                                                despesaSelecionada: {
                                                    id: null,
                                                    descDespesa: '',
                                                    valorParcela: '',
                                                    repeticao:false,
                                                    idRepeticao:null
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
                                                <Text style={styles.contentModalTitle}>Excluir {props.values.receitaSelecionada.descReceita} ?</Text>

                                            }

                                        </View>
                                        <View>

                                            {props.values.receitaSelecionada.repeticao &&
                                                <View style={{flexDirection:'row', alignItems:'center', margin:10}}>
                                                    <Switch
                                                        trackColor={{ false: "#232d3a", true: "#06C496" }}
                                                        value={props.values.excluirTodasParcelas}
                                                        onValueChange={value =>(
                                                            this.setState({excluirTodasParcelas:value}),
                                                            props.setFieldValue('excluirTodasParcelas', value))                                                        
                                                        }
                                                    />
                                                    <Text style={styles.textSwitch}>Excluir todas as parcelas?</Text>
                                                </View>
                                            }

                                            <TouchableOpacity onPress={(receitaSelecionada) => this.excluirReceita(props.values.receitaSelecionada)}>
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
                                                    repeticao:false,
                                                    idRepeticao:null
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
                    )}
                </Formik>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    textSwitch: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0.2,
        color: '#77869E',
    },

    containerLine: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#CED2DA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10
    },

    containerConteudoLine: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%'
    },

    containerTextLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    circleDespesa: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F24750',
    },

    circleReceita: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#00DFA8',
    },

    descricaoItem: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#475062',
        paddingLeft: 15,
    },

    descricaoItemParcela: {
        fontFamily: 'Roboto-Black',
        fontWeight:'bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#475062',
        paddingLeft: 5,
    },

    valorDespesa: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#F24750',
    },

    valorReceita: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#06C496',
    },

    flex: {
        flex: 1,
    },

    flexRow: {
        flexDirection: 'row',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    spaceAround: {
        justifyContent: 'space-around',
    },

    justifyRight: {
        justifyContent: 'flex-end',
    },

    justifyLeft: {
        justifyContent: 'flex-start',
    },

    center: {
        justifyContent: 'center',
    },

    alignCenter: {
        alignItems: 'center',
    },

    includesTop: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    textSaldoTop: {
        fontFamily: 'Sarabun-Medium',
        fontSize: 14,
        lineHeight: 20,
        color: '#A6AAB4',
    },

    saldoTotal: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 32,
        lineHeight: 42,
        color: '#171D33',
        paddingTop: 5,
    },

    includesCarousel: {
        marginTop: 20,
    },

    cardCarousel: {
        height: 165,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
    },

    pickerView: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#CCCCCC',
        // borderRadius: 5,
        // backgroundColor: '#F6F6F6',
        marginTop: 7,
        overflow: 'hidden'
    },

    picker: {
        fontFamily: 'Roboto-Medium',
        height: 40,
    },

    descConta: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        lineHeight: 25,
        color: '#FFFFFF',
    },

    textNumberCard: {
        fontFamily: 'Roboto-Medium',
        fontSize: 12,
        lineHeight: 14,
        color: '#FFFFFF',
        paddingTop: 10,

    },

    saldoConta: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        lineHeight: 18,
        color: '#FFFFFF',
        paddingTop: 15,
    },

    includesMonth: {
        paddingTop: 20,
        paddingBottom: 20,
    },

    textMonth: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        lineHeight: 21,
        color: '#232425',
    },

    inputDate: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        lineHeight: 21,
        color: '#232425',
    },

    eachCategoria: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.8,
        borderBottomColor: '#CCCCCC',
    },

    includesTextCategoria: {
        borderBottomColor: '#FF7D00',
        paddingBottom: 10,
        width: 100,
    },

    textCategoria: {
        fontFamily: 'Sarabun-SemiBold',
        fontSize: 18,
        lineHeight: 28,
        color: '#3B414B',
    },

    /*Modal*/
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

