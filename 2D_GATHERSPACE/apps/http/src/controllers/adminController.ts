import { Request, Response } from "express";
import { createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from "../validators/schemavalidator";
import client from "@repo/db/client";
import { ParseStatus } from "zod";

export const createElement = async (req: Request, res: Response) => {
    const parsedData = createElementSchema.safeParse(req.body)
    if(!parsedData){
        res.status(400).json({
            message : "validation failed "
        })
        return
    }


    const element = await client.element.create({
        data : {
            iamgeUrl : parsedData?.data?.imageUrl,
            width : parsedData?.data?.width ,
            height : parsedData?.data?.height,
            static : parsedData?.data?.static,

        }
    })

if (!element) {
    res.status(400).json({message : " element wasnt created"})
    return
}
    res.status(200).json({
        id : element.id
    })



}

export const updateElement = async (req: Request, res: Response) => {
    const parsedData = updateElementSchema.safeParse(req.body)
    if(!parsedData){
        res.status(400).json({
            message : "validation failed "
        })
        return
    }

    await client.element.update({
        where : {
            id : req.params.elementId
        },
        data : {
            imageUrl : parsedData?.data?.imageurl
        }
    })
    res.status(200).json({
        message : "element updated"
    })
}

export const createMap = async (req: Request, res: Response) => {
    const parsedData = createMapSchema.safeParse(req.body)
    if(!parsedData){
        res.status(400).json({
            message : "validation failed "
        })
        return
    }

    const map = await client.map.create({
        data : {
             name : parsedData?.data?.name ,
             thumbnail : parsedData?.data?.thumbnail,
             width : parsedData.data?.dimensions.split("x")[0],
             height : parsedData.data?.dimensions.split("x")[1],
             elements : {
                create : parsedData?.data?.defaultElements.map((e)=>({
                    elementId : e.elementId,
                    x : e.x,
                    y : e.y
                }))
             }
             
             
            
        }
    })
    res.status(200).json({ id : map.id})

}


export const createAvatar = async (req: Request, res: Response) => {
    const parsedData = createAvatarSchema.safeParse(req.body);
    if(!parsedData){
        res.status(400).json({
            message : "validation failed "
        })
        return
    }

    const avatar = await client.avatar.create({
        data : {
imageUrl : parsedData?.data?.imageurl,
name : parsedData?.data?.name
        }
        
    })

    if (!avatar) {
        res.status(400).json({message :"creating avatar failed "})
        return
    }
    res.status(200).json({ 
        avatarId : avatar.id
    })
}

