import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { NativeBaseProvider } from "native-base";
import { configureStore } from '@reduxjs/toolkit';


export default function App() {
  
  return (
    <NativeBaseProvider>
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#bc14ff" />
      <Routes/>
    </NavigationContainer>
    </NativeBaseProvider>
  );
}
