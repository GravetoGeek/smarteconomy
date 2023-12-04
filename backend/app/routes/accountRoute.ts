import { Router } from "express";
import { verifyJWT } from "../controllers/authController";
import { account_create, account_read, account_update, account_delete, account_list } from "../controllers/accountController";

const accountRoute = Router();
accountRoute.post("/",verifyJWT, account_create);
accountRoute.get("/:id", verifyJWT, account_read);
accountRoute.put("/:id", verifyJWT, account_update);
accountRoute.delete("/:id", verifyJWT, account_delete);
accountRoute.get('/', verifyJWT, account_list)

export default accountRoute;