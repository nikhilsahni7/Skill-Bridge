// app/api/freelancer/my-projects/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        proposals: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user || user.userType !== "FREELANCER") {
      return NextResponse.json(
        { error: "Forbidden: User is not a freelancer" },
        { status: 403 }
      );
    }

    const projects = user.proposals.map((proposal) => ({
      id: proposal.project.id,
      title: proposal.project.title,
      status: proposal.project.status,
      deadline: proposal.project.deadline,
      budget: proposal.project.budget,
      description: proposal.project.description,
      skills: proposal.project.skills,
      proposalStatus: proposal.status,
    }));

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching freelancer's projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
