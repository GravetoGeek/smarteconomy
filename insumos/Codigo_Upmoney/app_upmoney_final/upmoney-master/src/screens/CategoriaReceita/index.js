import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';


import Form from './form';


export default class CategoriaReceitaDespesa extends Component {

    render() {

        return (
            <View style={styles.body}>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.textLabel}>Categorias Receita</Text>
                    <Form navigation={this.props.navigation}/>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#FAFBFC',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },

    content: {
        position: 'relative',
        flex: 1,
        marginTop:30,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingBottom: 20,
        elevation: 30,
    },

    elementsSide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    textLabel: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        lineHeight: 25,
        color: '#042C5C',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    },


})