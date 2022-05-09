const { connection } = require('../dao/connection')
const authDAO = require('../dao/authDAO')
const userDAO = require('../dao/userDAO')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (req, res)=>{
  let {email, password} = req.body
  let result = await authDAO.login(email)

    if(result == undefined){
      return res.status(404).send({
        message:'Usuário não encontrado',
        auth:false,
        token:null
      })
    }
 
    if(bcrypt.compareSync(password,result.password)){
      //return res.status(200).send(result)
      const token = jwt.sign({id:result.id},process.env.SECRET_KEY,{
        expiresIn: 3000
      })
      return res.status(200).json({
        message:'Login realizado com sucesso',
        auth:true,
        token
      })

    }

    return res.status(401).json({
      message:'Senha incorreta',
      auth:false,
      token:null
    })
}

const logout = async (req, res)=>{
  res.json({auth:false,token:null})
}

const signup = async (req, res)=>{
  console.log(req.body)
  let {username, email,password,phone} = req.body.user
  
  password = bcrypt.hashSync(password,10)

  let result = await userDAO.user_create({username,email,password,phone})
  .then((res)=>res)
  .catch((error)=>error)
  if(result.code == "ER_DUP_ENTRY"){
    return res.status(409).send({
      message:'Usuário já existe',
      auth:false,
      token:null
    })
  }
  
  let login = await authDAO.login(email)
  console.log(login)
  const token = jwt.sign({id:login.id},process.env.SECRET_KEY,{
    expiresIn: 3000
  })

  return res.status(200).json({
    message:'Usuário criado com sucesso',
    auth:true,
    token
  })

}

const verifyJWT = async (req, res, next)=>{
  const token = req.headers['x-access-token']
  console.log('token',token)
  if(!token){
    return res.status(401).send({
      auth:false,
      message:'Token não encontrado',
      token:null
    })
  }
  const result = await jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
    if(err){
      console.log(JSON.stringify(err))
      if(err.name == 'TokenExpiredError'){
        return res.status(401).send({
          auth:false,
          message:'Token expirado',
          token:null
        })
      }

      return res.status(500).json({
        auth:false,
        message:'Falha ao autenticar token',
        token:null
      })
    }
    req.user_id = decoded.id
    next()
  })
  }



module.exports = {
  login,
  logout,
  signup,
  verifyJWT
}