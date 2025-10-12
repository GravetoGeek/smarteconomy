import {useMutation} from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useState} from 'react'
import {LOGIN_MUTATION} from '../../graphql/mutations/auth.mutations'

interface LoginInput {
    email: string
    password: string
}

interface AuthUser {
    id: string
    email: string
    role: string
}

interface LoginResponse {
    login: {
        accessToken: string
        refreshToken: string
        expiresIn: number
        tokenType: string
        user: AuthUser
    }
}

/**
 * 🔐 useLogin Hook
 * 
 * Custom hook para autenticação de usuário usando GraphQL
 * 
 * @example
 * ```tsx
 * const LoginScreen = () => {
 *   const { login, loading, error, user } = useLogin();
 * 
 *   const handleLogin = async () => {
 *     const result = await login({
 *       email: 'user@example.com',
 *       password: 'password123'
 *     });
 *     
 *     if (result) {
 *       navigation.navigate('Home');
 *     }
 *   };
 * 
 *   return (
 *     <Button onPress={handleLogin} isLoading={loading}>
 *       Login
 *     </Button>
 *   );
 * };
 * ```
 */
export const useLogin=() => {
    const [user,setUser]=useState<AuthUser|null>(null)

    const [loginMutation,{loading,error}]=useMutation<LoginResponse>(LOGIN_MUTATION,{
        onError: (err) => {
            console.error('[useLogin] GraphQL error:',err.message)
        }
    })

    const login=async (input: LoginInput): Promise<AuthUser|null> => {
        try {
            const {data}=await loginMutation({
                variables: {input}
            })

            if(data?.login) {
                const {accessToken,refreshToken,user}=data.login

                // Salvar tokens no AsyncStorage
                await AsyncStorage.setItem('token',accessToken)
                await AsyncStorage.setItem('refreshToken',refreshToken)
                await AsyncStorage.setItem('user',JSON.stringify(user))

                setUser(user)

                console.log('[useLogin] Login successful:',user.email)
                return user
            }

            return null
        } catch(err) {
            console.error('[useLogin] Login failed:',err)
            return null
        }
    }

    const logout=async () => {
        try {
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('refreshToken')
            await AsyncStorage.removeItem('user')
            setUser(null)
            console.log('[useLogin] Logout successful')
        } catch(err) {
            console.error('[useLogin] Logout failed:',err)
        }
    }

    return {
        login,
        logout,
        loading,
        error,
        user,
        isAuthenticated: !!user
    }
}
