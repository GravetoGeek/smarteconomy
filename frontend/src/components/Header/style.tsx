import { StyleSheet, StatusBar } from 'react-native';
const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: statusBarHeight / 2,
        backgroundColor: '#790ea3',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
        color: '#000000',
    },
    button: {
        backgroundColor: '#bc14ff',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    username: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});