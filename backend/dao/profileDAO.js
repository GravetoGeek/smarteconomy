const {connection} = require('./connection')

const profile_create = async (profile)=>{
  const result = await connection('profiles').insert(profile)
  if(result){
    return {
      ...profile,
      id:result[0]
    }
  }
  return {
    error: `Ocorreu um erro ao inserir ${profile}`
  }
}

const profile_read = async (id) => {
  const result = await connection('profiles').where({id})
  if(result){
    return result
  }
  return {
    error: 'Não encontrado: 404'
  }
}

const profile_list = async () =>{
  const result = await connection('profiles').select('*')
  if(result){
    return result
  }
  return {
    error: 'Não encontrado: 404'
  }
}

const profile_update = async (id,profile)=>{
  const result = await connection('profiles').where({id}).update(profile)
  .then((res)=>res)
  .catch((error)=>error)
  return result
}

const profile_delete = async(id)=>{
  const result = await connection('profiles').where({id}).del()
  .then((res)=>res)
  .catch((error)=>error)
  return result
}

module.exports = {
  profile_create,
  profile_read,
  profile_list,
  profile_update,
  profile_delete,
}