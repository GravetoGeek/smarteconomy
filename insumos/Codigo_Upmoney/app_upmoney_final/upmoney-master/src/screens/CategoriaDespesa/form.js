import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Modal, TouchableOpacity, Picker } from 'react-native';
import { ButtonBlue, ButtonText } from '../../components/Components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../components/Api';
import { showSuccess } from '../../common'

import { ErrorMessage, Formik, Field } from 'formik';
import * as yup from 'yup';
import { FlatList } from 'react-native-gesture-handler';

const ReviewSchema = yup.object({

    itemSelecionado: yup.object()
        .when('modalNewEdit', {
            is: true,
            then: yup.object().shape({
                descricao: yup.string().required('Este campo é obrigatório.'),
                categoria: yup.object().shape({
                    descCategoria: yup.string().required('Este campo é obrigatório.'),
                })
            }),
        }),

});


export default class Form extends Component {


    state = {

        search: '',

        //Variáveis para Editar e Criar uma nova variável
        itemSelecionado: {
            id: null,
            descricao: '',
            icone: '',
            categoria: {
                id: null,
                descCategoria: '',
                porcentagem: null
            },
        },

        usuarioId: null,

        novaSubcategoriaDespesa: false,

        categoria: {
            id: null,
            descCategoria: '',
            porcentagem: null
        },

        //Variáveis para acionar modais
        modalNewEdit: false,

        modalDel: false,

        //Variáveis para controlar a renderização das listas
        isGastosEssenciais: false,

        isEstiloVida: false,

        isInvestimento: false,

        //Variáveis para Listas
        listaCategorias: [
            {
                id: 4,
                descCategoria: '',
                porcentagem: null
            }, {
                id: 5,
                descCategoria: '',
                porcentagem: null
            }, {
                id: 6,
                descCategoria: '',
                porcentagem: null
            }
        ],

        listaGastosEssenciais: [
            {
                id: null,
                icone: '',
                descSubcategoria: '',
                categoriaDespesa: {
                    descCategoria: '',
                    id: null,
                    porcentagem: ''
                }
            },
        ],

        listaEstiloVida: [
            {
                id: null,
                icone: '',
                descSubcategoria: '',
                categoriaDespesa: {
                    descCategoria: '',
                    id: null,
                    porcentagem: ''
                }
            },
        ],

        listaInvestimentos: [
            {
                id: null,
                icone: '',
                descSubcategoria: '',
                categoriaDespesa: {
                    descCategoria: '',
                    id: null,
                    porcentagem: ''
                }
            },
        ],

        listaIcones: [
            {
                id: 0,
                name: 'home'
            },
            {
                id: 1,
                name: 'car'
            },
            {
                id: 2,
                name: 'envelope-open-text'
            },
            {
                id: 3,
                name: 'briefcase-medical'
            },
            {
                id: 4,
                name: 'mobile'
            },
            {
                id: 5,
                name: 'wifi'
            },
            {
                id: 6,
                name: 'school'
            },
            {
                id: 7,
                name: 'smoking'
            },
            {
                id: 8,
                name: 'spotify'
            },
            {
                id: 9,
                name: 'uber'
            },
            {
                id: 10,
                name: 'utensils'
            }
            
            
        ],


    }


