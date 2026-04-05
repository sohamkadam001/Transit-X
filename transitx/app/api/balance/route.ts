import { getuserId } from "../lib/auth";
import { prisma } from "../lib/prisma";

export async function GET(req : Request) {
    const userId = getuserId(req)
     if(!userId){
         return Response.json({ msg: "Unauthorized" }, { status: 401 })
    }
    const balance = await prisma.balance.findUnique({
        where : {
            userId : userId
        },
        select : {
            amount : true
        }
    })
    return Response.json({
        balance   
     })
}