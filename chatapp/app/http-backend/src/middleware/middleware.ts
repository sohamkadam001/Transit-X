import type { NextFunction, Request, Response } from "express"
import  jwt, {type JwtPayload } from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET!
declare global{
    namespace Express {
        export interface Request{
            userId? :string
        }
    }
}

export function Middleware(req : Request,res : Response,next : NextFunction){
    const token = req.headers.token
    if(typeof token !== "string"){
        return null
    }
    const decode = jwt.verify(token,JWT_SECRET) as JwtPayload
    if(!decode){
        res.json({
            msg : "Auth failed / Invalid Token"
        })
        return
    }
    req.userId = decode.id as string
    next();
}