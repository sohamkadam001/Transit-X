import { prisma } from "../lib/prisma";
import { getuserId } from "../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = getuserId(req);

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}