import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Text} from 'react-native';

import Header from '../../components/Header';
import Form from './form';


export default class Despesa extends Component{
    render(){
        
        return(
            <View style={styles.body}>
                <View style={styles.headerContainer}>
                    <Header navigation={this.props.navigation} title={' Despesa'}/>{/*Envia o objeto de navegação para o componente Header*/}
                </View>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Form navigation={this.props.navigation}/>

                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body:{
        position: 'relative',
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },

    content:{
        position: 'relative',
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingBottom: 20,
        shadowRadius: 20,
        elevation: 50,
    },
    headerContainer:{
        paddingTop:30,
        marginTop:-15,
        // backgroundColor: 'white',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
})