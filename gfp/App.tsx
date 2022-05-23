import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { NativeBaseProvider } from "native-base";
const initialState = {
  isLoading: true,
  user: null,
  authenticated: false,
  token:""
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        authenticated: true,
        token: action.token
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        authenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        authenticated: false,
      };
    default:
      return state;
  }
}

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
