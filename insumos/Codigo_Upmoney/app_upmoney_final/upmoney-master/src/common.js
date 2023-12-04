import {Alert } from 'react-native'

 function showError(err) {

    if(err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`)
    }else{
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
    }

     
 }

 function showSuccess(msg) {
    Alert.alert('Sucesso!', `${msg}`)
}

export {showError, showSuccess}