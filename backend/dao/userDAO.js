const {connection} = require('./connection')

const user_create = async (user)=>{
  const result = await connection('user').insert(user)
  if(result){
    return {
      ...user,
      id:result[0]
    }
  }
  return {
    error: `Ocorreu um erro ao inserir ${user}`
  }
}

const user_read = async (id) => {
  const result = await connection('user').where({id})
  if(result){
    return result[0]
  }
  return {
    error: 'Não encontrado: 404'
  }
}

const user_list = async () =>{
  const result = await connection('user')
  return result
}

const user_update = async (id,user)=>{
  const result = await connection('user').where({id}).update(user)
  if(result){
    return result
  }
  return {
    error: 'Erro ao atualizar usuário'
  }
}

const user_delete = async(id)=>{
  const result = await connection('user').where({id}).del()
  .then((res)=>res)
  .catch((error)=>error)
  return result[0]
}

module.exports = {
  user_create,
  user_read,
  user_list,
  user_update,
  user_delete
}