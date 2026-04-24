import { prisma } from "../lib/prisma"
import { getuserId } from "../lib/auth"

export async function POST(req: Request) {
    try {
        const userId = getuserId(req)
        const { from, to, type, fare } = await req.json()

        if (typeof userId !== "string") {
            return Response.json({ msg: "Unauthorized" }, { status: 401 });
        }
        if (!from || !to || fare === undefined) {
            return Response.json({ msg: "Invalid input" }, { status: 400 })
        }

        const fromStation = await prisma.station.findUnique({
            where: { name: from }
        })

        const toStation = await prisma.station.findUnique({
            where: { name: to }
        })

        if (!fromStation || !toStation) {
            return Response.json({ msg: "Station not found" }, { status: 404 })
        }
        const ticket = await prisma.$transaction(async (tx) => {
            const balance = await tx.balance.findUnique({
                where: { userId }
            })
            if (!balance || balance.amount < fare) {
                throw new Error("Insufficient balance")
            }
            await tx.balance.update({
                where: { userId },
                data: {
                    amount: {
                        decrement: fare
                    }
                }
            })

            const qrData = `${userId}-${from}-${to}-${Date.now()}`

            const ticket = await tx.ticket.create({
                data: {
                    userId,
                    from,
                    to,
                    fare,
                    qrcode: qrData,
                    type: type || "Single",
                    ExpiresAt: new Date(Date.now() + 86400000)
                }
            })
            return ticket
        })

        return Response.json({
            msg: "Ticket created successfully",
            fare,
            ticket
        }, { status: 200 })

    } catch (err) {
        return Response.json(
            {
                msg:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
            },
            { status: 400 }
        )
    }
}