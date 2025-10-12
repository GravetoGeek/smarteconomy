import {NavigationContainer} from '@react-navigation/native'
import {NativeBaseProvider} from "native-base"
import React from 'react'
import {ApolloProvider} from './src/contexts/ApolloProvider'
import StoreProvider from './src/contexts/StoreProvider'
import Routes from './src/routes'

export default function App() {
    return (
        <ApolloProvider>
            <NativeBaseProvider>
                <NavigationContainer>
                    <StoreProvider>
                        {/* <StatusBar barStyle="light-content" backgroundColor="#bc14ff" /> */}
                        <Routes />

                    </StoreProvider>
                </NavigationContainer>

            </NativeBaseProvider>
        </ApolloProvider>
    )
}
