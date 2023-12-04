import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import PerfilAvatar from './PerfilAvatar';

export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            avatar: '',
        };
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.reloadData()
            }
        );
        this.cadastro = this.cadastro.bind(this);     
    }


    reloadData = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)

        } catch (e) {
            //sem usuário válido
        }

        this.setState({
            avatar: dadosUsuario.foto
        });
    }
    

    cadastro(){
        this.props.navigation.navigate('Cadastro');
    }


    componentDidMount = async () => {
        const dadosUsuarioJson = await AsyncStorage.getItem('dadosUsuario')
        let dadosUsuario = null

        try {
            dadosUsuario = JSON.parse(dadosUsuarioJson)

        } catch (e) {
            //sem usuário válido
        }

        this.setState({
            avatar: dadosUsuario.foto
        });

    }

    render(){
        return(
            <View style = {styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity  onPress={this.cadastro}>       
                        <PerfilAvatar source={ this.state.avatar } /> 
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        // paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:20,
        width:'100%',
    },
    rowContainer:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center'
    },
    image:{
        height:30,
        width:30,
        resizeMode: 'contain'
    },
    title: {
        fontFamily: 'Roboto-Black',
        color: '#535454',
        height:30,
        fontSize:25,
        // paddingLeft:10,
    }
})