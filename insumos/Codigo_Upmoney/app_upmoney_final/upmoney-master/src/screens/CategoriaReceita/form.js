import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Modal, TouchableOpacity } from 'react-native';
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
            }),
        }),

});


export default class Form extends Component {


    state = {

        search: '',

        novaCategoriaReceita: false,

        modalNewEdit: false,

        modalDel: false,

        usuarioId: null,

        itemSelecionado: {
            id: null,
            icon: '',
            descricao: '',
        },

        categorias: [
            {
                id: null,
                icone: '',
                descCategoria: ''
            },
        ],

        listaIcones: [
            {
                id: 0,
                name: 'money-bill'
            },
            {
                id: 1,
                name: 'money-check-alt'
            },
            {
                id: 2,
                name: 'piggy-bank',
            },
            {
                id: 3,
                name: 'handshake',
            },
            {
                id: 4,
                name: 'truck-moving',
            },
            {
                id: 5,
                name: 'envelope',
            },
            {
                id: 6,
                name: 'certificate',
            },
            {
                id: 7,
                name: 'uber'
            },
        ],


    }

    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null
        let listaCategoriasUsuario = []


        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)

            console.log(`conta/usuario/${dadosUsuario.id}`)

            let response = await api.get("categoria/receita/usuario")
            console.log(`Categorias receita: ${JSON.stringify(response.data)}`)
            listaCategoriasUsuario = response.data

            this.setState({ categorias: listaCategoriasUsuario, usuarioId: dadosUsuario.id })

        } catch (err) {
            alert(err);
        }
    }



    handleSignInPress = async (values) => {

        console.log(`Search: ${values.search}`)
        console.log(`ID: ${values.itemSelecionado.id}`)
        console.log(`Nome: ${values.itemSelecionado.descricao}`)
        console.log(`Ícone: ${values.itemSelecionado.icon}`)

        try {
            let listaCategoriasUsuario = []
            if (this.state.novaCategoriaReceita) {

                let response = await api.post('categoria/receita/inserir', {
                    descCategoria: values.itemSelecionado.descricao,
                    icone: values.itemSelecionado.icon,
                    usuario: {
                        id: this.state.usuarioId
                    }
                })

                // para atualizar a lista de categorias que está no state
                response = await api.get("categoria/receita/usuario")
                console.log(`Categorias receita: ${JSON.stringify(response.data)}`)
                listaCategoriasUsuario = response.data

                this.setState({ categorias: listaCategoriasUsuario })

                showSuccess('Categoria Inserida!')
            } else {
                let response = await api.put('categoria/receita/alterar', {
                    id: values.itemSelecionado.id,
                    descCategoria: values.itemSelecionado.descricao,
                    icone: values.itemSelecionado.icon,
                    usuario: {
                        id: this.state.usuarioId
                    }

                })

                // para atualizar a lista de categorias que está no state
                response = await api.get(`categoria/receita/usuario`)
                console.log(`Categorias receita: ${JSON.stringify(response.data)}`)
                listaCategoriasUsuario = response.data

                this.setState({ categorias: listaCategoriasUsuario })

                showSuccess('Categoria Atualizada!')
            }
            this.setState({ modalNewEdit: false })
        } catch (err) {
            alert(err)
        }


    }

    deleteCategoria = async () => {
        console.log("Categoria Excluída");
        console.log(`Nome state: ${this.state.itemSelecionado.descricao}`)
        console.log(`Id state: ${this.state.itemSelecionado.id}`)
        console.log(`Id usuario: ${this.state.usuarioId}`)
        console.log(`Icon state: ${this.state.itemSelecionado.icon}`)

        try {
            let response = await api.delete(`categoria/receita/excluir/${this.state.itemSelecionado.id}`)


            // para atualizar a lista de categorias que está no state
            response = await api.get("categoria/receita/usuario/")
            console.log(`Categorias receita: ${JSON.stringify(response.data)}`)
            let listaCategoriasUsuario = response.data
            
            this.setState({ categorias: listaCategoriasUsuario })
            
            showSuccess('Categoria Excluída!')
            
            this.setState({ modalDel: false })

        } catch (err) {
            alert(err)
        }
    }

    pesquisarSubcategoria = async () => {
        console.log('pesquisa subcategoria')
    }


    render() {

        const { search, nomeCategoria, novaCategoriaReceita, modalNewEdit, modalDel, icon, indexCategoria, categorias, listaIcones, itemSelecionado } = this.state

        return (
            <View>
                <Formik
                    initialValues={{
                        search: search, categorias: categorias, nomeCategoria: nomeCategoria, icon: icon, modalNewEdit: modalNewEdit, modalDel: modalDel,
                        indexCategoria: indexCategoria, listaIcones: listaIcones, itemSelecionado: itemSelecionado
                    }}
                    enableReinitialize={true}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => this.handleSignInPress(values)}
                >

                    {(props) => (
                        <View>
                            <View style={[styles.paddingTop, styles.flexRow, { marginBottom: 5, width:'80%'}]}>
                                <View>
                                    <TouchableOpacity onPress={() => this.setState({
                                        modalNewEdit: true,
                                        novaCategoriaReceita: true,
                                        itemSelecionado: {
                                            icon: "question"
                                        }
                                    })}
                                    >
                                        <View style={styles.buttonAdd}>
                                            <Text style={styles.textAdd}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>

                            {/* Lista */}
                            <FlatList
                                data={props.values.categorias}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.flexRow, styles.item,styles.spaceBetween]}>
                                        <View style={{width:'85%'}}>
                                            <TouchableOpacity onPress={() => this.setState({
                                                modalNewEdit: true,
                                                novaCategoriaReceita: false,
                                                itemSelecionado: {
                                                    ...this.state.itemSelecionado,
                                                    id: item.id,
                                                    descricao: item.descCategoria,
                                                    icon: item.icone,
                                                }
                                                
                                                })}
                                            >
                                                
                                                <View style={[styles.flexStart,styles.flexRow]}>
                                                    <Icon name={item.icone} size={18} color="rgba(4, 44, 92, 0.8)" />
                                                    <TextInput
                                                        style={styles.title}
                                                        editable={false}
                                                        selectTextOnFocus={false}
                                                        autoCapitalize={'words'}
                                                        value={item.descCategoria}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{justifyContent: 'flex-end', }}>
                                            <TouchableOpacity onPress={() => this.setState({
                                                modalDel: true,
                                                itemSelecionado: {
                                                    ...this.state.itemSelecionado,
                                                    id: item.id,
                                                    descricao: item.descCategoria,
                                                    icon: item.icone,
                                                }
                                            })}
                                            >
                                                <Icon2 name="x-circle" size={20} color="#bfb9b9" />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                )}
                                style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', }}
                            />


                            {/* Modal New */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.values.modalNewEdit}
                            >
                                <View style={styles.screenCenter}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalTitle}>
                                            {console.log(`Inserir: ${novaCategoriaReceita}`)}

                                            {
                                                novaCategoriaReceita
                                                    ? <Text style={styles.contentModalTitle}>Nova Categoria</Text>

                                                    : <Text style={styles.contentModalTitle}>Alterar Categoria {props.values.itemSelecionado.descricao}</Text>
                                            }

                                        </View>
                                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>

                                            {/* Nome da Categoria */}
                                            <Text style={styles.label}>Nome da Categoria</Text>

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
                                                    <Icon name={props.values.itemSelecionado.icon} size={30} color="#3F3F3F" />
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
                                                                icon: item.name,
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
                                                icon: '',
                                            }
                                        })
                                        }
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
                                                <Text style={styles.contentModalTitle}>Excluir a Categoria {props.values.itemSelecionado.descricao} ?</Text>

                                            }

                                        </View>
                                        <View>

                                            <TouchableOpacity onPress={(itemSelecionado) => this.deleteCategoria(itemSelecionado)}>
                                                <View style={[styles.confirmDelete]}>
                                                    <Text style={styles.textModalDel}>CONFIRMAR</Text>
                                                    <Icon name="check" size={20} color="#00DFA8" />
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.setState({
                                                modalDel: false,
                                                itemSelecionado: {
                                                    id: null,
                                                    descricao: '',
                                                    icon: '',
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

    
    textInputSearch:{
        width:'100%',
        flexDirection: 'row',
        alignItems:'center',
        marginLeft:5,
    },
    
    searchInput: {
        fontFamily: 'Roboto-Medium',
        width: '100%',
        height: 36,
        backgroundColor: '#F0F0F0',
        color: '#042C5C',
        borderRadius:5,
        // paddingTop: 3,
        // paddingBottom: 3,
    },

    spaceAround: {
        justifyContent: 'space-around',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    paddingLeft15: {
        paddingLeft: 15,
    },

    paddingTop: {
        marginTop: 5,
    },

    backgroundGray: {
        width: '98%',
        height: 30,
        backgroundColor: '#F0F0F0',
        marginLeft: '1%',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },

    buttonAdd: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#06C496',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textAdd: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    searchImage: {
        marginLeft: 10,
        marginRight: 5,
    },

    item: {
        flexGrow: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },

    title: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
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
        // borderBottomColor: '#DCDCDC',
        // borderBottomWidth: 1,
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
        borderRadius:5,
        width: '100%',
        marginBottom: 20,
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

