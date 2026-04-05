import { prisma } from "../lib/prisma"
import { getuserId } from "../lib/auth"

function calculateFare(distance: number) {
    if (distance <= 5) return 10
    if (distance <= 10) return 20
    if (distance <= 20) return 30
    return 50
}

export async function POST(req: Request) {
    try {
        const userId = getuserId(req)
        const { from, to } = await req.json()
        if(typeof userId !== "string"){
            return Response.json({ msg: "Unauthorized" }, { status: 401 });
        }
        if (!from || !to) {
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

        const connections = await prisma.connection.findMany()


        const graph: Record<string, { to: string; distance: number }[]> = {}

        connections.forEach((c) => {
            if (!graph[c.fromId]) graph[c.fromId] = []

            graph[c.fromId].push({
                to: c.toId,
                distance: c.distance
            })
        })


        function findDistance(start: string, end: string) {
            const queue = [{ node: start, distance: 0 }]
            const visited = new Set<string>()

            while (queue.length > 0) {
                const current = queue.shift()!

                if (current.node === end) {
                    return current.distance
                }

                if (visited.has(current.node)) continue
                visited.add(current.node)

                const neighbors = graph[current.node] || []

                for (const n of neighbors) {
                    queue.push({
                        node: n.to,
                        distance: current.distance + n.distance
                    })
                }
            }

            return null
        }

        const distance = findDistance(fromStation.id, toStation.id)

        if (!distance) {
            return Response.json({ msg: "Route not found" }, { status: 404 })
        }

        const fare = calculateFare(distance)


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
                    ExpiresAt: new Date(Date.now() + 86400000)
                }
            })

            return ticket
        })

        return Response.json({
            msg: "Ticket created successfully",
            distance,
            fare,
            ticket
        })

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