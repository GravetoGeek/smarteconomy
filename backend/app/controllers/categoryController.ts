import Category from "../models/Category";
import {Request, Response} from 'express';
import * as categoryDAO from "../database/categoryDAO";

export const category_create = async (req:Request, res:Response) => {
    try{
        let {category, description} = req.body;
        let Category:Category = {category, description}
        let result = await categoryDAO.category_create(category)
        console.log(result);
        return res.status(200).json(result)
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const category_read = async(req:Request, res:Response) => {
  try{
    let {id} = req.params;
    let result = await categoryDAO.category_read(Number(id));
    if(result.length === 0) throw {statusCode:404,message: 'Categoria não encontrada'}
    return res.status(200).json(result)
  }
  catch(error:any){
    console.log(error);
    return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
  }
}

export const category_update = async(req:Request, res:Response) => {
  try{
    let {id} = req.params;
    let category:Category = req.body;
    let result = await categoryDAO.category_update(Number(id), category);
    if(result.length === 0) throw {statusCode:404,message: 'Categoria não encontrada'}
    return res.status(200).json(result)
  }
  catch(error:any){
    console.log(error);
    return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
  }
}

export const category_delete = async(req:Request, res:Response) => {
  try{
    let {id} = req.params;
    let result = await categoryDAO.category_delete(Number(id));
    if(result.length === 0) throw {statusCode:404,message: 'Categoria não encontrada'}
    return res.status(200).json(result)
  }
  catch(error:any){
    console.log(error);
    return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
  }
}

export const category_list = async(req:Request, res:Response) => {
  try{
    let result = await categoryDAO.category_list();
    return res.status(200).json(result)
  }
  catch(error:any){
    console.log(error);
    return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
  }
}
