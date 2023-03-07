import { Router } from "express";
import authRoute from "./authRoute";
import {Request, Response} from 'express';
import userRoute from "./userRoute";
import accountRoute from "./accountRoute";
import categoryRoute from "./categoryRoute";
import profileRoute from "./profileRoute";
import genderRoute from "./genderRoute";
import transactionRoute from "./transactionRoute";
import emailRoute from './emailRoute'
import dashboardRoute from "./dashboardRoute";

const router = Router();

// router.use('/user',userRoute)
router.get('/', (req, res) => {
  res.send('Bem-vindo!')
})


router.use('/auth',authRoute)
router.use('/user',userRoute)
router.use('/account',accountRoute)
router.use('/category',categoryRoute)
router.use('/profile',profileRoute)
router.use('/gender',genderRoute)
router.use('/transaction',transactionRoute)
router.use('/email',emailRoute)
router.use('/dashboard',dashboardRoute)

router.use((req:Request, res:Response, next) => {
  res.status(404).send('404 Not Found');
  }
)

export default router;