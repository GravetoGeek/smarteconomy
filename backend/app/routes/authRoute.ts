import { Router } from "express";
import { login, logout, signup } from "../controllers/authController";
import { Request, Response } from "express";

const authRoute = Router();
authRoute.get("/", (req: Request, res: Response) => {
  res.send("Rota auth");
});
authRoute.post("/login", login);
authRoute.get("/logout", logout);
authRoute.post("/signup", signup);

export default authRoute;
