import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signIn);
