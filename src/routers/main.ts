import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from "../controllers/tweet";

import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signIn);

mainRouter.post("/tweet", verifyJWT, tweetController.addTweet);
