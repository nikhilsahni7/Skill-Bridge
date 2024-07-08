// app/api/messages/route.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiverId, content } = await req.json();

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
      },
    });

    // Emit the message to the receiver using Socket.IO
    const io = (global as any).io as SocketIOServer;
    if (io) {
      io.to(receiverId).emit("receiveMessage", message);
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
