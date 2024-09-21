import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {
    profile_byUser,
    profile_create,
    profile_delete,
    profile_list,
    profile_read,
    profile_update
} from '../controllers/profileController'

const profileRoute = Router()
profileRoute.post('/', verifyJWT, profile_create)
profileRoute.get('/:id', verifyJWT, profile_read)
profileRoute.put('/:id', verifyJWT, profile_update)
profileRoute.delete('/:id', verifyJWT, profile_delete)
profileRoute.get('/', verifyJWT, profile_list)
profileRoute.get('/byUser/:id', verifyJWT, profile_byUser)

export default profileRoute
