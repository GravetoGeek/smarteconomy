import {useContext} from 'react'
import {Store} from '../contexts/StoreProvider'

/**
 * Hook customizado para acessar o StoreContext com type-safety
 *
 * @throws Error se usado fora do StoreProvider
 * @returns StoreContextType - Contexto completo da aplicação
 *
 * @example
 * ```tsx
 * const { user, setUser, profile, startDate, endDate } = useStore();
 * ```
 */
export const useStore=() => {
    const context=useContext(Store)

    if(context===undefined) {
        throw new Error('useStore must be used within a StoreProvider')
    }

    return context
}
