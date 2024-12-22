import  Jwt  from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface USER{
    id:string,
    role:string
}

export const generateaccesstoken = (user :USER )=>{

    const secretkey = process.env.ACCESSSECRETKEY as string
    return Jwt.sign({userId:user.id,role:user.role },secretkey,{expiresIn:"15m"}) 
}

export const refreshaccesstoken = (user :USER )=>{

    const secretkey = process.env.REFRESHSECRETKEY as string
    return Jwt.sign({userID:user.id },secretkey,{expiresIn:"4d"}) 
}