const {connection} = require('./connection')


const login = async (email) => {
  const result = await connection('users').where({email})
  console.log("deubosta",result[0])
  if(result.length > 0){
    return result[0]
  }
  return {
    error: 'Não encontrado: 404'
  }
}


module.exports = {
  login,
}