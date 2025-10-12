import {useMutation} from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {LOGOUT_MUTATION} from '../../graphql/mutations/auth.mutations'

interface LogoutInput {
    accessToken: string
}

interface LogoutResponse {
    logout: {
        success: boolean
        message: string
    }
}

/**
 * 🚪 useLogout Hook
 *
 * Custom hook para logout de usuário usando GraphQL
 *
 * @example
 * ```tsx
 * const ProfileScreen = () => {
 *   const { logout, loading, error } = useLogout();
 *
 *   const handleLogout = async () => {
 *     const success = await logout();
 *
 *     if (success) {
 *       navigation.navigate('Login');
 *     }
 *   };
 *
 *   return (
 *     <Button onPress={handleLogout} isLoading={loading}>
 *       Sair
 *     </Button>
 *   );
 * };
 * ```
 */
export const useLogout=() => {
    const [logoutMutation,{loading,error}]=useMutation<LogoutResponse>(LOGOUT_MUTATION,{
        onError: (err) => {
            console.error('[useLogout] GraphQL error:',err.message)
        }
    })

    const logout=async (): Promise<boolean> => {
        try {
            // Obter token do AsyncStorage
            const token=await AsyncStorage.getItem('token')

            if(!token) {
                console.warn('[useLogout] No token found, clearing storage anyway')
                await clearStorage()
                return true
            }

            // Fazer logout no backend
            const {data}=await logoutMutation({
                variables: {
                    input: {accessToken: token}
                }
            })

            if(data?.logout.success) {
                await clearStorage()
                console.log('[useLogout] Logout successful:',data.logout.message)
                return true
            }

            // Se falhar no backend, limpa storage mesmo assim
            await clearStorage()
            return false
        } catch(err) {
            console.error('[useLogout] Logout failed:',err)
            // Em caso de erro, limpa storage para evitar estado inconsistente
            await clearStorage()
            return false
        }
    }

    const clearStorage=async () => {
        try {
            await AsyncStorage.multiRemove(['token','refreshToken','user'])
            console.log('[useLogout] Storage cleared')
        } catch(err) {
            console.error('[useLogout] Failed to clear storage:',err)
        }
    }

    return {
        logout,
        loading,
        error
    }
}
