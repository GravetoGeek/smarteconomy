import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {transaction_create,
    transaction_read,
    transaction_update,
    transaction_delete,
    transaction_list,
    transaction_filter} from '../controllers/transactionController'

const transactionRoute = Router()
transactionRoute.post('/', verifyJWT, transaction_create)
transactionRoute.get('/:id', verifyJWT, transaction_read)
transactionRoute.put('/:id', verifyJWT, transaction_update)
transactionRoute.delete('/:id', verifyJWT, transaction_delete)
transactionRoute.get('/', verifyJWT, transaction_list)
transactionRoute.post('/filter', verifyJWT, transaction_filter)

export default transactionRoute
