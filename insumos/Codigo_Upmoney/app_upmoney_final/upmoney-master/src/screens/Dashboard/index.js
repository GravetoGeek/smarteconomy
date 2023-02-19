import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from 'react-native';


import Header from '../../components/Header';
import Form from './form';


export default class Dashboard extends Component{

    render(){
        return(
            <View style={styles.body}>
                <View style={styles.headerContainer}>
                    <Header navigation={this.props.navigation} title={'Dashboard'}/>{/*Envia o objeto de navegação para o componente Header*/}
                </View>
                <View style={{flex:1}}>
                    <Form navigation={this.props.navigation}/>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body:{
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },

    headerContainer:{
        paddingTop:30,
        marginTop:-15,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },


})