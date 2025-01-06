import { Router } from "express";
import { createElement,updateElement,createMap,createAvatar } from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminmiddleware";
export const adminRouter = Router()

adminRouter.route("/element").post(adminMiddleware,createElement)
adminRouter.route("/element/:elementId").put(adminMiddleware,updateElement)
adminRouter.route("/map").post(adminMiddleware,createMap)
adminRouter.route("/avatar").post(adminMiddleware,createAvatar)
