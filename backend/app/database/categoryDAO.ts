import Category from "../models/Category";
import connection from "./connection";

export const category_create = async (category:Category)=>{
    const result = await connection('categories').insert(category)
    return result
}

export const category_read = async (id:number) => {
    const result = await connection('categories').where({id})
    return result
}

export const category_list = async () =>{
    const result = await connection('categories').select()
    return result
}

export const category_update = async (id:number,category:Category)=>{
    const result = await connection('categories').where({id}).update(category)
    return result
}

export const category_delete = async(id:number)=>{
    const result = await connection('categories').where({id}).del()
    return result
}
