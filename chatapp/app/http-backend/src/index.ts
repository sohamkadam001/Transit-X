import express from "express";
import { prisma } from "./lib/prisma.js";
import { z } from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Middleware } from "./middleware/middleware.js";
const JWT_SECRET = process.env.JWT_SECRET!
const app = express();
app.use(express.json())
app.listen(3001)

app.post("/signup", async (req, res) => {
    const validator = z.object({
        email: z.email(),
        name: z.string(),
        password: z.string()
    })
    const parser = validator.safeParse(req.body)
    if (!parser.success) {
        res.json({
            msg: "Invalid Inputs",
            error: parser.error
        })
        return
    }
    try{
        const hashpass = await bcrypt.hash(parser.data.password, 8)
    const user = await prisma.user.create({
        data: {
            name: parser.data.name,
            email: parser.data.email,
            password: hashpass
        }
    })

    res.json({
        msg: "Sign up successfull"
    })
}catch(e){
    console.log(e)
}
})
app.post("/signin", async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (!user) {
        res.json({
            msg: "User does not exist"
        })
        return
    }
    const matchpass = await bcrypt.compare(password, user.password)
    if (!matchpass) {
        res.json({
            msg: "password is incorrect"
        })
        return
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET)
    return res.json({
        token
    })
})
app.post("/create-room", Middleware, async (req, res) => {
    const { slug, password } = req.body
    const creator = req.userId!
    const Room = await prisma.room.create({
        data: {
            slug,
            password,
            adminId: creator
        }
    })
    res.json({
        msg: "Room has been created successfully",
        Room
    })
})
app.get("/rooms", Middleware, async (req, res) => {
    const user = req.userId
    const Rooms = await prisma.room.findMany({
        select: {
            id: true,
            slug: true
        }
    })
    res.json({
        msg: "Here are the Rooms",
        Rooms
    })
})
app.get("/rooms/:id/messages", Middleware, async (req, res) => {
    const user = req.userId
    const param = req.params.id
    if (typeof param !== "string") {
        return res.json({
            msg: "INvalid Room iD"
        })
    }
    const messages = await prisma.message.findMany({
        where: {
            roomId: param
        }
    })
    res.json({
        messages
    })
})