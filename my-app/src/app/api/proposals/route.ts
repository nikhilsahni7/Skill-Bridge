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

    // Validate input
    if (
      !projectId ||
      !coverLetter ||
      isNaN(parseFloat(bidAmount)) ||
      isNaN(parseInt(deliveryTime))
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check project status
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot submit proposal for a completed project" },
        { status: 400 }
      );
    }

    const newProposal = await prisma.proposal.create({
      data: {
        coverLetter,
        bidAmount: parseFloat(bidAmount),
        deliveryTime: parseInt(deliveryTime),
        status: "PENDING",
        freelancer: {
          connect: { id: session.user.id },
        },
        project: {
          connect: { id: projectId },
        },
      },
      include: {
        project: true,
        freelancer: true,
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
