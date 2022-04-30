const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')

router.get('/',(req, res, next)=>{
  res.send('Rota auth')
})

router.post('/login',authController.login)

router.get('/logout',authController.logout)

router.post('/signup',authController.signup)

module.exports = router