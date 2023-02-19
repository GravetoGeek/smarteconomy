import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import api from '../../components/Api';

import Header from '../../components/Header';
import { ButtonBlue, ButtonText } from '../../components/Components';

import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';

const screenWidth = Dimensions.get("window").width;

// const SLIDER_WIDTH = Dimensions.get('window').width;
// const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

// const ReviewSchema = yup.object({


// });


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSlice: {
                label: `Clique em uma fatia`,
                value: 0
            },
            labelWidth: 0,

            valorGastoCategorias: [0, 0, 0],

            valorRecomendadoCategorias: [0, 0, 0],

            categorias:['', '', ''],

            //Está dentro do limite(false) está fora (true)
            flagLimite:false,

            saldo: 0
        }
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.atualizarDados()
            }
        );

        this.goRemanejarGastos = this.goRemanejarGastos.bind(this);
    }

    goRemanejarGastos() {
        this.props.navigation.navigate('RemanejarGastos');
    }


    atualizarDados = async () => {
        //Variáveis para os Dados
        let response
        let valorGastoCategorias = []
        let categorias = []
        let valorRecomendadoCategorias = []
        let saldo
        let flagLimite


        try {

            //GET Valores Categoria Despesa
            response = await api.get("/relatorio/categoriadespesa/analisegastos")

            for (var i = 0; i < response.data.length; i++) {

                valorGastoCategorias[i] = response.data[i].valorGasto
                valorRecomendadoCategorias[i] = response.data[i].valorMaximo

                // Se o valor gasto extrapolar o valor recomendado de cada categoria, será mostrado uma mensagem de alerta para o usuário    
                if(valorGastoCategorias[i] > valorRecomendadoCategorias[i]){
                    categorias[i] = response.data[i].descricao
                }
            }

            //Verifica se tem alguma categoria que extrapolou o limite
            if(categorias.length > 0){  
                flagLimite=true
            }else{
                flagLimite=false
            }

            response = await api.get("/relatorio/situacaogeral")

            
            saldo = response.data.valorDisponivel
            this.setState({
                
                valorGastoCategorias: valorGastoCategorias,
                valorRecomendadoCategorias: valorRecomendadoCategorias,
                saldo: saldo,
                flagLimite:flagLimite,
                categorias:categorias,
                
            })
            console.log(`STATE FLAG LIMITE RELOAD: ${this.state.flagLimite}`)

        } catch (err) {
            alert(err);
        }
    }


    componentDidMount = async () => {

        //Variáveis para os Dados
        let response
        let valorGastoCategorias = []
        let categorias = []
        let valorRecomendadoCategorias = []
        let saldo
        let flagLimite


        try {

            //GET Valores Categoria Despesa
            response = await api.get("/relatorio/categoriadespesa/analisegastos")

            for (var i = 0; i < response.data.length; i++) {

                valorGastoCategorias[i] = response.data[i].valorGasto
                valorRecomendadoCategorias[i] = response.data[i].valorMaximo

                // Se o valor gasto extrapolar o valor recomendado de cada categoria, será mostrado uma mensagem de alerta para o usuário    
                if(valorGastoCategorias[i] > valorRecomendadoCategorias[i]){
                    categorias[i] = response.data[i].descricao
                }
            }

            //Verifica se tem alguma categoria que extrapolou o limite
            if(categorias.length > 0){  
                flagLimite=true
            }else{
                flagLimite=false
            }

            response = await api.get("/relatorio/situacaogeral")

            
            saldo = response.data.valorDisponivel
            this.setState({
                
                valorGastoCategorias: valorGastoCategorias,
                valorRecomendadoCategorias: valorRecomendadoCategorias,
                saldo: saldo,
                flagLimite:flagLimite,
                categorias:categorias,
                
            })
            console.log(`STATE FLAG LIMITE DID MOUNT: ${this.state.flagLimite}`)

        } catch (err) {
            alert(err);
        }

    }

    handleSignInPress = async (values) => { }



    render() {

        const { categorias,labelWidth, selectedSlice, valorGastoCategorias, valorRecomendadoCategorias } = this.state;
        const { label, value } = selectedSlice;
        const keys = ['Estilo de Vida', 'Gastos Essenciais', 'Investimento'];
        const colors = ['#FEC300', '#FE8084', '#2E37F2']
        const data = keys.map((key, index) => {
            return {
                key,
                value: this.state.valorGastoCategorias[index],
                svg: { fill: colors[index] },
                arc: { outerRadius: (70 /*+ values[index]*/) + '%', padAngle: label === key ? 0.1 : 0 },
                onPress: () => this.setState({ selectedSlice: { label: key, value: this.state.valorGastoCategorias[index] } })
            }
        })
        const deviceWidth = Dimensions.get('window').width
        const BG = (props) => <Text style={{fontWeight: 'bold', fontSize:18, color:'#00DFA8'}}>{props.children}</Text>
        const BR = (props) => <Text style={{fontWeight: 'bold', fontSize:18, color:'#F24750'}}>{props.children}</Text>
        const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

        return (
            
            <View style={{ flex: 1 }}>
                <Formik
                    initialValues={{
                        categorias:categorias, valorGastoCategorias: valorGastoCategorias, selectedSlice: selectedSlice,valorRecomendadoCategorias:valorRecomendadoCategorias
                    }}
                    enableReinitialize={true}
                    // validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View style={styles.body}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>
                                    <Text style={styles.textBodyT}>Verifique no gráfico abaixo quanto você já gastou em cada categoria</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <PieChart
                                        style={{ height: 500, marginTop: -130, marginBottom: -140 }}
                                        outerRadius={'85%'}
                                        innerRadius={'45%'}
                                        data={data}
                                    />
                                    <Text
                                        onLayout={({ nativeEvent: { layout: { width } } }) => {
                                            this.setState({ labelWidth: width });
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: deviceWidth / 2.2 - labelWidth / 2,
                                            textAlign: 'center',
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                            color: '#4f4f4f'
                                        }}>
                                        {`${label} \n R$${value}`}
                                    </Text>
                                </View>

                                <View>
                                    {this.state.flagLimite &&
                                        <View>
                                            <Text style={styles.textBody}>
                                                Com a sua renda de <BG>R${this.state.saldo}</BG>, o ideal é que desse valor estivesse sendo gasto:{`\n`}
                                                {`\n`}<B>35%(R${this.state.valorRecomendadoCategorias[0]})</B> com estilo de vida
                                                {`\n`}<B>50%(R${this.state.valorRecomendadoCategorias[1]})</B> com gastos essenciais
                                                {`\n`}<B>15%(R${this.state.valorRecomendadoCategorias[2]})</B> com investimentos
                                                {`\n`}
                
                                                <Text>{`\n`}Você extrapolou o limite na categoria:</Text>                                            
                                            </Text>
                                            <View>
                                                {  this.state.flagLimite &&
                                                    categorias.map((item, key)=>(
                                                        <Text style={styles.textBody} > <BR>{ item }</BR> </Text>))
                                                }
                                                <Text style={styles.textBody}>
                                                    {`\n`}Você pode remanejar o valor das suas despesas e estabelecer metas para se adequar.{`\n`}
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                          
                                    {!this.state.flagLimite &&
                                        <Text style={styles.textBody}>
                                            <BG>PARABÉNS!</BG>
                                            {`\n`} Você está mantendo sua vida financeira saudável e seus gastos se adequam perfeitamente com o esperado: {`\n`}
                                            {`\n`}<B>35%(R${this.state.valorRecomendadoCategorias[0]})</B> com estilo de vida
                                            {`\n`}<B>50%(R${this.state.valorRecomendadoCategorias[1]})</B> com gastos essenciais
                                            {`\n`}<B>15%(R${this.state.valorRecomendadoCategorias[2]})</B> com investimentos
                                            {`\n`}
                                            {`\n`}<BG>Continue assim!</BG>
                                            {`\n`} Se desejar, você também pode estabelecer limites nas despesas para continuar gastando seu dinheiro adequadamente
                                            {`\n`}
                                        </Text>
                                    }

                                    {/* <Form /> */}
                                    <TouchableOpacity onPress={this.goRemanejarGastos}>
                                        <ButtonBlue>
                                            <ButtonText>Remanejar Gastos</ButtonText>
                                        </ButtonBlue>
                                    </TouchableOpacity>
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
    containerBox: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 16,
        width: "95%",
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 2,
        elevation: 4,
    },
    textBody: {
        textAlign: 'center',
        fontSize: 16,
        // margin: 15,
        // paddingLeft: 5,
        // paddingRight: 5,
        // paddingTop:100,
    },
    textBodyT: {
        // textAlign: 'center',
        fontSize: 16,
        // margin: 15,
        // paddingTop:100,
    },
    body: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },

    title: {
        color: '#000',
        fontFamily: 'shelter',
        height: 30,
        fontSize: 25,
        marginBottom: 10,
        paddingLeft: 10,
    }

});

