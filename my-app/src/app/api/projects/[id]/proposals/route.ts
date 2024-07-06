// app/api/projects/[id]/proposals/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { proposals: { include: { freelancer: true } } },
    });

    if (!project || project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, proposals: project.proposals });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { proposalId, status } = await req.json();
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
    });

    if (status === "ACCEPTED") {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json({ success: true, proposal: updatedProposal });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
