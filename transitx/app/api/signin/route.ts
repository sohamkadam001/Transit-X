import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
    const body = await req.json();
    const { username, password } = body

    const user = await prisma.user.findFirst({
        where: {
            username
        }
    })
    if (!user) {
        return Response.json(
            { msg: "User Does not Exist" },
            { status: 404 }
        )
    }
    const matchpass = await bcrypt.compare(password, user.password)
    if (!matchpass) {
        return Response.json(
            { message: "Password is incorrect" },
            { status: 401 }
        )
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET)
    return Response.json(
        { token },
        { status: 200 }
    )
}