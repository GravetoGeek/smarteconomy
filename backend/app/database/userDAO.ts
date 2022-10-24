import User from "../models/User"
import connection from "./connection"

export const user_create = async (user:User)=>{
    const result = await connection('users').insert(user)
    return result
}

export const user_read = async (id:number) => {
    const result = await connection('users').where({id})
    return result
}


export const user_list = async () =>{
    const result = await connection('users').select()
    return result
}

export const user_update = async (id:number,user:User)=>{
    const result = await connection('users').where({id}).update(user)
    return result
}

export const user_delete = async(id:number)=>{
    const result = await connection('users').where({id}).del()
    return result
}
