// app/api/freelancer/dashboard/route.ts
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
        freelancer: {
          include: {
            portfolio: {
              include: {
                projects: true,
              },
            },
          },
        },
        proposals: {
          include: {
            project: {
              select: {
                title: true,
              },
            },
          },
        },
        projects: true,
      },
    });

    if (!user || user.userType !== "FREELANCER") {
      return NextResponse.json(
        { error: "Forbidden: User is not a freelancer" },
        { status: 403 }
      );
    }

    const activeJobs = user.projects.filter(
      (project) => project.status === "IN_PROGRESS"
    ).length;
    const submittedProposals = user.proposals.length;
    const pendingProposals = user.proposals.filter(
      (proposal) => proposal.status === "PENDING"
    ).length;

    const totalEarnings = await prisma.project.aggregate({
      where: {
        proposals: {
          some: {
            freelancerId: userId,
            status: "ACCEPTED",
          },
        },
        status: "COMPLETED",
      },
      _sum: {
        budget: true,
      },
    });

    const completedProjects = user.projects.filter(
      (project) => project.status === "COMPLETED"
    ).length;
    const totalProjects = user.projects.length;
    const completionRate =
      totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    const dashboardData = {
      activeJobs,
      submittedProposals,
      pendingProposals,
      totalEarnings: totalEarnings._sum.budget || 0,
      completionRate: Math.round(completionRate),
      projects: user.projects.map((project) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        deadline: project.deadline,
      })),
      proposals: user.proposals.map((proposal) => ({
        id: proposal.id,
        projectTitle: proposal.project.title,
        status: proposal.status,
        bidAmount: proposal.bidAmount,
      })),
      portfolio:
        user.freelancer?.portfolio?.projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          projectUrl: project.projectUrl,
        })) || [],
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Error fetching freelancer dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
