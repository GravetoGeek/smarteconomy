import {Box,Button,Input,Text,VStack} from 'native-base'
import React,{useState} from 'react'
import {useResetPassword} from '../../hooks/useResetPassword'

const ResetPasswordScreen: React.FC=() => {
    const [token,setToken]=useState('')
    const [password,setPassword]=useState('')
    const [confirm,setConfirm]=useState('')
    const [success,setSuccess]=useState(false)
    const [error,setError]=useState('')
    const {resetPassword,loading}=useResetPassword()

    const handleSubmit=async () => {
        setError('')
        setSuccess(false)
        if(!token||!password||!confirm) {
            setError('Preencha todos os campos.')
            return
        }
        if(password!==confirm) {
            setError('As senhas não coincidem.')
            return
        }
        try {
            await resetPassword(token,password)
            setSuccess(true)
        } catch(err: any) {
            setError(err.message||'Erro ao redefinir senha.')
        }
    }

    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4} bg="white">
            <VStack space={4} w="100%" maxW="300px">
                <Text fontSize="xl" fontWeight="bold">Redefinir senha</Text>
                <Input
                    placeholder="Token recebido por e-mail"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                />
                <Input
                    placeholder="Nova senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Input
                    placeholder="Confirme a nova senha"
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry
                />
                <Button isLoading={loading} onPress={handleSubmit} isDisabled={!token||!password||!confirm}>
                    Redefinir senha
                </Button>
                {success&&<Text color="green.600">Senha redefinida com sucesso!</Text>}
                {error&&<Text color="red.600">{error}</Text>}
            </VStack>
        </Box>
    )
}

export default ResetPasswordScreen
