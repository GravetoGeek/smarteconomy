import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
    },
    btnAddTransaction: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10,
    },
    pickerAccountTransaction: {
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10,
        color: 'black',
    },
    pickerCategoryTransaction: {
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10,
        color: 'black',
    },
    pickerTypeTransaction: {
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,

        color: 'black',
    },
});
