import { Router } from "express";
import { verifyJWT } from "../controllers/authController";
import { gender_create, gender_read, gender_update, gender_delete, gender_list } from "../controllers/genderController";

const genderRoute = Router();
genderRoute.post("/",verifyJWT, gender_create)
genderRoute.get("/:id", verifyJWT, gender_read)
genderRoute.put("/:id", verifyJWT, gender_update)
genderRoute.delete("/:id", verifyJWT, gender_delete)
genderRoute.get('/', verifyJWT, gender_list)

export default genderRoute;