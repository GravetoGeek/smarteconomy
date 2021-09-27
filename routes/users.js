const express = require('express')
const router = express.Router()

const userController = require('../controllers/users')

router.get('/',(req, res, next)=>{
  res.send('Rota users')
})

router.get('/create',userController.user_create)

router.get('/read',userController.user_read)

router.get('/update',userController.user_update)

router.get('/delete',userController.user_delete)

router.get('/list',userController.user_list)


module.exports = router