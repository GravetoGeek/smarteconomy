import {Router} from 'express'
import { verifyJWT } from '../controllers/authController'
import {sendMail} from "../controllers/emailController"

const emailRoute = Router();
emailRoute.post("/send",verifyJWT,sendMail)

export default emailRoute;