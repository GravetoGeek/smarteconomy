import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMat from 'react-native-vector-icons/MaterialIcons';

import AddButton from './components/AddButton';

import Dashboard from './screens/Dashboard';
import Relatorios from './screens/Relatorios';
import DetalheRelatorio from './screens/DetalheRelatorio';
import Conta from './screens/Conta';
import Contas from './screens/Contas';
import Login from './screens/Login';
import LoginOuDash from './screens/LoginOuDash'
import Cadastro from './screens/Cadastro';
import RecuperarSenha from './screens/RecuperarSenha';
import CategoriaReceita from './screens/CategoriaReceita';
import CategoriaDespesa from './screens/CategoriaDespesa';
import Receita from './screens/Receita';
import Despesa from './screens/Despesa';
import RemanejarGastos from './screens/RemanejarGastos';
import AnaliseGastos from './screens/AnaliseGastos';

console.disableYellowBox = true;


const loginOrCadastroRouter = createStackNavigator({

    LoginOuDash: {
        screen: LoginOuDash,
        navigationOptions:{ title: 'LoginOuDash',
        headerShown:false}
    },
    Login:{
        screen: Login,
        navigationOptions:{title:'Login',
        headerShown:false}
    },
    Cadastro:{
        screen: Cadastro,
        navigationOptions:{ 
          // title: 'Cadastro'
          headerTitle: '',
          headerStyle: {
              backgroundColor: '#FAFBFC',
              elevation: 0
          },
        }
    },
    RecuperarSenha:{
        screen: RecuperarSenha,
        navigationOptions:{ 
          headerTitle: '',
          headerStyle: {
              backgroundColor: '#FAFBFC',
              elevation: 0
          },
        }
    },
    initialRouteName: 'LoginOuDash'
});



// Para cada tela precisa criar um Stack Navigator, com todas as rotas que partirão dessa tela
const AdicionarStack = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      headerShown:false
    },
  },
  Receita: {
    screen: Receita,
    navigationOptions: ({ navigation }) => ({
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    }),
  },
  CategoriaDespesa: {
    screen: CategoriaDespesa,
    navigationOptions: ({ navigation }) => ({
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    }),
  },
  CategoriaReceita: {
    screen: CategoriaReceita,
    navigationOptions: ({ navigation }) => ({
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    }),
  },
  Despesa: {
    screen: Despesa,
    navigationOptions: ({ navigation }) => ({
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    }),
  },
  AnaliseGastos: {
    screen: AnaliseGastos,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Conta: {
    screen: Conta,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Contas: {
    screen: Contas,
    navigationOptions: ({ navigation }) => ({
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    }),
  },
  RemanejarGastos: {
    screen: Conta,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  initialRouteName: 'Dashboard'
  // backBehavior: 'history',
});

const DashboardStack = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      headerShown:false
    },
  },
  Cadastro: {
    screen: Cadastro,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Adicionar: {
    screen: AdicionarStack,
    navigationOptions: {
      headerShown:false
    },
  },
  initialRouteName: 'Dashboard'
});

const RelatorioStack = createStackNavigator({
  Relatorios: {
    screen: Relatorios,
    navigationOptions: {
      headerShown:false
    },
  },
  Cadastro: {
    screen: Cadastro,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  DetalheRelatorio: {
    screen: DetalheRelatorio,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Adicionar: {
    screen: AdicionarStack,
    navigationOptions: {
      headerShown:false
    },
  },
    initialRouteName: 'AnaliseGastos'
});

const MetaStack = createStackNavigator({
  AnaliseGastos: {
    screen: AnaliseGastos,
    navigationOptions: {
      headerShown:false
    },
  },
  RemanejarGastos: {
    screen: RemanejarGastos,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Cadastro: {
    screen: Cadastro,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Adicionar: {
    screen: AdicionarStack,
    navigationOptions: {
      headerShown:false
    },
  },
  initialRouteName: 'AnaliseGastos'
});

const ContaStack = createStackNavigator({
  Contas: {
    screen: Contas,
    navigationOptions: {
      headerShown:false
    },
  },
  Cadastro: {
    screen: Cadastro,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Adicionar: {
    screen: AdicionarStack,
    navigationOptions: {
      headerShown:false
    },
  },
  Conta: {
    screen: Conta,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Receita: {
    screen: Receita,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
  Despesa: {
    screen: Despesa,
    navigationOptions: {
      headerTitle: '',
      headerStyle: {
          backgroundColor: '#FAFBFC',
          elevation: 0
      },
    },
  },
});


// No navegador das tabs chamamos os stack navigators de cada tela, ao invés de uma tela só chamamos um conjunto de rotas
const MenuNavigator = createBottomTabNavigator({
    Dashboard: {
        name: 'Dashboard',
        screen: DashboardStack,
        navigationOptions:{
            title: 'Dashboard',
            tabBarIcon: ({ tintColor }) => 
                <IconMat name='dashboard' size={30} color={tintColor}/>
        }
    },
    Relatorios:{
        name: 'Relatorios',
        screen: RelatorioStack,
        navigationOptions:{
            title:'Relatorios',
            tabBarIcon: ({ tintColor }) => 
            <Icon name='chart-bar' size={30} color={tintColor}/>
        }
    },
    Adicionar: {
        screen: AdicionarStack,
        // screen: () => null,
        navigationOptions: ({ navigation }) => ({
          tabBarVisible: false,
          tabBarIcon: () => (
            <AddButton
              navigation={navigation}
              icon={(
                <Icon name="plus" size={24} color={'white'} />
              )}
            />
          )
        }),
        params: {
            navigationDisabled: true
        }
      },
    AnaliseGastos:{
        name: 'AnaliseGastos',
        screen: MetaStack,
        navigationOptions:{
            title:'Analise Gastos',
            tabBarIcon: ({ tintColor }) => 
            <Icon name='piggy-bank' size={30} color={tintColor}/>
        }
    },
    Contas:{
        name: 'Contas',
        screen: ContaStack,
        navigationOptions:{
            title:'Visualizar Contas',
            tabBarIcon: ({ tintColor }) => 
            <Icon name='credit-card' size={30} color={tintColor}/>
        }
    },
},{
    initialRouteName: 'Dashboard',
    tabBarOptions: {
        showLabel:false,
        activeTintColor: '#FAFBFC',
        inactiveTintColor: '#586589',
        style: {
            backgroundColor: '#212844'
        },
        tabStyle: {}
    },
    
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        }
    }) 
});


// O Switch Navigator troca de navegadores, então do login que usa o Stack, pulamos para as tabs que usa o TabsBottom
const AppSwitchNavigator = createSwitchNavigator({
    Login: { screen: loginOrCadastroRouter },
    Dashboard: { screen: MenuNavigator },
});

const AppContainer = createAppContainer(AppSwitchNavigator);
export default AppContainer;