    handleSignInPress = async (values) => {
        console.log(`Search: ${values.search}`)
        console.log(`ID: ${values.itemSelecionado.id}`)
        console.log(`Nome: ${values.itemSelecionado.descricao}`)
        console.log(`Categoria Despesa: ${JSON.stringify(values.itemSelecionado.categoria)}`)
        console.log(`Ícone: ${values.itemSelecionado.icone}`)
        console.log(`É gastos essenciais? ${this.state.isGastosEssenciais}`)
        console.log(`É estilo de vida? ${this.state.isEstiloVida}`)
        console.log(`É investimento? ${this.state.isInvestimento}`)


        try {
            let listaCategoriasUsuario = []
            let listaSubcategoriasDespesa = []
            let listaGastosEssenciais = []
            let listaEstiloVida = []
            let listaInvestimentos = []

            if (this.state.novaSubcategoriaDespesa) {
                console.log("Entrei nova categoria")


                let response = await api.post('categoria/subcategoria/inserir', {
                    descSubcategoria: values.itemSelecionado.descricao,
                    icone: values.itemSelecionado.icone,
                    categoriaDespesa: {
                        id: values.itemSelecionado.categoria.id
                    },
                    usuario: {
                        id: this.state.usuarioId
                    }
                })

                // para atualizar a lista de Subcategorias que está no state
                response = await api.get(`categoria/subcategoria/usuario/${this.state.usuarioId}`)
                console.log(`Subcategoria despesa: ${JSON.stringify(response.data)}`)
                listaSubcategoriasDespesa = response.data

                listaSubcategoriasDespesa.map((subcategoria) => {
                    if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                        listaGastosEssenciais.push(subcategoria)
                        // console.log(`Subcategoria de Gastos Essênciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                    } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                        listaEstiloVida.push(subcategoria)
                        // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                    } else {
                        listaInvestimentos.push(subcategoria)
                        // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                    }
                })


                this.setState({ listaGastosEssenciais: listaGastosEssenciais, listaEstiloVida: listaEstiloVida, listaInvestimentos: listaInvestimentos })

                showSuccess('Subcategoria Inserida!')
            } else {


                let response = await api.put('categoria/subcategoria/alterar', {
                    id: values.itemSelecionado.id,
                    descSubcategoria: values.itemSelecionado.descricao,
                    icone: values.itemSelecionado.icone,
                    categoriaDespesa: {
                        id: values.itemSelecionado.categoria.id
                    },
                    usuario: {
                        id: this.state.usuarioId
                    }

                })

                // para atualizar a lista de Subcategorias que está no state
                response = await api.get(`categoria/subcategoria/usuario/${this.state.usuarioId}`)
                listaSubcategoriasDespesa = response.data
                listaSubcategoriasDespesa.map((subcategoria) => {
                    if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                        listaGastosEssenciais.push(subcategoria)
                        // console.log(`Subcategoria de Gastos Essênciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                    } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                        listaEstiloVida.push(subcategoria)
                        // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                    } else {
                        listaInvestimentos.push(subcategoria)
                        // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                    }
                })
                this.setState({ listaGastosEssenciais: listaGastosEssenciais, listaEstiloVida: listaEstiloVida, listaInvestimentos: listaInvestimentos })


                showSuccess('Subcategoria Atualizada!')
            }
            this.setState({ modalNewEdit: false })
        } catch (err) {
            alert(err)
        }

    }

    deleteCategoria = async () => {
        console.log(`Id state: ${this.state.itemSelecionado.id}`)
        let listaSubcategoriasDespesa = []
        let listaGastosEssenciais = []
        let listaEstiloVida = []
        let listaInvestimentos = []


        try {
            let response = await api.delete(`categoria/subcategoria/excluir/${this.state.itemSelecionado.id}`)


            // para atualizar a lista de Subcategorias que está no state
            response = await api.get(`categoria/subcategoria/usuario/${this.state.usuarioId}`)
            listaSubcategoriasDespesa = response.data

            listaSubcategoriasDespesa.map((subcategoria) => {
                if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                    listaGastosEssenciais.push(subcategoria)
                    // console.log(`Subcategoria de Gastos Essenciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                    listaEstiloVida.push(subcategoria)
                    // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                } else {
                    listaInvestimentos.push(subcategoria)
                    // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                }
            })
            this.setState({ listaGastosEssenciais: listaGastosEssenciais, listaEstiloVida: listaEstiloVida, listaInvestimentos: listaInvestimentos })
            showSuccess('Subcategoria Excluída!')

            this.setState({ modalDel: false })

        } catch (err) {
            alert(err)
        }
    }


    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null
        let listaCategoriasUsuario = []
        let listaSubcategoriasDespesa = []
        let listaGastosEssenciais = []
        let listaEstiloVida = []
        let listaInvestimentos = []

