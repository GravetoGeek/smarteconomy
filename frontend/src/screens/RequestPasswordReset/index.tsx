import {useNavigation} from '@react-navigation/native'
import {Box,Button,Input,Text,VStack} from 'native-base'
import React,{useState} from 'react'
import {useRequestPasswordReset} from '../../hooks/useRequestPasswordReset'

const RequestPasswordResetScreen: React.FC=() => {
    const [email,setEmail]=useState('')
    const [success,setSuccess]=useState(false)
    const [error,setError]=useState('')
    const {requestPasswordReset,loading}=useRequestPasswordReset()
    const navigation=useNavigation()

    const handleSubmit=async () => {
        setError('')
        setSuccess(false)
        try {
            await requestPasswordReset(email)
            setSuccess(true)
        } catch(err: any) {
            setError(err.message||'Erro ao solicitar recuperação.')
        }
    }

    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4} bg="white">
            <VStack space={4} w="100%" maxW="300px">
                <Text fontSize="xl" fontWeight="bold">Recuperar senha</Text>
                <Input
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Button isLoading={loading} onPress={handleSubmit} isDisabled={!email}>
                    Solicitar recuperação
                </Button>
                {success&&<>
                    <Text color="green.600">E-mail enviado! Verifique sua caixa de entrada.</Text>
                    <Button mt={2} colorScheme="purple" onPress={() => navigation.navigate('ResetPassword')}>
                        Já tenho o token
                    </Button>
                </>}
                {error&&<Text color="red.600">{error}</Text>}
            </VStack>
        </Box>
    )
}

export default RequestPasswordResetScreen
