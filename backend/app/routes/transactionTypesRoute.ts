import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {
    transactionTypes_create,
    transactionTypes_delete,
    transactionTypes_list,
    transactionTypes_read,
    transactionTypes_update
} from '../controllers/transactionTypesController'

const transactionTypesRoute = Router()
transactionTypesRoute.post('/', verifyJWT, transactionTypes_create)
transactionTypesRoute.get('/:id', verifyJWT, transactionTypes_read)
transactionTypesRoute.put('/:id', verifyJWT, transactionTypes_update)
transactionTypesRoute.delete('/:id', verifyJWT, transactionTypes_delete)
transactionTypesRoute.get('/', verifyJWT, transactionTypes_list)

export default transactionTypesRoute
