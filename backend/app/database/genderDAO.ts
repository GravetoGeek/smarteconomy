import Gender from "../models/Gender";
import connection from "./connection";

export const gender_create = async (gender:Gender)=>{
    const result = await connection('genders').insert(gender)
    return result
}

export const gender_read = async (id:number) => {
    const result = await connection('genders').where({id})
    return result
}

export const gender_list = async () =>{
    const result = await connection('genders').select()
    return result
}

export const gender_update = async (id:number,gender:Gender)=>{
    const result = await connection('genders').where({id}).update(gender)
    return result
}

export const gender_delete = async(id:number)=>{
    const result = await connection('genders').where({id}).del()
    return result
}