        try {
            let response = await api.get("/categoria/despesa")
            listaCategoriasUsuario = response.data

            dadosUsuario = JSON.parse(dadosUsuarioJson)
            console.log(`conta/usuario/${dadosUsuario.id}`)

            response = await api.get(`categoria/subcategoria/usuario/${dadosUsuario.id}`)
            console.log(`Subcategoria despesa: ${JSON.stringify(response.data)}`)
            listaSubcategoriasDespesa = response.data

            listaSubcategoriasDespesa.map((subcategoria) => {
                if (subcategoria.categoriaDespesa.descCategoria == "Gastos Essenciais") {
                    listaGastosEssenciais.push(subcategoria)
                    // console.log(`Subcategoria de Gastos Essenciais: ${JSON.stringify(listaSubcategoriaGE)}`)
                } else if (subcategoria.categoriaDespesa.descCategoria == "Estilo de Vida") {
                    listaEstiloVida.push(subcategoria)
                    // console.log(`Subcategoria de Estilo de Vida: ${JSON.stringify(listaSubcategoriaEV)}`)
                } else {
                    listaInvestimentos.push(subcategoria)
                    // console.log(`Subcategoria de Investimento ${JSON.stringify(listaSubcategoriaI)}`)
                }
            })

            this.setState({
                listaCategorias: listaCategoriasUsuario, usuarioId: dadosUsuario.id, listaGastosEssenciais: listaGastosEssenciais,
                listaEstiloVida: listaEstiloVida, listaInvestimentos: listaInvestimentos
            })
        } catch (err) {
            alert(err);
        }
    }


    render() {

        const { search, novaSubcategoriaDespesa, modalNewEdit, modalDel, listaCategorias, listaGastosEssenciais, listaEstiloVida, listaInvestimentos, listaIcones,
            isGastosEssenciais, isEstiloVida, isInvestimento, itemSelecionado, categoria } = this.state

        return (
            <View>
                <Formik
                    initialValues={{
                        search: search, listaGastosEssenciais: listaGastosEssenciais, listaEstiloVida: listaEstiloVida, listaInvestimentos: listaInvestimentos, modalNewEdit: modalNewEdit, modalDel: modalDel,
                        listaIcones: listaIcones, listaCategorias: listaCategorias, isGastosEssenciais: isGastosEssenciais, isEstiloVida: isEstiloVida,
                        isInvestimento: isInvestimento, itemSelecionado: itemSelecionado, categoria: categoria
                    }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View>


                            <View style={[styles.paddingTop, { marginBottom: 5 }]}>

                                <View style={styles.flexRow}>

                                    <TouchableOpacity onPress={() => this.setState({
                                        novaSubcategoriaDespesa: true,
                                        modalNewEdit: true,
                                        itemSelecionado: {
                                            descricao: "",
                                            icone: "question",
                                            categoria: {
                                                id: null,
                                                descCategoria: '',
                                                porcentagem: null
                                            },
                                        }
                                    })}
                                    >
                                        <View style={styles.buttonAdd}>
                                            <Text style={styles.textAdd}>+</Text>
                                        </View>
                                    </TouchableOpacity>


                                </View>

                            </View>

                            <TouchableOpacity style={[styles.flexRow, styles.itemCategoria]}
                                onPress={() => this.setState({
                                    isEstiloVida: !isEstiloVida

                                })}>

                                <View style={styles.flexStart}>
                                    <Icon name={'angle-down'} size={18} color="rgba(4, 44, 92, 0.8)" />
                                    <Text style={styles.titleCategoria}>{listaCategorias[0].descCategoria}</Text>
                                </View>

                            </TouchableOpacity>


                            {isEstiloVida &&

                                <FlatList
                                    data={props.values.listaEstiloVida}
                                    renderItem={({ item, index }) => (
                                        <View style={[styles.flexRow, styles.itemSubcategoria]}>

                                            <View style={{width:'85%'}}>
                                                <TouchableOpacity onPress={() => 
                                                this.setState({
                                                    modalNewEdit: true,
                                                    novaSubcategoriaDespesa: false,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descSubcategoria,
                                                        icone: item.icone,
                                                        categoria: {
                                                            id: item.categoriaDespesa.id,
                                                            descCategoria: item.categoriaDespesa.descCategoria,
                                                            porcentagem: item.categoriaDespesa.porcentagem,
                                                        }
                                                    },
                                                    categoria: {
                                                        id: item.categoriaDespesa.id,
                                                        descCategoria: item.categoriaDespesa.descCategoria,
                                                        porcentagem: item.categoriaDespesa.porcentagem,
                                                    }
                                                })}
                                                >
                                                {console.log(`MODAL DEL NO ESTILO DE VIDA: ${props.values.itemSelecionado.descricao}`)}
                                                    {console.log(`MODAL DEL NO ESTILO DE VIDA: ${this.state.modalDel}`)}
                                                    <View style={styles.flexStart}>
                                                        <Icon name={item.icone} size={16} color="rgba(4, 44, 92, 0.8)" />
                                                        <TextInput
                                                            style={styles.titleSubcategoria}
                                                            editable={false}
                                                            selectTextOnFocus={false}
                                                            autoCapitalize={'words'}
                                                            value={item.descSubcategoria}
                                                            />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.flexEnd}>
                                                <TouchableOpacity onPress={() => 
                                                this.setState({
                                                    modalDel: true,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descricao,
                                                        icone: item.icone,
                                                        // categoria: {
                                                        //     id: item.categoria.id,
                                                        //     descCategoria: item.categoria.descCategoria,
                                                        //     porcentagem: null}
                                                    }
                                                })}
                                                >
                                                    <Icon2 style={{paddingRight:10}} name="x-circle" size={20} color="#bfb9b9" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', }}
                                />

                            }

                            <TouchableOpacity style={[styles.flexRow, styles.itemCategoria]}
                                onPress={() => this.setState({
                                    isGastosEssenciais: !isGastosEssenciais

                                })}>

                                <View style={styles.flexStart}>
                                    <Icon name={'angle-down'} size={18} color="rgba(4, 44, 92, 0.8)" />
                                    <Text style={styles.titleCategoria}>{listaCategorias[1].descCategoria}</Text>
                                </View>

                            </TouchableOpacity>


                            {isGastosEssenciais &&

                                <FlatList
                                    data={props.values.listaGastosEssenciais}
                                    renderItem={({ item, index }) => (
                                        <View style={[styles.flexRow, styles.itemSubcategoria]}>
                                            <View style={{width:'85%'}}>
                                                <TouchableOpacity onPress={() => 
                                                this.setState({
                                                    modalNewEdit: true,
                                                    novaSubcategoriaDespesa: false,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descSubcategoria,
                                                        icone: item.icone,
                                                        categoria: {
                                                            id: item.categoriaDespesa.id,
                                                            descCategoria: item.categoriaDespesa.descCategoria,
                                                            porcentagem: item.categoriaDespesa.porcentagem,
                                                        }
                                                    },
                                                    categoria: {
                                                        id: item.categoriaDespesa.id,
                                                        descCategoria: item.categoriaDespesa.descCategoria,
                                                        porcentagem: item.categoriaDespesa.porcentagem,
                                                    }
                                                })}
                                                >

                                                    <View style={styles.flexStart}>
                                                        <Icon name={item.icone} size={16} color="rgba(4, 44, 92, 0.8)" />
                                                        <TextInput
                                                            style={styles.titleSubcategoria}
                                                            editable={false}
                                                            selectTextOnFocus={false}
                                                            autoCapitalize={'words'}
                                                            value={item.descSubcategoria}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.flexEnd}>
                                                <TouchableOpacity onPress={() => this.setState({
                                                    modalDel: true,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descricao,
                                                        icone: item.icone,

                                                    }
                                                })}
                                                >
                                                    <Icon2 style={{paddingRight:10}} name="x-circle" size={20} color="#bfb9b9" />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    )}
                                    style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', }}
                                />

                            }

                            <TouchableOpacity style={[styles.flexRow, styles.itemCategoria]}
                                onPress={() => this.setState({
                                    isInvestimento: !isInvestimento

                                })}>

                                <View style={styles.flexStart}>
                                    <Icon name={'angle-down'} size={18} color="rgba(4, 44, 92, 0.8)" />
                                    <Text style={styles.titleCategoria}>{listaCategorias[2].descCategoria}</Text>
                                </View>

                            </TouchableOpacity>


                            {isInvestimento &&

                                <FlatList
                                    data={props.values.listaInvestimentos}
                                    renderItem={({ item, index }) => (
                                        <View style={[styles.flexRow, styles.itemSubcategoria]}>
                                            <View style={{width:'85%'}}>
                                                <TouchableOpacity onPress={() => 
                                                this.setState({
                                                    modalNewEdit: true,
                                                    novaSubcategoriaDespesa: false,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descSubcategoria,
                                                        icone: item.icone,
                                                        categoria: {
                                                            id: item.categoriaDespesa.id,
                                                            descCategoria: item.categoriaDespesa.descCategoria,
                                                            porcentagem: item.categoriaDespesa.porcentagem,
                                                        }
                                                    },
                                                    categoria: {
                                                        id: item.categoriaDespesa.id,
                                                        descCategoria: item.categoriaDespesa.descCategoria,
                                                        porcentagem: item.categoriaDespesa.porcentagem,
                                                    }
                                                })}
                                                >
                                                    <View style={styles.flexStart}>
                                                        <Icon name={item.icone} size={16} color="rgba(4, 44, 92, 0.8)" />
                                                        <TextInput
                                                            style={styles.titleSubcategoria}
                                                            editable={false}
                                                            selectTextOnFocus={false}
                                                            autoCapitalize={'words'}
                                                            value={item.descSubcategoria}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.flexEnd}>                                                
                                                <TouchableOpacity onPress={() => this.setState({
                                                    modalDel: true,
                                                    itemSelecionado: {
                                                        ...this.state.itemSelecionado,
                                                        id: item.id,
                                                        descricao: item.descricao,
                                                        icone: item.icone,
                                                    }
                                                })}
                                                >
                                                    <Icon2 style={{paddingRight:10}} name="x-circle" size={20} color="rgba(4, 44, 92, 0.8)" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', }}
                                />

                            }

                            {/* Modal New */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalNewEdit}
                            >
                                <View style={styles.screenCenter}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalTitle}>

                                            {
                                                novaSubcategoriaDespesa
                                                    ? <Text style={styles.contentModalTitle}>Nova Subcategoria</Text>
                                                    : <Text style={styles.contentModalTitle}>Alterar Subcategoria {props.values.itemSelecionado.descricao}</Text>
                                            }
                                        </View>
                                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>

                                            {console.log(`Nome da SubCategoria: ${props.values.itemSelecionado.descricao}`)}
                                            {console.log(`Icone da SubCategoria: ${props.values.itemSelecionado.icone}`)}
                                            {console.log(`Nome da Categoria: ${props.values.itemSelecionado.categoria.descCategoria}`)}

                                            {/* Nome da Categoria */}
                                            <Text style={styles.label}>Nome da Subcategoria</Text>

                                            <View style={styles.elementsSide}>
                                                <View style={{ width: '75%' }}>

                                                    <TextInput
                                                        style={styles.input}
                                                        autoCapitalize={'words'}
                                                        onChangeText={props.handleChange('itemSelecionado.descricao')}
                                                        onBlur={props.handleBlur('itemSelecionado.descricao')}
                                                        value={props.values.itemSelecionado.descricao}
                                                    />

                                                    <ErrorMessage style={styles.error} component={Text} name="itemSelecionado.descricao" />
                                                </View>

                                                <View style={{ width: '15%' }}>
                                                    <Icon name={props.values.itemSelecionado.icone} size={30} color="#3F3F3F" />
                                                </View>
                                            </View>

                                            <Text style={[styles.textIcon, { marginTop: 10 }]}>Icone</Text>

                                            <View style={styles.includesIcons}>

                                                <FlatList
                                                    data={props.values.listaIcones}
                                                    horizontal
                                                    renderItem={({ item, index }) => (

                                                        <TouchableOpacity onPress={() => this.setState(prevState => ({
                                                            itemSelecionado: {
                                                                ...prevState.itemSelecionado,
                                                                descricao: props.values.itemSelecionado.descricao,
                                                                icone: item.name,
                                                                categoria: props.values.itemSelecionado.categoria,
                                                            }
                                                        }))}
                                                        >
                                                            <View style={styles.eachIcon}>
                                                                <Icon name={item.name} size={30} color="#3F3F3F" />
                                                            </View>

                                                        </TouchableOpacity>

                                                    )}
                                                />

                                            </View>
                                            <ErrorMessage style={styles.error} component={Text} name="itemSelecionado.icone" />

                                            <Text style={styles.label}>Categoria</Text>
                                            <View style={styles.pickerView}>
                                                <Picker
                                                    style={styles.picker}
                                                    selectedValue={props.values.itemSelecionado.categoria}
                                                    onValueChange={value =>
                                                        props.setFieldValue('itemSelecionado.categoria', value)}
                                                >

                                                    <Picker.Item label="Selecione a Categoria" color="#77869E" value={{
                                                        id: props.values.itemSelecionado.id,
                                                        descricao: props.values.itemSelecionado.descricao,
                                                        icone: props.values.itemSelecionado.icone,
                                                        categoria: {
                                                            id: null,
                                                            descCategoria: '',
                                                            porcentagem: null,
                                                        }

                                                    }} />

                                                    {/* 
                                                    {novaSubcategoriaDespesa &&
                                                        <Picker.Item label="Selecione" color="#77869E" value={{
                                                            id: null,
                                                            descCategoria: '',
                                                        }} />
                                                    } */}


                                                    {props.values.listaCategorias.map((item, index) => (

                                                        <Picker.Item label={item.descCategoria} color="#042C5C" key={item.id} value={item} />
                                                    ))}

                                                </Picker>
                                            </View>


                                            <ErrorMessage style={styles.error} component={Text} name="itemSelecionado.categoria.descCategoria" />


                                            <TouchableOpacity style={styles.includesButton} onPress={props.handleSubmit} >
                                                <ButtonBlue>
                                                    <ButtonText>SALVAR</ButtonText>
                                                </ButtonBlue>
                                            </TouchableOpacity>

                                        </View>




                                    </View>


                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            modalNewEdit: false,
                                            itemSelecionado: {
                                                id: null,
                                                descricao: '',
                                                icone: '',
                                                categoria: {
                                                    id: null,
                                                    descCategoria: '',
                                                    porcentagem: null
                                                }
                                            },
                                            categoria: {
                                                id: null,
                                                descCategoria: '',
                                                porcentagem: null
                                            }
                                        })}
                                        value={props.values.modalNewEdit}
                                    >
                                        <View style={styles.buttonClose}>
                                            <Icon3 name='close' size={25} color={'#FFF'}></Icon3>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </Modal>

                            {/* Modal Delete */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalDel}
                            >
                                <View style={styles.screenCenter}>
                                    <View style={[styles.modalContent, { width: '70%' }]}>
                                        <View style={styles.modalTitle}>
                                            {props.values.modalDel &&
                                                <Text style={styles.contentModalTitle}>Excluir a Subcategoria ?</Text>

                                            }
                                        </View>
                                        <View style>
                                            <TouchableOpacity onPress={this.deleteCategoria}>
                                                <View style={[styles.confirmDelete]}>
                                                    <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                    <Icon name="check" size={20} color="#00DFA8" />
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => 
                                            this.setState({
                                                modalDel: false,
                                                itemSelecionado: {
                                                    id: null,
                                                    descricao: '',
                                                    icone: '',
                                                    categoria: {
                                                        id: null,
                                                        descCategoria: '',
                                                        porcentagem: null
                                                    }
                                                },
                                                categoria: {
                                                    id: null,
                                                    descCategoria: '',
                                                    porcentagem: null
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
            </View >
        )
    }


}


