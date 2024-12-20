import { Router } from "express";
import { createSpace,deleteSpace,getAllSpaces,getSpace,addElement,deleteElement } from "../controllers/spaceController";
export const spaceRouter = Router()

spaceRouter.route("/").post(createSpace)
spaceRouter.route("/:spaceid").delete(deleteSpace)
spaceRouter.route("/all").get(getAllSpaces)
spaceRouter.route("/:spaceid").get(getSpace)
spaceRouter.route("/element").post(addElement)
spaceRouter.route("/element").delete(deleteElement)