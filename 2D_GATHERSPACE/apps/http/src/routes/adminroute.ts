import { Router } from "express";
import { addElement,updateElement,createMap,createAvatars } from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminmiddleware";
export const adminRouter = Router()

adminRouter.route("/element").post(adminMiddleware,addElement)
adminRouter.route("/element/:elementid").put(adminMiddleware,updateElement)
adminRouter.route("/map").post(adminMiddleware,createMap)
adminRouter.route("/avatar").post(adminMiddleware,createAvatars)
