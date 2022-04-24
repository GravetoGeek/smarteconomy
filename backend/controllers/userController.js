const { connection } = require('../dao/connection')
const userDAO = require('../dao/userDAO')
const {userModel} = require('../models/userModel')
const bcrypt = require('bcryptjs')
const sqlError = {
  1062:{
    message:`Usuário já está cadastrado.`,
    statusCode:400,
  },
  1054:{
    message:`Parâmetro inválido`,
    statusCode:400,
  }
}
const user_create = async(req, res)=>{
  let {username, email,password,phone} = req.body.user
  // password = new Buffer.from(password).toString('base64')
  password = bcrypt.hashSync(password,10)
  let user =  new userModel(
    username,
    email,
    password,
    phone
  )

  let result = await userDAO.user_create(
    user.get()
  ).then((res)=>res)
  .catch((error)=>{

    res.status(sqlError[error.errno].statusCode).send({
      errno:error.errno,
    message:sqlError[error.errno].message
    })

  })
  
  return res.send(result)
  
  
  // res.send('Rota user_create')
}

const user_read = async(req, res)=>{
  let {id} = req.params
  let result = await userDAO.user_read(id).then((res)=>{
    if(typeof res == 'undefined'){
      return res.status(404).send({
        message:'Usuário não encontrado'
      })
    }
    
  }).catch((error)=>res.send('teste'))
  
  return res.send(result)
  //res.send('Rota user_read')
}

const user_update = async(req, res)=>{
  let{user} = req.body
  let {id} = req.params

  user.password? user['password'] = bcrypt.hashSync(user.password,10) : null
  let result = await userDAO.user_update(id,user)
  .then((res)=>res)
  .catch((error)=>{
    res.status(sqlError[error.errno].statusCode).send({
      errno:error.errno,
    message:sqlError[error.errno].message
    })
  })
  if(result){
    res.send(result[0])
  }
  
  
}

const user_delete = async(req, res)=>{
  let {id} = req.params

  let result = await userDAO.user_delete(id)
  .then((res)=>res)
  .catch((error)=>error)
  if(result){
    console.log('teste',result)
    res.send(result[0])
  }

}

const user_list = async(req, res)=>{
  res.send('Rota user_list')
}

module.exports = {
  user_create,
  user_read,
  user_update,
  user_delete,
  user_list
}