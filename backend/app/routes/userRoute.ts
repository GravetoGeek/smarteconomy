import { Router } from "express";
import { verifyJWT } from "../controllers/authController";
import { user_create, user_read, user_update, user_delete, user_list } from "../controllers/userController";


const userRoute = Router();
userRoute.post("/",verifyJWT, user_create);
userRoute.get("/:id", verifyJWT, user_read);
userRoute.put("/:id", verifyJWT, user_update);
userRoute.delete("/:id", verifyJWT, user_delete);
userRoute.get('/', verifyJWT, user_list)

export default userRoute;