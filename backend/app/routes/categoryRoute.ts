import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {
    category_create,
    category_delete,
    category_filter,
    category_list,
    category_read,
    category_update
} from '../controllers/categoryController'

const categoryRoute = Router()
categoryRoute.post('/', verifyJWT, category_create)
categoryRoute.get('/:id', verifyJWT, category_read)
categoryRoute.put('/:id', verifyJWT, category_update)
categoryRoute.delete('/:id', verifyJWT, category_delete)
categoryRoute.get('/', verifyJWT, category_list)
categoryRoute.post('/filter', verifyJWT, category_filter)

export default categoryRoute
