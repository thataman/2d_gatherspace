import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validators/schemavalidator";
import client from "@repo/db/client";
import { generateaccesstoken } from "../utils/utils";


export const signupUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = signupSchema.safeParse(req.body);
        if (!parsedData.success) {
             res.status(403).json({ message: "validation failed" })
            return
        }

        // const hashedPassword = await bycrpt.hash(parsedData.data.password, 10);

        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                // password: hashedPassword,
                role: parsedData.data.type === 'admin' ? "admin" : "user"
            }
        })

         res.status(200).json({ userId: user.id })
         return
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const signinUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const parsedData = signinSchema.safeParse(req.body)
        if (!parsedData.success) {
             res.status(403).json({ message: "validation failed" })
return
        }

        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        if (!user) {
             res.status(400).json({ message: "didnt find any user" })
            return
        }
        // const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password)

        // if (!isPasswordValid) {
        //     return res.status(400).json({ message: "wrong password" })
        // }
        const accesstoken = generateaccesstoken(user)
         res.status(200).json({ token: accesstoken })
         return
    } catch (error) {
        console.log(error);
        throw error

    }
}

export const getElements = async (req: Request, res: Response) => {
    res.json("signup")
}


export const getAvatars = async (req: Request, res: Response) => {
    res.json("signup")
}

export const getUserMetadata = async (req: Request, res: Response) => {
    res.json("signup")
}


export const getBulkUserData = async (req: Request, res: Response) => {
    res.json("signup")
}
