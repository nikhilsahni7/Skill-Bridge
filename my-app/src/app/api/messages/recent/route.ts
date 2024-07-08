// app/api/messages/recent/route.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recentMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(recentMessages);
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
