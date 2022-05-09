const { connection } = require('../dao/connection')
const userDAO = require('../dao/userDAO')
const bcrypt = require('bcryptjs')


const user_create = async(req, res)=>{
  let {username, email,password,phone} = req.body.user
  password = bcrypt.hashSync(password,10)

  let result = await userDAO.user_create({username,email,password,phone})
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    return res.status(200).json({
      message:'Usuário criado com sucesso',
      user:result[0]
    })
  }
  return res.status(500).json({
    message:'Erro ao criar usuário',
    user:null
  })
}

const user_read = async(req, res)=>{
  let {id} = req.params

  let result = await userDAO.user_read(id)
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    return res.status(200).json(result[0])
  }
  return res.status(500).json({
    message:'Erro ao buscar usuário',
    user:null
  })
}


const user_update = async(req, res)=>{
  let {id} = req.params
  let {user} = req.body
  user?.password ? user['password'] = bcrypt.hashSync(password,10) : null

  let result = await userDAO.user_update(id,user)
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    return res.status(200).json(result)
  }
  return res.status(500).json({
    message:'Erro ao atualizar usuário',
    user:null
  })
}

const user_delete = async(req, res)=>{
  let {id} = req.params

  let result = await userDAO.user_delete(id)
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    return res.status(200).json(result)
  }
  return res.status(500).json({
    message:'Erro ao deletar usuário',
    user:null
  })
}

const user_list = async(req, res, next)=>{
  let result = await userDAO.user_list()
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    return res.status(200).json(result)
  }
  return res.status(500).json({
    message:'Erro ao listar usuários',
    user:null
  })  
}

module.exports = {
  user_create,
  user_read,
  user_update,
  user_delete,
  user_list
}