import { Request, Response, Router } from 'express'
import accountRoute from './accountRoute'
import accountTypesRoute from './accountTypesRoute'
import authRoute from './authRoute'
import categoryRoute from './categoryRoute'
import dashboardRoute from './dashboardRoute'
import emailRoute from './emailRoute'
import genderRoute from './genderRoute'
import profileRoute from './profileRoute'
import transactionRoute from './transactionRoute'
import transactionTypesRoute from './transactionTypesRoute'
import userRoute from './userRoute'

const router = Router()

// router.use('/user',userRoute)
router.get('/', (req, res) => {
    res.send('Bem-vindo!')
})

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/account', accountRoute)
router.use('/category', categoryRoute)
router.use('/profile', profileRoute)
router.use('/gender', genderRoute)
router.use('/transaction', transactionRoute)
router.use('/email', emailRoute)
router.use('/dashboard', dashboardRoute)
router.use('/accounttypes', accountTypesRoute)
router.use('/transactiontypes', transactionTypesRoute)

router.use((req: Request, res: Response, next) => {
    res.status(404).send('404 Not Found')
})

export default router
