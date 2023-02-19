import {Router} from 'express'
import { verifyJWT } from '../controllers/authController'
import {sendEmail} from "../controllers/emailController"

const emailRoute = Router();
emailRoute.post("/send",verifyJWT,sendEmail)

export default emailRoute;