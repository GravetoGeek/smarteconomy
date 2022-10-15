import React, {Component} from 'react';
import {StyleSheet, Text, View, Image } from 'react-native';


export default props =>{
    return(
        <View style={styles.container}>
            <Image options={{email: props.email, secure:true}} style={styles.avatar} source={{ uri: props.source }} />
            <Text style={styles.nickname}>{props.nickname}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar:{
        width:40,
        height:40,
        borderRadius:15,
        marginHorizontal:10
    },
    nickname:{
        color: '#444',
        marginVertical:10,
        fontSize:15,
        fontWeight: 'bold'

    }
})