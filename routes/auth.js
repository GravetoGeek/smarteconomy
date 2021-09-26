const express = require('express')
const router = express.Router()

router.get('/',(req, res, next)=>{
  res.send('Rota auth')
})

module.exports = router