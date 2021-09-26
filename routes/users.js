const express = require('express')
const router = express.Router()

router.get('/',(req, res, next)=>{
  res.send('Rota users')
})

module.exports = router