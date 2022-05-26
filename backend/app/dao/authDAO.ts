
const loginDAO = async (email:string) => {
  const result = await connection('users').where({email})
  if(result.length > 0){
    return result[0]
  }
  return {
    error: 'Não encontrado: 404'
  }
}


module.exports = {
  loginDAO,
}