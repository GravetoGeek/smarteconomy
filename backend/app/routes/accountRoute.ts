import { Router } from 'express'
import {
    account_byProfile,
    account_create,
    account_delete,
    account_list,
    account_read,
    account_update
} from '../controllers/accountController'
import { verifyJWT } from '../controllers/authController'

const accountRoute = Router()
accountRoute.post('/', verifyJWT, account_create)
accountRoute.get('/:id', verifyJWT, account_read)
accountRoute.put('/:id', verifyJWT, account_update)
accountRoute.delete('/:id', verifyJWT, account_delete)
accountRoute.get('/', verifyJWT, account_list)
accountRoute.get('/byProfile/:id', verifyJWT, account_byProfile)

export default accountRoute
