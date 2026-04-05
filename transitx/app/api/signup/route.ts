import {z} from "zod"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"

export async function POST(req : Request) {
     const body = await req.json()
    const validator = z.object({
        email : z.email(),
        username : z.string().min(3,{message : "Username must contain atleat 3 characters"}).max(12,{message : "Username can contain maximum of 12 characters"}),
        password : z.string().min(8,{message : "Password must contain atleat 8 characters"}).max(15,{message : "Password can contain maximum of 15 characters"})
    })
    const parse = validator.safeParse(body)
    if(!parse.success){
        return Response.json({
            message : "Inavlid Inputs",
            error : parse.error
        })
    }
     const{email,password,username} = parse.data
     const hash = await bcrypt.hash(password,10)
      const user = await prisma.user.create({
        data : {
            email,
            username,
            password : hash
        }
     })
    const balance =  await prisma.balance.create({
        data : {
            userId : user.id,
            amount : Math.random() * 1000 + 1
        }
     })
     return Response.json({
        msg : "User has been Created Successfully",
        user,
        balance
        
     })


}