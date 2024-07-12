import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { connect } from "http2";

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
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating. Must be between 1 and 5" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        proposals: {
          where: { status: "ACCEPTED" },
          include: { freelancer: true },
        },
        review: true,
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

    if (project.review) {
      return NextResponse.json(
        { error: "Review already exists for this project" },
        { status: 400 }
      );
    }

    const acceptedProposal = project.proposals[0];

    if (!acceptedProposal || !acceptedProposal.freelancer) {
      return NextResponse.json(
        { error: "No accepted proposal found for this project" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (prisma) => {
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

      // Update client's money spent
      await prisma.clientProfile.update({
        where: { userId: session?.user?.id },
        data: {
          moneySpent: {
            increment: project.budget,
          },
        },
      });
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await prisma.review.create({
        data: {
          projectId,

          clientId: session?.user?.id,
          freelancerId: acceptedProposal.freelancerId,
          rating,
          comment,
        },
      });
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
