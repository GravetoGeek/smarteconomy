import {gql,useMutation} from '@apollo/client'
import {useState} from 'react'

const REQUEST_PASSWORD_RESET=gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      success
      message
    }
  }
`

export function useRequestPasswordReset() {
    const [requestPasswordResetMutation,{loading}]=useMutation(REQUEST_PASSWORD_RESET)
    const [error,setError]=useState<string|null>(null)

    async function requestPasswordReset(email: string) {
        setError(null)
        const {data,errors}=await requestPasswordResetMutation({variables: {email}})
        if(errors&&errors.length>0) {
            throw new Error(errors[0].message)
        }
        if(!data?.requestPasswordReset?.success) {
            throw new Error(data?.requestPasswordReset?.message||'Erro desconhecido')
        }
        return data.requestPasswordReset
    }

    return {requestPasswordReset,loading,error}
}
