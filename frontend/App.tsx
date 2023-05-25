import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import React from 'react';
import StoreProvider from './src/contexts/StoreProvider';
import Routes from './src/routes';

export default function App() {
  return (

    <NativeBaseProvider>
      <NavigationContainer>
        <StoreProvider>
          {/* <StatusBar barStyle="light-content" backgroundColor="#bc14ff" /> */}
          <Routes />

        </StoreProvider>
      </NavigationContainer>

    </NativeBaseProvider>

  )
}
