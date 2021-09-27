const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.js')

router.get('/',(req, res, next)=>{
  res.send('Rota auth')
})

router.get('/login',authController.login)

router.get('/logout',authController.logout)

router.get('/signup',authController.signup)

module.exports = router