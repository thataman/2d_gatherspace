import {z} from "zod"

export const signupSchema = z.object({

    username : z.string().email(),
    password : z.string().min(8),
    role : z.enum(["user","admin"])
})

export const signinSchema = z.object({
    username : z.string().email(),
    password : z.string().min(8)
})


export const updateMetadataSchema = z.object({
    avatarid : z.string()
})

export const createSpaceSchema = z.object({
    name : z.string(),
    dimension : z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId : z.string()
})


export const deleteElementSchema = z.object({

Id : z.string()
})


export const addElementSchema = z.object({
    elementId : z.string(),
    spaceId : z.string(),
    x : z.number(),
    y : z.number()
})

export const createElementSchema = z.object({
    imageUrl : z.string(),
    width : z.number(),
    height : z.number(),
    static : z.boolean()
})

export const updateElementSchema = z.object({
    imageurl : z.string()
})


export const createAvatarSchema = z.object({
    imageurl : z.string(),
    name : z.string()
})

export const createMapSchema = z.object({
    name : z.string(),
    thumbnail : z.string(),
    dimensions : z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements : z.array(z.object({
        elementId : z.string(),
        x : z.number(),
        y : z.number()
    }))
})