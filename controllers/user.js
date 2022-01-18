const user_create = async(req, res)=>{
  let {username, email,password} = req.body
  password = new Buffer.from(password).toString('base64')

  await res.json(
    {
      username,
      email,
      password
    }
  )
  
  // res.send('Rota user_create')
}

const user_read = async(req, res)=>{
  res.send('Rota user_read')
}

const user_update = async(req, res)=>{
  res.send('Rota user_update')
}

const user_delete = async(req, res)=>{
  res.send('Rota user_delete')
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