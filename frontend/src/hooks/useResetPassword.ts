import {gql,useMutation} from '@apollo/client'
import {useState} from 'react'

const RESET_PASSWORD=gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(input: { token: $token, newPassword: $newPassword }) {
      success
      message
    }
  }
`

export function useResetPassword() {
    const [resetPasswordMutation,{loading}]=useMutation(RESET_PASSWORD)
    const [error,setError]=useState<string|null>(null)

    async function resetPassword(token: string,newPassword: string) {
        setError(null)
        const {data,errors}=await resetPasswordMutation({variables: {token,newPassword}})
        if(errors&&errors.length>0) {
            throw new Error(errors[0].message)
        }
        if(!data?.resetPassword?.success) {
            throw new Error(data?.resetPassword?.message||'Erro desconhecido')
        }
        return data.resetPassword
    }

    return {resetPassword,loading,error}
}
