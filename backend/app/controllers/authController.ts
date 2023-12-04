import 'dotenv/config'
import User from '../models/User';
import {Request, Response} from 'express';
import {loginDAO} from '../database/authDAO';
import * as userDAO from '../database/userDAO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as profileDAO from '../database/profileDAO';
import Profile from '../models/Profile';
import HttpError from '../models/HttpError';



export const login = async (req:Request, res:Response) => {
    try{
        let secret:string = process.env.JWT_SECRET || 'jabulani';
        if(!req?.body?.email || !req?.body?.password) throw {statusCode:400,message: 'Email e/ou senha não informados',auth:false}
        const user:User = req.body;
        const result:User[] = await loginDAO(user.email);
        if(result.length === 0) throw {statusCode:404,message: 'Usuário não encontrado',auth:false}
        console.log(result);
        if(bcrypt.compareSync(user.password, result[0].password)){

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                access_token: jwt.sign({id:result[0].id, email: result[0].email}, secret, {expiresIn: '5m'}),
                refresh_token: jwt.sign({id:result[0].id, email: result[0].email}, secret, {expiresIn: '10m'}),
                auth:true
            });
        }
        throw {statusCode:401,message: 'Email e/ou senha inválidos',auth:false}
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error || 'Erro no servidor'});
    }
}

export const logout = async (req:Request, res:Response) => {
    const user:User = req.body;
    return res.status(200).json({
        message: 'Logout realizado com sucesso',
        token:""
    });
}

export const signup = async (req:Request, res:Response) => {
    try{
        let secret:string = process.env.JWT_SECRET || 'jabulani';
        if(!req?.body?.email || !req?.body?.password) throw {statusCode:400,message: 'Email e/ou senha não informados',auth:false}
        const user:User = req.body;
        user.password = bcrypt.hashSync(user.password,10)

        let result = await userDAO.user_create(user)
        console.log(result);
        if(result.affectedRows === 0) throw {statusCode:400,message: 'Usuário já existe',auth:false}
        const profile:Profile = {
          user_id: result[0]
        }
        let result2 = await profileDAO.profileDAO_create(profile)
        
        return res.status(200).json({
            message: 'Usuário criado com sucesso',
            access_token: jwt.sign({id: result.insertId,email: user.email}, secret, {expiresIn: '5m'}),
            refresh_token: jwt.sign({id: result.insertId,email: user.email}, secret, {expiresIn: '10m'}),
            auth:true
        });
    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error || 'Erro no servidor'});
    }
}


export const verifyJWT = async (req:Request, res:Response, next:any)=>{
  try {
    return next()
    let secret:string = process.env.JWT_SECRET || 'jabulani';
    const accessToken:any = req.headers['x-access-token']

    if(!accessToken){
      return res.status(401).send({
        auth:false,
        message:'x-access-token não informado',
        'x-access-token':null,
        'x-refresh-token':null
      })
    }


      jwt.verify(accessToken,secret,function(err:any,decoded:any){
        console.log('decoded',decoded);
        if(err){
          if(err.name == 'TokenExpiredError'){
              return res.status(401).send({
                auth:false,
                message:'Token expirado',
                'x-access-token':null
              })            
          }
          return res.status(500).json({
            auth:false,
            message:'Falha ao autenticar token',
            'x-access-token':null
          })
        }
        next()
      })



  } catch (error:any) {
    res.json(
      {
        auth:false,
        message:'Falha ao autenticar token',
        'x-access-token':null,
        'x-refresh-token':null,
        error: JSON.stringify(error)
      }
    )
  }
    
}