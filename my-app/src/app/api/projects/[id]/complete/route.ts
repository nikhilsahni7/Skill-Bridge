// app/api/projects/[id]/complete/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
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
      include: {
        proposals: {
          where: { status: "ACCEPTED" },
          include: { freelancer: true },
        },
      },
    });

    if (!project || project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    if (project.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Project is not in progress" },
        { status: 400 }
      );
    }

    const acceptedProposal = project.proposals[0];

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" },
    });

    // Update freelancer's earnings and completed projects
    await prisma.freelancerProfile.update({
      where: { userId: acceptedProposal.freelancerId },
      data: {
        totalEarnings: {
          increment: project.budget,
        },
        completedProjects: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
