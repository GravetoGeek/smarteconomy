import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {
    profession_byCbo,
    profession_byTitle,
    profession_byType,
    profession_create,
    profession_delete,
    profession_list,
    profession_read,
    profession_search,
    profession_update
} from '../controllers/professionController'

const professionRoute = Router()
professionRoute.post('/', verifyJWT, profession_create)
professionRoute.get('/:id', verifyJWT, profession_read)
professionRoute.put('/:id', verifyJWT, profession_update)
professionRoute.delete('/:id', verifyJWT, profession_delete)
professionRoute.get('/', verifyJWT, profession_list)
professionRoute.post('/bycbo', verifyJWT, profession_byCbo)
professionRoute.post('/bytitle', verifyJWT, profession_byTitle)
professionRoute.post('/bytype', verifyJWT, profession_byType)
professionRoute.post('/search', verifyJWT, profession_search)

export default professionRoute