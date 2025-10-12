import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Box} from 'native-base'
import React from 'react'
import {RootStackParamList} from '../../types/navigation'
import FloatingBottomMenu from '../components/FloatingBottomMenu'
import ListTransactionByCategory from '../components/ListTransactionByCategory'
import AddAccount from '../screens/addAccount'
import AddTransaction from '../screens/addTransaction'
import Dashboard from '../screens/dashboard'
import Home from '../screens/home'
import ListTransactions from '../screens/listTransactions'
import Login from '../screens/login'
import ManageProfile from '../screens/manageProfile'
import ManageTransaction from '../screens/manageTransaction'
import Register from '../screens/register'

const Stack=createNativeStackNavigator<RootStackParamList>()



export default function Routes() {
    return (
        <Box flex={1} bg="white">
            <Stack.Navigator>


                {/*<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />*/}
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
                <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
                <Stack.Screen name="AddAccount" component={AddAccount} options={{headerShown: false}} />
                <Stack.Screen name="AddTransaction" component={AddTransaction} options={{headerShown: false}} />
                <Stack.Screen name="ManageProfile" component={ManageProfile} options={{headerShown: false}} />
                <Stack.Screen name="ListTransactionByCategory" component={ListTransactionByCategory} options={{headerShown: false}} />
                <Stack.Screen name="ListTransactions" component={ListTransactions} options={{headerShown: false}} />
                <Stack.Screen name="ManageTransaction" component={ManageTransaction} options={{headerShown: false}} />




                <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />

            </Stack.Navigator>

        </Box>
    )
}
