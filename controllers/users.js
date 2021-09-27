const user_create = (req, res)=>{
  res.send('Rota user_create')
}

const user_read = (req, res)=>{
  res.send('Rota user_read')
}

const user_update = (req, res)=>{
  res.send('Rota user_update')
}

const user_delete = (req, res)=>{
  res.send('Rota user_delete')
}

const user_list = (req, res)=>{
  res.send('Rota user_list')
}

module.exports = {
  user_create,
  user_read,
  user_update,
  user_delete,
  user_list
}