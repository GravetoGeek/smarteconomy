import Profile from "../models/Profile"
import connection from "./connection"

export const profile_create = async (profile:Profile)=>{
    const result = await connection('profiles').insert(profile)
    return result
}

export const profile_read = async (id:number) => {
    const result = await connection('profiles').where({id})
    return result
}


export const profile_list = async () =>{
    const result = await connection('profiles').select()
    return result
}

export const profile_update = async (id:number,profile:Profile)=>{
    const result = await connection('profiles').where({id}).update(profile)
    return result
}

export const profile_delete = async(id:number)=>{
    const result = await connection('profiles').where({id}).delete()
    return result
}
