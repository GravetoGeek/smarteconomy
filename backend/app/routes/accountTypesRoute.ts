import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {accountTypes_create,
    accountTypes_read,
    accountTypes_update,
    accountTypes_delete,
    accountTypes_list} from '../controllers/accountTypesController'

const accountTypesRoute = Router()
accountTypesRoute.post('/', verifyJWT, accountTypes_create)
accountTypesRoute.get('/:id', verifyJWT, accountTypes_read)
accountTypesRoute.put('/:id', verifyJWT, accountTypes_update)
accountTypesRoute.delete('/:id', verifyJWT, accountTypes_delete)
accountTypesRoute.get('/', verifyJWT, accountTypes_list)

export default accountTypesRoute
