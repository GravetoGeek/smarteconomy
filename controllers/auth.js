const login = (req, res)=>{
  res.send('Rota login')
}

const logout = (req, res)=>{
  res.send('Rota logout')
}

const signup = (req, res)=>{
  res.send('Rota signup')
}

module.exports = {
  login,
  logout,
  signup
}