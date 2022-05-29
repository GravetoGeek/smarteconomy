import { Router } from "express";
import authRoute from "./authRoute";
import {Request, Response} from 'express';
import userRoute from "./userRoute";
const router = Router();

// router.use('/user',userRoute)
router.get('/', (req, res) => {
  res.send('Bem-vindo!')
})


router.use('/auth',authRoute)
router.use('/user',userRoute)

router.use((req:Request, res:Response, next) => {
  res.status(404).send('404 Not Found');
  }
)

export default router;