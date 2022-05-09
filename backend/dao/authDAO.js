const {connection} = require('./connection')


const login = async (email) => {
  const result = await connection('user').where({email})
  if(result){
    return result[0]
  }
  return {
    error: 'Não encontrado: 404'
  }
}


module.exports = {
  login,
}