// app/api/proposals/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, coverLetter, bidAmount, deliveryTime } =
      await req.json();

    const newProposal = await prisma.proposal.create({
      data: {
        projectId,
        freelancerId: session.user.id,
        coverLetter,
        bidAmount: parseFloat(bidAmount),
        deliveryTime: parseInt(deliveryTime),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposals = await prisma.proposal.findMany({
      where: { freelancerId: session.user.id },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, proposals });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
