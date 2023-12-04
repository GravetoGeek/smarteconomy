import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import React from 'react';
import Routes from './src/routes';


export default function App() {
  return (

    <NativeBaseProvider>
      <NavigationContainer>
        {/* <StatusBar barStyle="light-content" backgroundColor="#bc14ff" /> */}
        <Routes />
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
