import { Express } from "express";
import { Router } from "express";
import authControllers from "../controllers/auth.controllers";
const AuthRouter = Router();


AuthRouter.post("/register", authControllers.Register);

export default AuthRouter;