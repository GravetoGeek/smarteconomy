import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, SafeAreaView, Text } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/FontAwesome';

const DEFAULT_TOGGLE_SIZE = 80;
const options = [
    'Adicionar Despesa', 
    'Adicionar Receita', 
    'Adicionar Conta',
    'Remanejar Gastos', 
    <Icon name='close' size={30} color={'#FFF'}></Icon>,
  ]

export default class AddButton extends Component {

    togglePressed = () => {
        this.showActionSheet()
    };

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    renderActions = () => {
        return (
            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={options}
                cancelButtonIndex={4}
                destructiveButtonIndex={4}
                styles={actionSheetStyle}
                tintColor={'#232d3a'}
                onPress={(index) => {
                    if (index === 0) {
                        this.props.navigation.navigate('Despesa');
                    } else if (index === 1) {
                        this.props.navigation.navigate('Receita');
                    } else if (index === 2) {
                        this.props.navigation.navigate('Conta');
                    } else if (index === 3) {
                        this.props.navigation.navigate('AnaliseGastos');
                    } 
                }}
            />
        );

    };

    render() {

        return (
            <SafeAreaView>
                <View>
                    {this.renderActions()}
                </View>

                <TouchableWithoutFeedback
                    onPress={this.togglePressed}
                >
                    <View style={[Styles.toggleButton, {
                        width: 80,
                        height: 80,
                        borderRadius: 80 / 2,
                        backgroundColor: '#06C496'
                    }]}>
                         <Icon name='plus' size={30} color={'#FFF'}/>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}

const actionSheetStyle = {
    body: {
        flex: 1,
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
    },
    buttonBox: {
        width: '90%',
        height: 70,
        marginTop: 10,
        borderRadius:20,
        alignSelf: 'center',
    },
    cancelButtonBox:{
        backgroundColor:'#ef3232',
        width: '18%',
        height: 70,
        marginTop: 10,
        alignSelf: 'center',
        borderRadius:100,
    }
}

const Styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toggleButton: {
        bottom: 4,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
};