const styles = StyleSheet.create({

    confirmDelete:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20, 
        paddingBottom: 25,
        paddingLeft:20,
        paddingRight:20,
        borderBottomColor:'#606060',
        borderBottomWidth:0.5, 
        width:'100%'
    },

    cancelDelete:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        paddingTop: 25, 
        paddingBottom: 8,
        paddingLeft:20,
        paddingRight:20,
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    flexStart: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },

    flexEnd: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },

    spaceAround: {
        justifyContent: 'space-around',
    },

    paddingTop: {
        marginTop: 5,
    },

    backgroundGray: {
        width: '98%',
        height: 30,
        backgroundColor: '#EAEAEA',
        marginLeft: '1%',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },

    buttonAdd: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#06C496',
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textAdd: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    searchImage: {
        marginLeft: 15,
        marginRight: 5,
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

    searchInput: {
        width: '40%',
        height: 30,
        backgroundColor: '#EAEAEA',
        color: '#042C5C',
        paddingTop: 3,
        paddingBottom: 3,
    },

    itemCategoria: {
        flexGrow: 1,
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },

    itemSubcategoria: {
        flexGrow: 1,
        paddingLeft: 10,
        fontSize: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },

    titleCategoria: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        letterSpacing: 0.4,
        color: '#042C5C',
        paddingLeft: 15,
    },

    titleSubcategoria: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        letterSpacing: 0.4,
        color: '#042C5C',
        paddingLeft: 15,
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

    textIcon: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 15,
        color: '#77869E',
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        marginBottom: 5,
        marginTop: 2,
    },

    includesIcons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
    },

    eachIcon: {
        paddingLeft: 7,
        paddingRight: 7,
        alignItems: 'center',
    },
    includesButton: {
        flexGrow: 1,
        marginTop: 15,
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

    textClose: {
        color: '#FFFFFF',
        fontSize: 20,
        lineHeight: 20,
        fontWeight: 'bold',
    },

    textModalDel: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#606060',
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

    error: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 2,
        paddingLeft: 5,
        color: '#FF0000',
    },
});

