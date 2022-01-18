const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.get('/',(req, res, next)=>{
  res.send('Rota user')
})

router.post('/create', userController.user_create)

router.get('/read',userController.user_read)

router.put('/update',userController.user_update)

router.delete('/delete',userController.user_delete)

router.get('/list',userController.user_list)


module.exports = router