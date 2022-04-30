const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

const userController = require('../controllers/userController')

// router.get('/',(req, res, next)=>{
//   res.send('Rota user')
// })

router.post('/',authController.verifyJWT, userController.user_create)

router.get('/:id',authController.verifyJWT,userController.user_read)

router.put('/:id',authController.verifyJWT,userController.user_update)

router.delete('/:id',authController.verifyJWT,userController.user_delete)

router.get('/',authController.verifyJWT,userController.user_list)


module.exports = router