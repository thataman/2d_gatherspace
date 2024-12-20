import { Router } from "express";
import { addElement,updateElement,createMap,createAvatars } from "../controllers/adminController";
export const adminRouter = Router()

adminRouter.route("/element").post(addElement)
adminRouter.route("/element/:elementid").put(updateElement)
adminRouter.route("/map").post(createMap)
adminRouter.route("/avatar").post(createAvatars)
