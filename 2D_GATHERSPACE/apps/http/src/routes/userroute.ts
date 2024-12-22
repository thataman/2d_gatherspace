import { Router } from "express";
import { getBulkUserData,getUserMetadata } from "../controllers/userController";
import { userMiddleware } from "../middleware/usermiddleware";
export const userRouter = Router()

userRouter.route("/metadata").post(userMiddleware,getUserMetadata)
userRouter.route("/metadata/bulk").get(userMiddleware,getBulkUserData)

