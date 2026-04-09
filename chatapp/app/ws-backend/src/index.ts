import { WebSocketServer, WebSocket } from "ws"
const wss = new WebSocketServer({ port: 8080 })
import jwt from "jsonwebtoken"
import { prisma } from "./lib/prisma.js"
const JWT_SECRET = process.env.JWT_SECRET!
interface User {
    ws: WebSocket,
    room: string[],
    userId: string
}
interface IncommingMessage {
    type: "join-room" | "chat" | "leave-room",
    roomId: string,
    password?: string,
    message?: string
}
let users: User[] = [];
wss.on("connection", function (ws, req) {
    const url = req.url
    const param = new URLSearchParams(url?.split("?")[1])
    const token = param.get("token")
    if (!token || typeof token !== "string") {
        ws.close();
    }
    const decode = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload
    if (!decode) {
        ws.close();
    }
    const userId = decode.id
    users.push({
        ws,
        room: [],
        userId
    })
    ws.on("close", () => {
        users = users.filter((x) => x.ws !== ws)
    })
    ws.on("message", async function message(data) {
        const parsed: IncommingMessage = JSON.parse(data.toString())
        if (parsed.type === "join-room") {
            const roomId = parsed.roomId
            const roompass = parsed.password
            const matchRoomPass = await prisma.room.findFirst({
                where: {
                    id: roomId
                }
            })
            if (!matchRoomPass) {
                ws.send(JSON.stringify({
                    error: "Room does not exist"
                }))
                return
            }
            if (roompass !== matchRoomPass?.password)
                ws.send(JSON.stringify({
                    error: "Password is incorrect"
                }))
            const currentUser = users.find(x => x.ws === ws)
            if (!currentUser) {
                return;
            }
            currentUser.room.push(roomId)
        }

        if (parsed.type === "leave-room") {
            const user = users.find(x => x.ws === ws)
            if (!user) {
                return
            }
            user.room = user.room.filter(x => x !== parsed.roomId)
        }
        if (parsed.type === "chat") {
            const roomsId = parsed.roomId
            const message = parsed.message
            const user = users.find(x => x.ws === ws)
            if (!message) {
                return
            }
            if (!user) {
                return
            }
            if (!user.room.includes(roomsId)) {
                ws.send(JSON.stringify({
                    error: "You are not in this room!"
                }));
                return;
            }
            await prisma.message.create({
                data: {
                    roomId: roomsId,
                    Message: message,
                    senderId: user.userId
                }
            })
            users.forEach(user => {
                if (user.room.includes(roomsId)) {
                    user.ws.send(JSON.stringify({
                        message
                    }))
                }
            })

        }


    })
})










