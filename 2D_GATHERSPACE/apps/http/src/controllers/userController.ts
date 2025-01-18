import { Request, Response } from "express";
import { signinSchema, signupSchema, updateMetadataSchema } from "../validators/schemavalidator";

import client from "@repo/db/client";
import { generateaccesstoken } from "../utils/utils";
interface CustomRequest extends Request {
    userId?: string;
}

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
                role: parsedData.data.role === 'admin' ? "admin" : "user"
            }
        })

        res.status(200).json({ userId: user.id })
        return
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error })
    }
}

export const signinUser = async (req: Request, res: Response): Promise<void> => {
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
        res.status(400).json({ message: error })

    }
}

export const getElements = async (req: Request, res: Response) => {
    res.json("signup")
}


export const getAvatars = async (req: Request, res: Response) => {
    res.json("signup")
}

export const getUserMetadata = async (req: CustomRequest, res: Response) => {
    const parsedData = updateMetadataSchema.safeParse(req.body)
    if (!parsedData) {
        res.status(400).json({ message: "metadata didnt recieved" })
        return
    }

    try {
        const user = await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data?.avatarid
            }
        })
        res.status(200).json({ message: "metadata updated" })
    } catch (error) {
        res.status(400).json({ message: error })
    }
}




export const getBulkUserData = async (req: Request, res: Response) => {

   try {
     const userIdString = (req.query.ids ?? "[]") as String
     const userIds = (userIdString).slice(1, userIdString?.length - 2).split(",")
     console.log(
         userIds
     );
 
     const metadata = await client.user.findMany({
         where: {
             id: userIds
         },
         select: {
             avatar: true,
             id: true
         }
     })
 
     if (!metadata) {
         res.status(400).json({ message: "didnt get users metadata" })
         return
     }
 
     res.status(200).json({
       avatars : metadata.map((m : any)=> ({
         userId : m.id,
         imageUrl : m.avatar?.imageUrl
       })    )
     })
 
   } catch (error) {
    res.status(400).json({error })
   }
}
