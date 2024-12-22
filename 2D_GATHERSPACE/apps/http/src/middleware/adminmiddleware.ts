import { Request, Response, NextFunction } from "express"
import Jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface CustomadminRequest extends Request {
    userId?: string;
}


export const adminMiddleware = async (req: CustomadminRequest, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const token = header?.split(" ")[1]

    if (!token) {
        res.status(400).json({ message: "Unauthorized" });
        return
    }

    try {
        const secretkey = process.env.ACCESSSECRETKEY as string
        const decodedinfo = Jwt.verify(token, secretkey) as { role: string, userId: string }
        if (decodedinfo.role !== "admin") {
            res.status(400).json({ message: "unauthorised" })
            return
        }
        req.userId = decodedinfo.userId
        next()

    } catch (error) {
        res.status(400).json({ message: "unauthorised" })
        return
    }
}