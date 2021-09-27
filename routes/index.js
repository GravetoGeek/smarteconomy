const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const usersRouter = require('./users')

router.use('/', authRouter)
router.use('/users', usersRouter)

router.get('/', (req, res, next)=>{
  res.send('Rota index')
})

module.exports = router