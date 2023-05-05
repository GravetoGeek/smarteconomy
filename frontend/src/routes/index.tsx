import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box } from 'native-base';
import React from 'react';
import FloatingBottomMenu from '../components/FloatingBottomMenu';
import AddAccount from '../screens/addAccount';
import AddTransaction from '../screens/addTransaction';
import Dashboard from '../screens/dashboard';
import Home from '../screens/home';
import Login from '../screens/login';
import ManageProfile from '../screens/manageProfile';
import Register from '../screens/register';

const Stack = createNativeStackNavigator();



export default function Routes() {
    return (
        <Box flex={1} bg="white">
            <Stack.Navigator>


                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
                <Stack.Screen name="AddAccount" component={AddAccount} options={{ headerShown: false }} />

                <Stack.Screen name="ManageProfile" component={ManageProfile} options={{ headerShown: false }} />

                <Stack.Screen name="AddTransaction" component={AddTransaction} options={{ headerShown: false }} />


                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

            </Stack.Navigator>

        </Box>
    )
}