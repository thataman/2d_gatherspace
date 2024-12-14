import { Router } from "express";
import { signupUser } from "../controllers/userController";
export const router = Router()

router.route("/signup").get(signupUser)
// router.route("/signin").get(signinUser)
// router.route("/elements").get(getElements)
// router.route("/avatars").get(getAvatars)

// router.use("/user")
// router.use("admin")
// router.use("/space")