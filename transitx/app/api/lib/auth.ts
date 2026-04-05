import { error } from "console";
import  jwt  from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!

export function getuserId(req:Request){
  try{
    const header = req.headers.get("authorization")
    if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Unauthorized")
  }
    const token = header.split(" ")[1]
    const decode = jwt.verify(token,JWT_SECRET) as {
        id : string
    }
    if(!decode){
       throw new Error("Auth Failed")
    }
    return decode.id
  }catch(e){
    return null;
  }
}








