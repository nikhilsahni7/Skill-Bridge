// app/api/conversations/route.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: { not: session.user.id } },
          { receiverId: session.user.id, senderId: { not: session.user.id } },
        ],
      },
      // ... rest of the query remains the same

      orderBy: {
        createdAt: "desc",
      },
      distinct: ["senderId", "receiverId"],
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedConversations = conversations.map((conv: any) => {
      const participant =
        conv.senderId === session?.user?.id ? conv.receiver : conv.sender;
      return {
        id: conv.id,
        participantId: participant.id,
        participantName: participant.name,
        lastMessage: conv.content,
        lastMessageTime: conv.createdAt,
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
