const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get('/',(req, res, next)=>{
  res.send('Rota user')
})

router.post('/', userController.user_create)

router.get('/:id',userController.user_read)

router.put('/:id',userController.user_update)

router.delete('/:id',userController.user_delete)

router.get('/',userController.user_list)


module.exports = router