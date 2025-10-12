import {useMutation} from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useState} from 'react'
import {SIGNUP_MUTATION} from '../../graphql/mutations/auth.mutations'

interface SignupInput {
    email: string
    password: string
    name: string
    lastname: string
    birthdate: string
    genderId: string
    professionId: string
}

interface AuthUser {
    id: string
    email: string
    role: string
}

interface SignupResponse {
    signup: {
        accessToken: string
        refreshToken: string
        expiresIn: number
        tokenType: string
        user: AuthUser
    }
}

/**
 * 🆕 useSignup Hook
 * 
 * Custom hook para registro de novo usuário usando GraphQL
 * 
 * @example
 * ```tsx
 * const RegisterScreen = () => {
 *   const { signup, loading, error, user } = useSignup();
 * 
 *   const handleSignup = async () => {
 *     const result = await signup({
 *       email: 'newuser@example.com',
 *       password: 'SecurePass123',
 *       name: 'John',
 *       lastname: 'Doe',
 *       birthdate: '1990-01-01',
 *       genderId: 'uuid-gender',
 *       professionId: 'uuid-profession'
 *     });
 *     
 *     if (result) {
 *       navigation.navigate('Home');
 *     }
 *   };
 * 
 *   return (
 *     <Button onPress={handleSignup} isLoading={loading}>
 *       Cadastrar
 *     </Button>
 *   );
 * };
 * ```
 */
export const useSignup=() => {
    const [user,setUser]=useState<AuthUser|null>(null)

    const [signupMutation,{loading,error}]=useMutation<SignupResponse>(SIGNUP_MUTATION,{
        onError: (err) => {
            console.error('[useSignup] GraphQL error:',err.message)
        }
    })

    const signup=async (input: SignupInput): Promise<AuthUser|null> => {
        try {
            const {data}=await signupMutation({
                variables: {input}
            })

            if(data?.signup) {
                const {accessToken,refreshToken,user}=data.signup

                // Salvar tokens no AsyncStorage
                await AsyncStorage.setItem('token',accessToken)
                await AsyncStorage.setItem('refreshToken',refreshToken)
                await AsyncStorage.setItem('user',JSON.stringify(user))

                setUser(user)

                console.log('[useSignup] Signup successful:',user.email)
                return user
            }

            return null
        } catch(err) {
            console.error('[useSignup] Signup failed:',err)
            return null
        }
    }

    return {
        signup,
        loading,
        error,
        user,
        isAuthenticated: !!user
    }
}
