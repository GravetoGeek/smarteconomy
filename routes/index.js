const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const usersRouter = require('./user')

router.use('/user', usersRouter)
router.use('/auth', authRouter)


router.get('/', (req, res, next)=>{
  res.send('Rota index')
})

module.exports = router