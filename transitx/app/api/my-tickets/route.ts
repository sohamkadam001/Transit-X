import { prisma } from "../lib/prisma";
import { getuserId } from "../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = getuserId(req);
    if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { CreatedAt: 'desc' }
    });

    return NextResponse.json(tickets);
  } catch (err) {
    return NextResponse.json({ msg: "Error fetching tickets" }, { status: 500 });
  }
}