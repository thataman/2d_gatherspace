import { Router } from "express";
import { getBulkUserData,getUserMetadaa } from "../controllers/userController";
export const userRouter = Router()

userRouter.route("/metadata").post(getUserMetadaa)
userRouter.route("/metadata/bulk").get(getBulkUserData)

