import { Request, Response } from "express";
import { addElementSchema, createSpaceSchema, deleteElementSchema } from "../validators/schemavalidator";
import client from "@repo/db/client";

interface CustomRequest extends Request {
    userId?: string;
}



export const createSpace = async (req: CustomRequest, res: Response) => {
    const parsedData = createSpaceSchema.safeParse(req.body)
    if (!parsedData) {
        res.status(400).json({ message: "didnt recived data" })
    }

    if (!parsedData?.data?.mapId) {
        const space = await client.space.create({
            data: {
                name: parsedData?.data?.name,
                width: parsedData?.data?.dimension.split("x")[0],
                height: parsedData?.data?.dimension.split("x")[1],
                creatorId: req.userId
            }
        })

        res.status(200).json({ spaceId: space.id })
        return
    }
    const map = await client.map.findUnique({
        where: {
            id: parsedData.data.mapId
        },
        select: {
            elements: true,
            width: true,
            height: true
        }
    })

    if (!map) {
        res.status(403).json({ message: "map not found" })
        return
    }


    let space = await client.$transaction(async () => {

        const space = await client.space.create({
            data: {
                name: parsedData?.data?.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId,

            }
        });


        const elementsAdded = await client.spaceElements.createMany({
            data: map.elements.map((e: any) => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x,
                y: e.y
            }))
        })

        return space;


    })




    res.status(200).json({ spaceId: space.id })


}

export const deleteSpace = async (req: CustomRequest, res: Response) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        select: {
            creatorId: true
        }
    })

    if (!space) {
        res.status(400).json({ message: " space not found" })
        return
    }

    if (space?.creatorId !== req.userId) {
        res.status(403).json({ message: "unauthorised" })
        return
    }
    await client.space.delete({
        where: {
            id: req.params.spaceId
        }

    })

    res.status(200).json({ message: " space deleted" })
}

export const getAllSpaces = async (req: CustomRequest, res: Response) => {
    const space = await client.space.findMany({
        where : { 
            creatorId : req.userId
        }
    })

    res.status(200).json({
        spaces : space.map((s : any)=>({
            id : s.id,
            name : s.name,
            thumbnail : s.thumbnail,
            dimensions : `${s.width} x ${s.height}`
        }))
    })
}


export const getSpace = async (req: Request, res: Response) => {
    res.json("signup")
}

export const addElement = async (req: CustomRequest, res: Response) => {
    const parsedData = addElementSchema.safeParse(req.body)
    if (!parsedData) {
        res.status(400).json({message : "validation failed"})
        
    }

    const space = await client.space.findUnique({
        where : {
            id : parsedData?.data?.spaceId,
creatorId : req.userId 
        }
    })


    if (!space) {
        res.status(400).json({
            message : " space not found"
        })
        return
    }

     await client.spaceelements.create({
        data : {
            elementId : parsedData?.data?.elementId,
            spaceId : parsedData?.data?.spaceId,
            x : parsedData?.data?.x,
            y : parsedData?.data?.y
        }
     })

     res.status(200).json({message : " element added"})
}


export const deleteElement = async (req:CustomRequest, res: Response) => {
    const parsedData = deleteElementSchema.safeParse(req.body)
    if (!parsedData) {
        res.status(400).json({ messge : " validation failed "})
        return
    }

    const space = await client.space.findUnique({
        where : {
             id : parsedData?.data?.spaceId,
             creatorId : req.userId
        }
    })

    if(!space){
        res.status(400).json({message : " space not found"})
    }

    
}