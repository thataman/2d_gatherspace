import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validators/schemavalidator";
import client from "@repo/db/client";

export const signupUser = async (req: Request, res: Response) => {
    try {
        const parsedData = signupSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(403).json({ message: "validation failed" })

        }

        // const hashedPassword = await bycrpt.hash(parsedData.data.password, 10);

        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                // password: hashedPassword,
                role: parsedData.data.type === 'admin' ? "admin" : "user"
            }
        })

        return res.status(200).json({ userId: user.id })

    } catch (error) {
        console.log(error);
        throw error
    }
}

export const signinUser = async (req: Request, res: Response) => {
    try {
        const parsedData = signinSchema.safeParse(req.body)
        if (!parsedData.success) {
            return res.status(403).json({ message: "validation failed" })

        }

        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        if (!user) {
            return res.status(400).json({ message: "didnt find any user" })
        }
        // const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password)

        // if (!isPasswordValid) {
        //     return res.status(400).json({ message: "wrong password" })
        // }

        return res.status(200).json({token:"iehfijqpra"})

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

export const getUserMetadaa = async (req: Request, res: Response) => {
    res.json("signup")
}


export const getBulkUserData = async (req: Request, res: Response) => {
    res.json("signup")
}
