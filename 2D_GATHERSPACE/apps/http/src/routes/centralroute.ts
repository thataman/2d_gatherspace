import { Router } from "express";
import { signupUser,signinUser,getElements,getAvatars } from "../controllers/userController";
import { userRouter } from "./userroute";
import { adminRouter } from "./adminroute";
import { spaceRouter } from "./spaceroute";



export const router = Router()

router.route("/signup").get(signupUser)
router.route("/signin").get(signinUser)
router.route("/elements").get(getElements)
router.route("/avatars").get(getAvatars)

router.use("/user" , userRouter)
router.use("admin" ,adminRouter)
router.use("/space",spaceRouter)