import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddTransaction from '../screens/addTransaction';
import Dashboard from '../screens/dashboard';
import Login from '../screens/login';
import Register from '../screens/register';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AddTransaction" component={AddTransaction} options={{ headerShown: true }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Home" component={Home} options={{headerShown:true}} /> */}
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />

            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />



        </Stack.Navigator>
    )
}